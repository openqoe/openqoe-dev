/**
 * Video.js Player Adapter
 */

import { PlayerAdapter, VideoMetadata, PlayerState, Resolution, CMCDData, PlayerError } from '../types';
import { EventCollector } from '../core/EventCollector';
import { BatchManager } from '../core/BatchManager';
import { Logger } from '../utils/logger';

export class VideoJsAdapter implements PlayerAdapter {
  private player: any = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private metadata: VideoMetadata = {};
  private eventHandlers: Map<string, Function> = new Map();

  // State tracking
  private lastPlaybackTime: number = 0;
  private playingTime: number = 0;
  private watchTime: number = 0;
  private stallStartTime: number | null = null;
  private viewStartTime: number | null = null;
  private seekStartTime: number = 0;
  private rebufferCount: number = 0;
  private rebufferDuration: number = 0;
  private quartileFired: Set<number> = new Set();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private seekFrom: number = 0;

  constructor(
    eventCollector: EventCollector,
    batchManager: BatchManager,
    logger: Logger
  ) {
    this.eventCollector = eventCollector;
    this.batchManager = batchManager;
    this.logger = logger;
  }

  /**
   * Attach to Video.js player
   */
  attach(player: any, metadata: VideoMetadata): void {
    if (!player || typeof player.on !== 'function') {
      throw new Error('VideoJsAdapter: player must be a Video.js player instance');
    }

    this.player = player;
    this.metadata = metadata;

    // Set player info
    const version = player.constructor?.VERSION || player.VERSION || undefined;
    this.eventCollector.setPlayerInfo({
      name: 'videojs',
      version: version,
      autoplay: player.autoplay(),
      preload: player.preload()
    });

    // Attach event listeners
    this.attachEventListeners();

    this.logger.info('VideoJsAdapter attached');
  }

  /**
   * Detach from player
   */
  detach(): void {
    if (!this.player) return;

    this.stopHeartbeat();

    // Remove all event listeners
    this.eventHandlers.forEach((handler, event) => {
      this.player?.off(event, handler);
    });
    this.eventHandlers.clear();

    this.player = null;
    this.logger.info('VideoJsAdapter detached');
  }

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    if (!this.player) return;

    this.on('ready', () => this.onPlayerReady());
    this.on('loadstart', () => this.onViewStart());
    this.on('play', () => this.onPlaying());
    this.on('pause', () => this.onPause());
    this.on('seeking', () => this.onSeeking());
    this.on('seeked', () => this.onSeeked());
    this.on('waiting', () => this.onStallStart());
    this.on('playing', () => this.onPlayingAfterWait());
    this.on('ended', () => this.onEnded());
    this.on('error', () => this.onErrorEvent());
    this.on('timeupdate', () => this.onTimeUpdate());

    // Quality change event (if quality selector is available)
    if (this.player.qualityLevels && typeof this.player.qualityLevels === 'function') {
      const qualityLevels = this.player.qualityLevels();
      qualityLevels.on('change', () => this.onQualityChange());
    }
  }

  /**
   * Helper to add event listener and track it
   */
  private on(event: string, handler: Function): void {
    if (!this.player) return;

    this.player.on(event, handler);
    this.eventHandlers.set(event, handler);
  }

  /**
   * Player Ready event
   */
  async onPlayerReady(): Promise<void> {
    if (!this.player) return;
    // Get page load time using Navigation Timing Level 2
    let pageLoadTime: number | undefined;
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
    }
    const event = await this.eventCollector.createEvent('playerready', {
      page_load_time: pageLoadTime
    });

    this.batchManager.addEvent(event);
    this.logger.debug('playerready event fired');
  }

  /**
   * View Start event
   */
  async onViewStart(): Promise<void> {
    this.viewStartTime = performance.now();

    const event = await this.eventCollector.createEvent('viewstart', {
      preroll_requested: false
    });

    this.batchManager.addEvent(event);
    this.logger.debug('viewstart event fired');
  }

  /**
   * Playing event
   */
  async onPlaying(): Promise<void> {
    if (!this.player) return;

    // Calculate video startup time if this is first play
    const startupTime = this.viewStartTime ? performance.now() - this.viewStartTime : undefined;

    const event = await this.eventCollector.createEvent(
      'playing',
      {
        video_startup_time: startupTime,
        bitrate: this.getBitrate(),
        resolution: this.getVideoResolution(),
        framerate: this.getFramerate()
      },
      this.player.currentTime() * 1000
    );

    this.batchManager.addEvent(event);

    // Start heartbeat
    this.startHeartbeat();

    this.logger.debug('playing event fired');
  }

  /**
   * Pause event
   */
  async onPause(): Promise<void> {
    if (!this.player) return;

    // Stop heartbeat
    this.stopHeartbeat();

    const event = await this.eventCollector.createEvent(
      'pause',
      {
        playing_time: this.playingTime
      },
      this.player.currentTime() * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('pause event fired');
  }

  /**
   * Seeking event
   */
  onSeeking(): void {
    if (!this.player) return;
    this.seekFrom = this.player.currentTime() * 1000;
    this.seekStartTime = performance.now();
  }

  /**
   * Seeked event
   */
  async onSeeked(): Promise<void> {
    if (!this.player) return;

    const seekTo = this.player.currentTime() * 1000;
    const seekLatency = performance.now() - (this.seekStartTime || 0);

    const event = await this.eventCollector.createEvent(
      'seek',
      {
        from: this.seekFrom,
        to: seekTo,
        seek_latency: seekLatency
      },
      seekTo
    );

    this.batchManager.addEvent(event);
    this.logger.debug('seek event fired');
  }

  /**
   * Stall Start (waiting) event
   */
  async onStallStart(): Promise<void> {
    if (!this.player || this.stallStartTime !== null) return;

    this.stallStartTime = performance.now();

    const event = await this.eventCollector.createEvent(
      'stall_start',
      {
        buffer_length: this.getBufferLength(),
        bitrate: this.getBitrate()
      },
      this.player.currentTime() * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('stall_start event fired');
  }

  /**
   * Playing after waiting - Stall End
   */
  async onPlayingAfterWait(): Promise<void> {
    if (!this.player) return;

    // If we were stalled, fire stall_end
    if (this.stallStartTime !== null) {
      const stallDuration = performance.now() - this.stallStartTime;
      this.rebufferDuration += stallDuration;
      this.rebufferCount++;

      const event = await this.eventCollector.createEvent(
        'stall_end',
        {
          stall_duration: stallDuration,
          buffer_length: this.getBufferLength()
        },
        this.player.currentTime() * 1000
      );

      this.batchManager.addEvent(event);
      this.stallStartTime = null;
      this.logger.debug('stall_end event fired');
    }
  }

  /**
   * Ended event
   */
  async onEnded(): Promise<void> {
    if (!this.player) return;

    this.stopHeartbeat();

    const totalWatchTime = this.viewStartTime ? performance.now() - this.viewStartTime : 0;
    const completionRate = this.player.duration() > 0 ? this.player.currentTime() / this.player.duration() : 1;

    const event = await this.eventCollector.createEvent(
      'ended',
      {
        playing_time: this.playingTime,
        total_watch_time: totalWatchTime,
        completion_rate: completionRate,
        rebuffer_count: this.rebufferCount,
        rebuffer_duration: this.rebufferDuration
      },
      this.player.currentTime() * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('ended event fired');
  }

  /**
   * Error event
   */
  async onErrorEvent(): Promise<void> {
    if (!this.player) return;

    const error = this.player.error();
    if (!error) return;

    const errorCode = error.code;
    let errorFamily: string;
    let errorMessage: string;

    switch (errorCode) {
      case 1: // MEDIA_ERR_ABORTED
        errorFamily = 'source';
        errorMessage = error.message || 'Media loading aborted';
        break;
      case 2: // MEDIA_ERR_NETWORK
        errorFamily = 'network';
        errorMessage = error.message || 'Network error while loading media';
        break;
      case 3: // MEDIA_ERR_DECODE
        errorFamily = 'decoder';
        errorMessage = error.message || 'Media decoding error';
        break;
      case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
        errorFamily = 'source';
        errorMessage = error.message || 'Media format not supported';
        break;
      default:
        errorFamily = 'source';
        errorMessage = error.message || 'Unknown error';
    }

    this.onError({
      code: errorCode,
      message: errorMessage,
      fatal: true,
      context: {
        error_family: errorFamily
      }
    });
  }

  /**
   * Error handler
   */
  async onError(error: PlayerError): Promise<void> {
    if (!this.player) return;

    const event = await this.eventCollector.createEvent(
      'error',
      {
        error_family: error.context?.error_family || 'source',
        error_code: String(error.code),
        error_message: error.message,
        error_context: error.context
      },
      this.player.currentTime() * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('error event fired', error);
  }

  /**
   * Quality Change event
   */
  async onQualityChange(): Promise<void> {
    if (!this.player) return;

    const event = await this.eventCollector.createEvent(
      'qualitychange',
      {
        bitrate: this.getBitrate(),
        resolution: this.getVideoResolution(),
        framerate: this.getFramerate()
      },
      this.player.currentTime() * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('qualitychange event fired');
  }

  /**
   * Time Update - Track quartiles
   */
  async onTimeUpdate(): Promise<void> {
    if (!this.player) return;

    const progress = this.player.currentTime() / this.player.duration();

    // Track quartiles
    const quartiles = [0.25, 0.50, 0.75, 1.0];
    for (const q of quartiles) {
      if (progress >= q && !this.quartileFired.has(q)) {
        this.quartileFired.add(q);

        const event = await this.eventCollector.createEvent(
          'quartile',
          {
            quartile: q * 100,
            playing_time: this.playingTime,
            watch_time: this.watchTime
          },
          this.player.currentTime() * 1000
        );

        this.batchManager.addEvent(event);
        this.logger.debug(`quartile ${q * 100}% fired`);
      }
    }

    // Update playing time
    if (!this.player.paused()) {
      const timeDelta = this.player.currentTime() - this.lastPlaybackTime;
      if (timeDelta > 0 && timeDelta < 1) { // Sanity check
        this.playingTime += timeDelta * 1000; // Convert to ms
      }
    }

    this.lastPlaybackTime = this.player.currentTime();
    this.watchTime = this.viewStartTime ? Date.now() - this.viewStartTime : 0;
  }

  /**
   * Heartbeat - Send periodic updates
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(async () => {
      if (!this.player) return;

      const event = await this.eventCollector.createEvent(
        'heartbeat',
        {
          playing_time: this.playingTime,
          bitrate: this.getBitrate(),
          buffer_length: this.getBufferLength(),
          dropped_frames: this.getDroppedFrames()
        },
        this.player.currentTime() * 1000
      );

      this.batchManager.addEvent(event);
      this.logger.debug('heartbeat event fired');
    }, 10000); // Every 10 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Get current time in seconds
   */
  getCurrentTime(): number {
    return this.player?.currentTime() || 0;
  }

  /**
   * Get duration in seconds
   */
  getDuration(): number {
    return this.player?.duration() || 0;
  }

  /**
   * Get bitrate
   */
  getBitrate(): number | null {
    if (!this.player) return null;

    // Try to get from quality levels
    if (this.player.qualityLevels && typeof this.player.qualityLevels === 'function') {
      const qualityLevels = this.player.qualityLevels();
      for (let i = 0; i < qualityLevels.length; i++) {
        const level = qualityLevels[i];
        if (level.enabled) {
          return level.bitrate || null;
        }
      }
    }

    // Try to get from tech
    const tech = this.player.tech({ IWillNotUseThisInPlugins: true });
    if (tech && tech.vhs) {
      const playlists = tech.vhs.playlists;
      if (playlists && playlists.media_) {
        return playlists.media_.attributes?.BANDWIDTH || null;
      }
    }

    return null;
  }

  /**
   * Get video resolution
   */
  getVideoResolution(): Resolution | null {
    if (!this.player) return null;

    const tech = this.player.tech({ IWillNotUseThisInPlugins: true });
    if (!tech || !tech.el_) return null;

    return {
      width: tech.el_.videoWidth,
      height: tech.el_.videoHeight
    };
  }

  /**
   * Get framerate
   */
  getFramerate(): number | null {
    if (!this.player) return null;

    // Try to get from quality levels
    if (this.player.qualityLevels && typeof this.player.qualityLevels === 'function') {
      const qualityLevels = this.player.qualityLevels();
      for (let i = 0; i < qualityLevels.length; i++) {
        const level = qualityLevels[i];
        if (level.enabled && level.frameRate) {
          return level.frameRate;
        }
      }
    }

    return null;
  }

  /**
   * Get dropped frames
   */
  getDroppedFrames(): number | undefined {
    if (!this.player) return undefined;

    const tech = this.player.tech({ IWillNotUseThisInPlugins: true });
    if (!tech || !tech.el_) return undefined;

    const videoElement = tech.el_;
    if (videoElement.getVideoPlaybackQuality) {
      const quality = videoElement.getVideoPlaybackQuality();
      return quality.droppedVideoFrames;
    }

    return undefined;
  }

  /**
   * Get player state
   */
  getPlayerState(): PlayerState {
    if (!this.player) {
      return {
        currentTime: 0,
        duration: 0,
        paused: true,
        ended: false,
        buffered: null,
        readyState: 0
      };
    }

    return {
      currentTime: this.player.currentTime(),
      duration: this.player.duration(),
      paused: this.player.paused(),
      ended: this.player.ended(),
      buffered: this.player.buffered(),
      readyState: this.player.readyState()
    };
  }

  /**
   * Get CMCD data (not available for basic Video.js)
   */
  getCMCDData(): CMCDData | null {
    return null;
  }

  /**
   * Get buffer length in ms
   */
  private getBufferLength(): number | undefined {
    if (!this.player) return undefined;

    const buffered = this.player.buffered();
    if (!buffered || buffered.length === 0) return undefined;

    const currentTime = this.player.currentTime();
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
        return (buffered.end(i) - currentTime) * 1000; // Convert to ms
      }
    }

    return undefined;
  }
}
