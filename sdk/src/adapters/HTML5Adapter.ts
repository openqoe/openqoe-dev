/**
 * HTML5 Video Player Adapter
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

export class HTML5Adapter implements PlayerAdapter {
  private video: HTMLVideoElement | null = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private metadata: VideoMetadata = {};
  private eventListeners: Map<string, EventListenerOrEventListenerObject> =
    new Map();

  // State tracking
  private lastPlaybackTime: number = 0;
  private playingTime: number = 0;
  private watchTime: number = 0;
  private stallStartTime: number | null = null;
  private viewStartTime: number | null = null;
  private rebufferCount: number = 0;
  private rebufferDuration: number = 0;
  private quartileFired: Set<number> = new Set();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

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
   * Attach to HTML5 video element
   */
  attach(player: HTMLVideoElement, metadata: VideoMetadata): void {
    if (!(player instanceof HTMLVideoElement)) {
      throw new Error("HTML5Adapter: player must be an HTMLVideoElement");
    }

    this.video = player;
    this.metadata = metadata;

    // Set player info
    this.eventCollector.setPlayerInfo({
      name: "html5",
      version: undefined,
      autoplay: this.video.autoplay,
      preload: (this.video.preload as any) || "auto",
    });

    // Attach event listeners
    this.attachEventListeners();

    this.logger.info("HTML5Adapter attached");
  }

  /**
   * Detach from video element
   */
  detach(): void {
    if (!this.video) return;

    this.stopHeartbeat();

    // Remove all event listeners
    this.eventListeners.forEach((listener, event) => {
      this.video?.removeEventListener(event, listener);
    });
    this.eventListeners.clear();

    this.video = null;
    this.logger.info("HTML5Adapter detached");
  }

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    if (!this.video) return;
    this.addEventListener("loadstart", () => this.onLoadStart());
    this.addEventListener("loadedmetadata", () => this.onLoadedMetaData());
    this.addEventListener("loadeddata", () => this.onPlayerReady());
    this.addEventListener("canplay", () => this.onCanPlay());
    this.addEventListener("canplaythrough", () => this.onCanPlayThrough());
    this.addEventListener("play", () => this.onPlaying());
    this.addEventListener("pause", () => this.onPause());
    this.addEventListener("seeking", () => this.onSeeking());
    this.addEventListener("seeked", () => this.onSeeked());
    this.addEventListener("waiting", () => this.onWaiting());
    this.addEventListener("stalled", () => this.onStallStart());
    this.addEventListener("playing", () => this.onPlayingAfterWait());
    this.addEventListener("ratechange", () => this.onRateChange());
    this.addEventListener("volumechange", () => this.onVolumeChange());
    this.addEventListener("ended", () => this.onEnded());
    this.addEventListener("error", () => this.onErrorEvent());
    this.addEventListener("timeupdate", () => this.onTimeUpdate());
  }

  /**
   * Helper to add event listener and track it
   */
  private addEventListener(event: string, handler: EventListener): void {
    if (!this.video) return;

    this.video.addEventListener(event, handler);
    this.eventListeners.set(event, handler);
  }

  /**
   * Data Load Start event
   */
  private async onLoadStart(): Promise<void> {
    this.viewStartTime = performance.now();
    // Get page load time using Navigation Timing Level 2
    let pageLoadTime: number | undefined;
    const navigationTiming = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      pageLoadTime =
        navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
    }
    const event = await this.eventCollector.createEvent(
      "manifestsloadingstart",
      {
        page_load_time: pageLoadTime,
      },
    );

    this.batchManager.addEvent(event);
    this.logger.debug("viewstart event fired");
  }

  /**
   * Metadata Load complete event
   */
  private async onLoadedMetaData(): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent("viewstart", {
      preroll_requested: false,
      buf_len: this.getBufferLength(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("loadeddata event fired");
  }

  /**
   * Player Ready event
   */
  private async onPlayerReady(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent("playerready", {
      player_startup_time: performance.now(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("playerready event fired");
  }

  private async onCanPlay(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent("canplay", {
      buf_len: this.getBufferLength(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("canplay event fired");
  }

  private async onCanPlayThrough(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent("canplaythrough", {
      buf_len: this.getBufferLength(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("canplaythrough event fired");
  }

  /**
   * Playing event
   */
  private async onPlaying(): Promise<void> {
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
        framerate: undefined, // HTML5 doesn't expose framerate directly
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
  private async onPause(): Promise<void> {
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
  private seekFrom: number = 0;

  private async onSeeking(): Promise<void> {
    if (!this.video) return;
    this.seekFrom = this.video.currentTime * 1000;
  }

  /**
   * Seeked event
   */
  private async onSeeked(): Promise<void> {
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

  private seekStartTime: number = 0;

  /**
   * Stall Start (waiting) event
   */
  private async onWaiting(): Promise<void> {
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
  private async onPlayingAfterWait(): Promise<void> {
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
  private async onEnded(): Promise<void> {
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
   * Error event
   */
  private async onErrorEvent(): Promise<void> {
    if (!this.video || !this.video.error) return;

    const errorCode = this.video.error.code;
    let errorFamily: string;
    let errorMessage: string;

    switch (errorCode) {
      case 1: // MEDIA_ERR_ABORTED
        errorFamily = "source";
        errorMessage = "Media loading aborted";
        break;
      case 2: // MEDIA_ERR_NETWORK
        errorFamily = "network";
        errorMessage = "Network error while loading media";
        break;
      case 3: // MEDIA_ERR_DECODE
        errorFamily = "decoder";
        errorMessage = "Media decoding error";
        break;
      case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
        errorFamily = "source";
        errorMessage = "Media format not supported";
        break;
      default:
        errorFamily = "source";
        errorMessage = "Unknown error";
    }

    this.onError({
      code: errorCode,
      message: errorMessage,
      fatal: true,
      context: {
        error_family: errorFamily,
      },
    });
  }

  /**
   * Error handler
   */
  private async onError(error: PlayerError): Promise<void> {
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
  private async onTimeUpdate(): Promise<void> {
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
          dropped_frames: undefined, // HTML5 doesn't expose this
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
   * Get bitrate (HTML5 doesn't expose this directly)
   */
  getBitrate(): number | null {
    // HTML5 video element doesn't expose bitrate directly
    // This would need to be extracted from network requests or manifest
    return null;
  }

  /**
   * Get video resolution
   */
  getVideoResolution(): Resolution | null {
    if (!this.video) return null;

    return {
      width: this.video.videoWidth,
      height: this.video.videoHeight,
    };
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
   * Get CMCD data (not available for plain HTML5)
   */
  getCMCDData(): CMCDData | null {
    return null;
  }

  /**
   * Get buffer length in ms
   */
  private getBufferLength(): number | undefined {
    if (
      !this.video ||
      !this.video.buffered ||
      this.video.buffered.length === 0
    ) {
      return undefined;
    }

    const currentTime = this.video.currentTime;
    for (let i = 0; i < this.video.buffered.length; i++) {
      if (
        currentTime >= this.video.buffered.start(i) &&
        currentTime <= this.video.buffered.end(i)
      ) {
        return (this.video.buffered.end(i) - currentTime) * 1000; // Convert to ms
      }
    }

    return undefined;
  }
}
