/**
 * HLS.js Player Adapter
 */

import {
  PlayerAdapter,
  VideoMetadata,
  PlayerState,
  Resolution,
  CMCDData,
  PlayerError,
} from "../types";
import { EventCollector } from "../core/EventCollector";
import { BatchManager } from "../core/BatchManager";
import { Logger } from "../utils/logger";

export class HlsJsAdapter implements PlayerAdapter {
  private hls: any = null;
  private video: HTMLVideoElement | null = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private metadata: VideoMetadata = {};
  private eventListeners: Map<string, EventListenerOrEventListenerObject> =
    new Map();
  private hlsEventHandlers: Map<string, Function> = new Map();

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
  private currentLevel: number = -1;

  constructor(
    eventCollector: EventCollector,
    batchManager: BatchManager,
    logger: Logger,
  ) {
    this.eventCollector = eventCollector;
    this.batchManager = batchManager;
    this.logger = logger;
  }

  /**
   * Attach to HLS.js instance
   */
  attach(player: any, metadata: VideoMetadata): void {
    if (!player || typeof player.on !== "function") {
      throw new Error("HlsJsAdapter: player must be an HLS.js instance");
    }

    this.hls = player;
    this.metadata = metadata;

    // Get video element
    this.video = this.hls.media;
    if (!this.video) {
      throw new Error(
        "HlsJsAdapter: HLS instance must be attached to a video element",
      );
    }

    // Set player info
    const version = (player.constructor as any)?.version || undefined;
    this.eventCollector.setPlayerInfo({
      name: "hlsjs",
      version: version,
      autoplay: this.video.autoplay,
      preload: (this.video.preload as any) || "auto",
    });

    // Attach event listeners
    this.attachEventListeners();

    this.logger.info("HlsJsAdapter attached");
  }

  /**
   * Detach from HLS instance
   */
  detach(): void {
    if (!this.hls) return;

    this.stopHeartbeat();

    // Remove HLS event listeners
    this.hlsEventHandlers.forEach((handler, event) => {
      this.hls?.off(event, handler);
    });
    this.hlsEventHandlers.clear();

    // Remove video event listeners
    this.eventListeners.forEach((listener, event) => {
      this.video?.removeEventListener(event, listener);
    });
    this.eventListeners.clear();

    this.video = null;
    this.hls = null;
    this.logger.info("HlsJsAdapter detached");
  }

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    if (!this.hls || !this.video) return;

    // HLS-specific events
    const Hls = this.hls.constructor;
    this.onHls(Hls.Events.MANIFEST_PARSED, () => this.onManifestParsed());
    this.onHls(Hls.Events.LEVEL_SWITCHED, (_event: any, data: any) =>
      this.onLevelSwitched(data),
    );
    this.onHls(Hls.Events.FRAG_LOADED, (_event: any, data: any) =>
      this.onFragLoaded(data),
    );
    this.onHls(Hls.Events.ERROR, (_event: any, data: any) =>
      this.onHlsError(data),
    );

    // Standard video element events
    this.addEventListener("loadstart", () => this.onViewStart());
    this.addEventListener("play", () => this.onPlaying());
    this.addEventListener("pause", () => this.onPause());
    this.addEventListener("seeking", () => this.onSeeking());
    this.addEventListener("seeked", () => this.onSeeked());
    this.addEventListener("waiting", () => this.onStallStart());
    this.addEventListener("playing", () => this.onPlayingAfterWait());
    this.addEventListener("ended", () => this.onEnded());
    this.addEventListener("timeupdate", () => this.onTimeUpdate());
  }

  /**
   * Helper to add HLS event listener
   */
  private onHls(event: string, handler: Function): void {
    if (!this.hls) return;

    this.hls.on(event, handler);
    this.hlsEventHandlers.set(event, handler);
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
   * Manifest Parsed event (Player Ready)
   */
  async onManifestParsed(): Promise<void> {
    // Get page load time using Navigation Timing Level 2
    let pageLoadTime: number | undefined;
    const navigationTiming = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      pageLoadTime =
        navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
    }
    const event = await this.eventCollector.createEvent("playerready", {
      page_load_time: pageLoadTime,
    });

    this.batchManager.addEvent(event);
    this.logger.debug("playerready event fired");
  }

  /**
   * View Start event
   */
  async onViewStart(): Promise<void> {
    this.viewStartTime = performance.now();

    const event = await this.eventCollector.createEvent("viewstart", {
      preroll_requested: false,
    });

    this.batchManager.addEvent(event);
    this.logger.debug("viewstart event fired");
  }

  /**
   * Playing event
   */
  async onPlaying(): Promise<void> {
    if (!this.video) return;

    // Calculate video startup time if this is first play
    const startupTime = this.viewStartTime
      ? performance.now() - this.viewStartTime
      : undefined;

    const event = await this.eventCollector.createEvent(
      "playing",
      {
        video_startup_time: startupTime,
        bitrate: this.getBitrate(),
        resolution: this.getVideoResolution(),
        framerate: this.getFramerate(),
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);

    // Start heartbeat
    this.startHeartbeat();

    this.logger.debug("playing event fired");
  }

  /**
   * Pause event
   */
  async onPause(): Promise<void> {
    if (!this.video) return;

    // Stop heartbeat
    this.stopHeartbeat();

    const event = await this.eventCollector.createEvent(
      "pause",
      {
        playing_time: this.playingTime,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("pause event fired");
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
      "seek",
      {
        from: this.seekFrom,
        to: seekTo,
        seek_latency: seekLatency,
      },
      seekTo,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("seek event fired");
  }

  /**
   * Stall Start (waiting) event
   */
  async onStallStart(): Promise<void> {
    if (!this.video || this.stallStartTime !== null) return;

    this.stallStartTime = performance.now();

    const event = await this.eventCollector.createEvent(
      "stall_start",
      {
        buffer_length: this.getBufferLength(),
        bitrate: this.getBitrate(),
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("stall_start event fired");
  }

  /**
   * Playing after waiting - Stall End
   */
  async onPlayingAfterWait(): Promise<void> {
    if (!this.video) return;

    // If we were stalled, fire stall_end
    if (this.stallStartTime !== null) {
      const stallDuration = performance.now() - this.stallStartTime;
      this.rebufferDuration += stallDuration;
      this.rebufferCount++;

      const event = await this.eventCollector.createEvent(
        "stall_end",
        {
          stall_duration: stallDuration,
          buffer_length: this.getBufferLength(),
        },
        this.video.currentTime * 1000,
      );

      this.batchManager.addEvent(event);
      this.stallStartTime = null;
      this.logger.debug("stall_end event fired");
    }
  }

  /**
   * Ended event
   */
  async onEnded(): Promise<void> {
    if (!this.video) return;

    this.stopHeartbeat();

    const totalWatchTime = this.viewStartTime
      ? performance.now() - this.viewStartTime
      : 0;
    const completionRate =
      this.video.duration > 0
        ? this.video.currentTime / this.video.duration
        : 1;

    const event = await this.eventCollector.createEvent(
      "ended",
      {
        playing_time: this.playingTime,
        total_watch_time: totalWatchTime,
        completion_rate: completionRate,
        rebuffer_count: this.rebufferCount,
        rebuffer_duration: this.rebufferDuration,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("ended event fired");
  }

  /**
   * Level Switched event (Quality Change)
   */
  async onLevelSwitched(data: any): Promise<void> {
    if (!this.video) return;

    this.currentLevel = data.level;

    const event = await this.eventCollector.createEvent(
      "qualitychange",
      {
        bitrate: this.getBitrate(),
        resolution: this.getVideoResolution(),
        framerate: this.getFramerate(),
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("qualitychange event fired");
  }

  /**
   * Fragment Loaded event
   */
  async onFragLoaded(data: any): Promise<void> {
    // This can be used for throughput calculation
    // For now, we just log it
    this.logger.debug("Fragment loaded", {
      duration: data.frag?.duration,
      level: data.frag?.level,
    });
  }

  /**
   * HLS Error event
   */
  async onHlsError(data: any): Promise<void> {
    if (!this.hls) return;

    const { type, details, fatal } = data;

    let errorFamily: string;
    let errorMessage: string;

    // Determine error family based on type
    if (type === this.hls.constructor.ErrorTypes.NETWORK_ERROR) {
      errorFamily = "network";
      errorMessage = `Network error: ${details}`;
    } else if (type === this.hls.constructor.ErrorTypes.MEDIA_ERROR) {
      errorFamily = "decoder";
      errorMessage = `Media error: ${details}`;
    } else if (type === this.hls.constructor.ErrorTypes.MUX_ERROR) {
      errorFamily = "source";
      errorMessage = `Remux/multiplexer error: ${details}`;
    } else {
      errorFamily = "source";
      errorMessage = `Error: ${details}`;
    }

    this.onError({
      code: -1,
      message: errorMessage,
      fatal: fatal,
      context: {
        error_family: errorFamily,
        error_type: type,
        error_details: details,
      },
    });

    // If fatal and network error, HLS.js will try to recover automatically
    if (fatal && type === this.hls.constructor.ErrorTypes.NETWORK_ERROR) {
      this.logger.warn("Fatal network error, HLS.js will attempt recovery");
    }
  }

  /**
   * Error handler
   */
  async onError(error: PlayerError): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      "error",
      {
        error_family: error.context?.error_family || "source",
        error_code: String(error.code),
        error_message: error.message,
        error_context: error.context,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("error event fired", error);
  }

  /**
   * Time Update - Track quartiles
   */
  async onTimeUpdate(): Promise<void> {
    if (!this.video) return;

    const progress = this.video.currentTime / this.video.duration;

    // Track quartiles
    const quartiles = [0.25, 0.5, 0.75, 1.0];
    for (const q of quartiles) {
      if (progress >= q && !this.quartileFired.has(q)) {
        this.quartileFired.add(q);

        const event = await this.eventCollector.createEvent(
          "quartile",
          {
            quartile: q * 100,
            playing_time: this.playingTime,
            watch_time: this.watchTime,
          },
          this.video.currentTime * 1000,
        );

        this.batchManager.addEvent(event);
        this.logger.debug(`quartile ${q * 100}% fired`);
      }
    }

    // Update playing time
    if (!this.video.paused) {
      const timeDelta = this.video.currentTime - this.lastPlaybackTime;
      if (timeDelta > 0 && timeDelta < 1) {
        // Sanity check
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
        "heartbeat",
        {
          playing_time: this.playingTime,
          bitrate: this.getBitrate(),
          buffer_length: this.getBufferLength(),
          dropped_frames: this.getDroppedFrames(),
        },
        this.video.currentTime * 1000,
      );

      this.batchManager.addEvent(event);
      this.logger.debug("heartbeat event fired");
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
  getVideoPlaybackPosition(): number {
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
    if (!this.hls) return null;

    const levels = this.hls.levels;
    if (levels && this.currentLevel >= 0 && this.currentLevel < levels.length) {
      return levels[this.currentLevel].bitrate || null;
    }

    return null;
  }

  /**
   * Get video resolution
   */
  getVideoResolution(): Resolution | null {
    if (!this.hls) return null;

    const levels = this.hls.levels;
    if (levels && this.currentLevel >= 0 && this.currentLevel < levels.length) {
      const level = levels[this.currentLevel];
      return {
        width: level.width,
        height: level.height,
      };
    }

    // Fallback to video element
    if (this.video) {
      return {
        width: this.video.videoWidth,
        height: this.video.videoHeight,
      };
    }

    return null;
  }

  /**
   * Get framerate
   */
  getFramerate(): number | null {
    if (!this.hls) return null;

    const levels = this.hls.levels;
    if (levels && this.currentLevel >= 0 && this.currentLevel < levels.length) {
      return levels[this.currentLevel].frameRate || null;
    }

    return null;
  }

  /**
   * Get dropped frames
   */
  getDroppedFrames(): number | undefined {
    if (!this.video) return undefined;

    if ((this.video as any).getVideoPlaybackQuality) {
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
        readyState: 0,
      };
    }

    return {
      currentTime: this.video.currentTime,
      duration: this.video.duration,
      paused: this.video.paused,
      ended: this.video.ended,
      buffered: this.video.buffered,
      readyState: this.video.readyState,
    };
  }

  /**
   * Get CMCD data
   */
  getCMCDData(): CMCDData | null {
    if (!this.hls) return null;

    // HLS.js can be configured with CMCD, check if available
    const config = this.hls.config;
    if (config && config.cmcd) {
      return {
        br: this.getBitrate() || undefined,
        bl: this.getBufferLength() || undefined,
        cid: this.metadata.videoId,
        // Add more CMCD fields as needed
      };
    }

    return null;
  }

  /**
   * Get buffer length in ms
   */
  private getBufferLength(): number | undefined {
    if (!this.hls || !this.video) return undefined;

    // HLS.js provides backBufferLength and maxBufferLength
    const bufferInfo = this.hls.media ? this.hls.buffered : null;
    if (!bufferInfo || bufferInfo.length === 0) return undefined;

    const currentTime = this.video.currentTime;
    for (let i = 0; i < bufferInfo.length; i++) {
      if (
        currentTime >= bufferInfo.start(i) &&
        currentTime <= bufferInfo.end(i)
      ) {
        return (bufferInfo.end(i) - currentTime) * 1000; // Convert to ms
      }
    }

    return undefined;
  }
}
