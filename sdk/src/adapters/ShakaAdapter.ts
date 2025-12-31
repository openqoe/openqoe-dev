/**
 * Shaka Player Adapter
 */

import { PlayerAdapter, VideoMetadata, PlayerState, Resolution, CMCDData, PlayerError } from '../types';
import { EventCollector } from '../core/EventCollector';
import { BatchManager } from '../core/BatchManager';
import { Logger } from '../utils/logger';

export class ShakaAdapter implements PlayerAdapter {
  private player: any = null;
  private video: HTMLVideoElement | null = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private metadata: VideoMetadata = {};
  private eventListeners: Map<string, EventListenerOrEventListenerObject> = new Map();
  private shakaEventHandlers: Map<string, Function> = new Map();

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
   * Attach to Shaka Player
   */
  attach(player: any, metadata: VideoMetadata): void {
    if (!player || typeof player.addEventListener !== 'function') {
      throw new Error('ShakaAdapter: player must be a Shaka Player instance');
    }

    this.player = player;
    this.metadata = metadata;

    // Get video element (Shaka attaches to a video element)
    this.video = this.player.getMediaElement();
    if (!this.video) {
      throw new Error('ShakaAdapter: Shaka Player must be attached to a video element');
    }

    // Set player info
    const version = this.player.constructor?.version || undefined;
    this.eventCollector.setPlayerInfo({
      name: 'shaka',
      version: version,
      autoplay: this.video.autoplay,
      preload: (this.video.preload as any) || 'auto'
    });

    // Attach event listeners
    this.attachEventListeners();

    this.logger.info('ShakaAdapter attached');
  }

  /**
   * Detach from player
   */
  detach(): void {
    if (!this.player) return;

    this.stopHeartbeat();

    // Remove Shaka event listeners
    this.shakaEventHandlers.forEach((handler, event) => {
      this.player?.removeEventListener(event, handler);
    });
    this.shakaEventHandlers.clear();

    // Remove video event listeners
    this.eventListeners.forEach((listener, event) => {
      this.video?.removeEventListener(event, listener);
    });
    this.eventListeners.clear();

    this.video = null;
    this.player = null;
    this.logger.info('ShakaAdapter detached');
  }

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    if (!this.player || !this.video) return;

    // Shaka Player events
    // Access event types from the player's constructor
    const EventType = this.player.constructor.EventType || {};

    this.onShaka('loaded', () => this.onManifestLoaded());
    this.onShaka('adaptation', () => this.onAdaptation());
    this.onShaka('error', (event: any) => this.onShakaError(event));
    this.onShaka('buffering', (event: any) => this.onBuffering(event));

    // Standard video element events
    this.addEventListener('loadstart', () => this.onViewStart());
    this.addEventListener('play', () => this.onPlaying());
    this.addEventListener('pause', () => this.onPause());
    this.addEventListener('seeking', () => this.onSeeking());
    this.addEventListener('seeked', () => this.onSeeked());
    this.addEventListener('ended', () => this.onEnded());
    this.addEventListener('timeupdate', () => this.onTimeUpdate());
  }

  /**
   * Helper to add Shaka event listener
   */
  private onShaka(event: string, handler: Function): void {
    if (!this.player) return;

    this.player.addEventListener(event, handler);
    this.shakaEventHandlers.set(event, handler);
  }

  /**
   * Helper to add video event listener
   */
  private addEventListener(event: string, handler: EventListener): void {
    if (!this.video) return;

    this.video.addEventListener(event, handler);
    this.eventListeners.set(event, handler);
  }

  /**
   * Manifest Loaded event (Player Ready)
   */
  async onManifestLoaded(): Promise<void> {
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
    if (!this.video) return;

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
      this.video.currentTime * 1000
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
    if (!this.video) return;

    // Stop heartbeat
    this.stopHeartbeat();

    const event = await this.eventCollector.createEvent(
      'pause',
      {
        playing_time: this.playingTime
      },
      this.video.currentTime * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('pause event fired');
  }

  /**
   * Seeking event
   */
  onSeeking(): void {
    if (!this.video) return;
    this.seekFrom = this.video.currentTime * 1000;
    this.seekStartTime = performance.now();
  }

  /**
   * Seeked event
   */
  async onSeeked(): Promise<void> {
    if (!this.video) return;

    const seekTo = this.video.currentTime * 1000;
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
   * Buffering event - Handles stalls
   */
  async onBuffering(event: any): Promise<void> {
    if (!this.video) return;

    const buffering = event.buffering;

    if (buffering && this.stallStartTime === null) {
      // Stall started
      this.stallStartTime = performance.now();

      const stallEvent = await this.eventCollector.createEvent(
        'stall_start',
        {
          buffer_length: this.getBufferLength(),
          bitrate: this.getBitrate()
        },
        this.video.currentTime * 1000
      );

      this.batchManager.addEvent(stallEvent);
      this.logger.debug('stall_start event fired');

    } else if (!buffering && this.stallStartTime !== null) {
      // Stall ended
      const stallDuration = performance.now() - this.stallStartTime;
      this.rebufferDuration += stallDuration;
      this.rebufferCount++;

      const stallEvent = await this.eventCollector.createEvent(
        'stall_end',
        {
          stall_duration: stallDuration,
          buffer_length: this.getBufferLength()
        },
        this.video.currentTime * 1000
      );

      this.batchManager.addEvent(stallEvent);
      this.stallStartTime = null;
      this.logger.debug('stall_end event fired');
    }
  }

  /**
   * Ended event
   */
  async onEnded(): Promise<void> {
    if (!this.video) return;

    this.stopHeartbeat();

    const totalWatchTime = this.viewStartTime ? performance.now() - this.viewStartTime : 0;
    const completionRate = this.video.duration > 0 ? this.video.currentTime / this.video.duration : 1;

    const event = await this.eventCollector.createEvent(
      'ended',
      {
        playing_time: this.playingTime,
        total_watch_time: totalWatchTime,
        completion_rate: completionRate,
        rebuffer_count: this.rebufferCount,
        rebuffer_duration: this.rebufferDuration
      },
      this.video.currentTime * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('ended event fired');
  }

  /**
   * Adaptation event (Quality Change)
   */
  async onAdaptation(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      'qualitychange',
      {
        bitrate: this.getBitrate(),
        resolution: this.getVideoResolution(),
        framerate: this.getFramerate()
      },
      this.video.currentTime * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('qualitychange event fired');
  }

  /**
   * Shaka Error event
   */
  async onShakaError(event: any): Promise<void> {
    if (!this.player) return;

    const detail = event.detail;
    if (!detail) return;

    const { severity, category, code, data } = detail;

    let errorFamily: string;
    let errorMessage: string;

    // Categorize based on Shaka error category
    switch (category) {
      case 1: // NETWORK
        errorFamily = 'network';
        errorMessage = `Network error (${code})`;
        break;
      case 2: // TEXT
        errorFamily = 'source';
        errorMessage = `Text track error (${code})`;
        break;
      case 3: // MEDIA
        errorFamily = 'decoder';
        errorMessage = `Media error (${code})`;
        break;
      case 4: // MANIFEST
        errorFamily = 'source';
        errorMessage = `Manifest error (${code})`;
        break;
      case 5: // STREAMING
        errorFamily = 'source';
        errorMessage = `Streaming error (${code})`;
        break;
      case 6: // DRM
        errorFamily = 'source';
        errorMessage = `DRM error (${code})`;
        break;
      case 7: // PLAYER
        errorFamily = 'source';
        errorMessage = `Player error (${code})`;
        break;
      default:
        errorFamily = 'source';
        errorMessage = `Error (${code})`;
    }

    // Check severity (1 = RECOVERABLE, 2 = CRITICAL)
    const isFatal = severity === 2;

    this.onError({
      code: code,
      message: errorMessage,
      fatal: isFatal,
      context: {
        error_family: errorFamily,
        severity,
        category,
        data
      }
    });
  }

  /**
   * Error handler
   */
  async onError(error: PlayerError): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      'error',
      {
        error_family: error.context?.error_family || 'source',
        error_code: String(error.code),
        error_message: error.message,
        error_context: error.context
      },
      this.video.currentTime * 1000
    );

    this.batchManager.addEvent(event);
    this.logger.debug('error event fired', error);
  }

  /**
   * Time Update - Track quartiles
   */
  async onTimeUpdate(): Promise<void> {
    if (!this.video) return;

    const progress = this.video.currentTime / this.video.duration;

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
          this.video.currentTime * 1000
        );

        this.batchManager.addEvent(event);
        this.logger.debug(`quartile ${q * 100}% fired`);
      }
    }

    // Update playing time
    if (!this.video.paused) {
      const timeDelta = this.video.currentTime - this.lastPlaybackTime;
      if (timeDelta > 0 && timeDelta < 1) { // Sanity check
        this.playingTime += timeDelta * 1000; // Convert to ms
      }
    }

    this.lastPlaybackTime = this.video.currentTime;
    this.watchTime = this.viewStartTime ? Date.now() - this.viewStartTime : 0;
  }

  /**
   * Heartbeat - Send periodic updates
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(async () => {
      if (!this.video) return;

      const event = await this.eventCollector.createEvent(
        'heartbeat',
        {
          playing_time: this.playingTime,
          bitrate: this.getBitrate(),
          buffer_length: this.getBufferLength(),
          dropped_frames: this.getDroppedFrames()
        },
        this.video.currentTime * 1000
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
    return this.video?.currentTime || 0;
  }

  /**
   * Get duration in seconds
   */
  getDuration(): number {
    return this.video?.duration || 0;
  }

  /**
   * Get bitrate
   */
  getBitrate(): number | null {
    if (!this.player) return null;

    try {
      const stats = this.player.getStats();
      if (stats && stats.estimatedBandwidth) {
        return stats.estimatedBandwidth;
      }

      // Alternative: get from variant tracks
      const tracks = this.player.getVariantTracks();
      if (tracks && tracks.length > 0) {
        // Find active track
        const activeTrack = tracks.find((t: any) => t.active);
        if (activeTrack && activeTrack.bandwidth) {
          return activeTrack.bandwidth;
        }
      }
    } catch (e) {
      this.logger.debug('Error getting bitrate:', e);
    }

    return null;
  }

  /**
   * Get video resolution
   */
  getVideoResolution(): Resolution | null {
    if (!this.player) return null;

    try {
      const tracks = this.player.getVariantTracks();
      if (tracks && tracks.length > 0) {
        // Find active track
        const activeTrack = tracks.find((t: any) => t.active);
        if (activeTrack) {
          return {
            width: activeTrack.width || this.video?.videoWidth || 0,
            height: activeTrack.height || this.video?.videoHeight || 0
          };
        }
      }
    } catch (e) {
      this.logger.debug('Error getting resolution:', e);
    }

    // Fallback to video element
    if (this.video) {
      return {
        width: this.video.videoWidth,
        height: this.video.videoHeight
      };
    }

    return null;
  }

  /**
   * Get framerate
   */
  getFramerate(): number | null {
    if (!this.player) return null;

    try {
      const tracks = this.player.getVariantTracks();
      if (tracks && tracks.length > 0) {
        // Find active track
        const activeTrack = tracks.find((t: any) => t.active);
        if (activeTrack && activeTrack.frameRate) {
          return activeTrack.frameRate;
        }
      }
    } catch (e) {
      this.logger.debug('Error getting framerate:', e);
    }

    return null;
  }

  /**
   * Get dropped frames
   */
  getDroppedFrames(): number | undefined {
    if (!this.player) return undefined;

    try {
      const stats = this.player.getStats();
      if (stats && stats.droppedFrames !== undefined) {
        return stats.droppedFrames;
      }
    } catch (e) {
      this.logger.debug('Error getting dropped frames:', e);
    }

    // Fallback to video element
    if (this.video && (this.video as any).getVideoPlaybackQuality) {
      const quality = (this.video as any).getVideoPlaybackQuality();
      return quality.droppedVideoFrames;
    }

    return undefined;
  }

  /**
   * Get player state
   */
  getPlayerState(): PlayerState {
    if (!this.video) {
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
      currentTime: this.video.currentTime,
      duration: this.video.duration,
      paused: this.video.paused,
      ended: this.video.ended,
      buffered: this.video.buffered,
      readyState: this.video.readyState
    };
  }

  /**
   * Get CMCD data
   */
  getCMCDData(): CMCDData | null {
    if (!this.player) return null;

    try {
      const stats = this.player.getStats();
      if (stats) {
        return {
          br: this.getBitrate() || undefined,
          bl: this.getBufferLength() || undefined,
          cid: this.metadata.videoId,
          tb: stats.estimatedBandwidth || undefined,
          // Add more CMCD fields as needed
        };
      }
    } catch (e) {
      this.logger.debug('Error getting CMCD data:', e);
    }

    return null;
  }

  /**
   * Get buffer length in ms
   */
  private getBufferLength(): number | undefined {
    if (!this.player || !this.video) return undefined;

    try {
      const stats = this.player.getStats();
      if (stats && stats.bufferingTime !== undefined) {
        // Shaka provides buffer info in stats
        const buffered = this.video.buffered;
        if (buffered && buffered.length > 0) {
          const currentTime = this.video.currentTime;
          for (let i = 0; i < buffered.length; i++) {
            if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
              return (buffered.end(i) - currentTime) * 1000; // Convert to ms
            }
          }
        }
      }
    } catch (e) {
      this.logger.debug('Error getting buffer length:', e);
    }

    return undefined;
  }
}
