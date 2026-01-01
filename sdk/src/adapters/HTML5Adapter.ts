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
   * === Helpers to get video info ===
   */

  getCurrentTime(): number {
    return performance.now();
  }

  /**
   * Get video playback position in milliseconds
   */
  getVideoPlaybackPosition(): number {
    return (this.video?.currentTime || 0) * 1000;
  }

  /**
   * Get duration in milliseconds
   */
  getDuration(): number {
    return (this.video?.duration || 0) * 1000;
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

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    if (!this.video) return;

    // --- 1. INITIALIZATION & FETCH ---
    this.addEventListener("DOMContentLoaded", () => this.onPageLoad());
    this.addEventListener("loadstart", () => this.onViewStart());
    this.addEventListener("progress", () => this.onProgress());
    this.addEventListener("suspend", () => this.onSuspend());
    this.addEventListener("abort", () => this.onAbort());
    this.addEventListener("emptied", () => this.onEmptied());
    this.addEventListener("error", () => this.onErrorEvent());

    // --- 2. METADATA & DATA READINESS ---
    this.addEventListener("loadedmetadata", () => this.onPlayerReady());
    this.addEventListener("encrypted", () => this.onEncrypted());
    this.addEventListener("waitingforkey", () => this.onWaitingForKey());
    this.addEventListener("loadeddata", () => this.onLoadedData());
    this.addEventListener("canplay", () => this.onCanPlay());
    this.addEventListener("canplaythrough", () => this.onCanPlayThrough());

    // --- 3. PLAYBACK STATE ---
    this.addEventListener("play", () => this.onPlaying());
    this.addEventListener("waiting", () => this.onStallStart()); // Buffering
    this.addEventListener("playing", () => this.onPlayingAfterWait());
    this.addEventListener("timeupdate", () => this.onTimeUpdate());
    this.addEventListener("ratechange", () => this.onRateChange());
    this.addEventListener("volumechange", () => this.onVolumeChange());

    // --- 4. SEEKING & PAUSE ---
    this.addEventListener("seeking", () => this.onSeeking());
    this.addEventListener("seeked", () => this.onSeeked());
    this.addEventListener("pause", () => this.onPause());

    // --- 5. CONCLUSION ---
    this.addEventListener("ended", () => this.onEnded());
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
   * Page Load event
   */
  async onPageLoad(): Promise<void> {
    const currentTime = this.getCurrentTime();
    const event = await this.eventCollector.createEvent("pageload", {
      event_ts: currentTime,
      page_load_ts: currentTime,
    });
    this.batchManager.addEvent(event);
    this.logger.debug("pageload event fired");
  }

  /**
   * View Start event
   */
  async onViewStart(): Promise<void> {
    const currentTime = this.getCurrentTime();
    const event = await this.eventCollector.createEvent("viewstart", {
      event_ts: currentTime,
      // is advertisement fetched before content playback
      preroll_requested: false,
      video_start_ts: currentTime,
    });

    this.batchManager.addEvent(event);
    this.logger.debug("viewstart event fired");
  }

  /**
   * Progress event
   */
  async onProgress(): Promise<void> {
    const currentTime = this.getCurrentTime();
    const playingTime = this.getVideoPlaybackPosition();
    const event = await this.eventCollector.createEvent("playbackprogress", {
      event_ts: currentTime,
      buffer_length: this.getBufferLength(),
      current_playing_time: playingTime,
    });
    this.batchManager.addEvent(event);
    this.logger.debug("progress event fired");
  }

  /**
   * Suspend event
   */
  async onSuspend(): Promise<void> {
    const event = await this.eventCollector.createEvent("suspend", {
      event_ts: this.getCurrentTime(),
      buffer_length: this.getBufferLength(),
      current_playing_time: this.getVideoPlaybackPosition(),
      video_duration: this.getDuration(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("suspend event fired");
  }

  /**
   * Abort event
   */
  async onAbort(): Promise<void> {
    const event = await this.eventCollector.createEvent("abort", {
      event_ts: this.getCurrentTime(),
      buffer_length: this.getBufferLength(),
      current_playing_time: this.getVideoPlaybackPosition(),
      video_duration: this.getDuration(),
      player_state: this.getPlayerState(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("abort event fired");
  }

  /**
   * Emptied event
   */
  async onEmptied(): Promise<void> {
    const event = await this.eventCollector.createEvent("emptied", {
      event_ts: this.getCurrentTime(),
      player_state: this.getPlayerState(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("emptied event fired");
  }

  /**
   * Error event
   */
  async onErrorEvent(): Promise<void> {
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
   * Player Ready event
   */
  async onPlayerReady(): Promise<void> {
    if (!this.video) return;
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
   * Encrypted stream
   */
  async onEncrypted(): Promise<void> {
    const event = await this.eventCollector.createEvent("encrypted", {
      event_ts: this.getCurrentTime(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("encrypted event fired");
  }

  /**
   * Waiting for encryption key to decrypt the stream
   */
  async onWaitingForKey(): Promise<void> {
    const event = await this.eventCollector.createEvent("waitingforkey", {
      event_ts: this.getCurrentTime(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("waitingforkey event fired");
  }

  /**
   * Loaded Data event
   */
  async onLoadedData(): Promise<void> {
    const event = await this.eventCollector.createEvent("loadeddata", {
      event_ts: this.getCurrentTime(),
      video_duration: this.getDuration(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("loadeddata event fired");
  }

  /**
   * Can Play event
   */
  async onCanPlay(): Promise<void> {
    const event = await this.eventCollector.createEvent("canplay", {
      event_ts: this.getCurrentTime(),
      buffer_length: this.getBufferLength(),
      current_playing_time: this.getVideoPlaybackPosition(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("canplay event fired");
  }

  /**
   * Can Play Through event
   */
  async onCanPlayThrough(): Promise<void> {
    const event = await this.eventCollector.createEvent("canplaythrough", {
      event_ts: this.getCurrentTime(),
      buffer_length: this.getBufferLength(),
      current_playing_time: this.getVideoPlaybackPosition(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("canplaythrough event fired");
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
        framerate: undefined, // HTML5 doesn't expose framerate directly
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);

    // Start heartbeat
    this.startHeartbeat();

    this.logger.debug("playing event fired");
  }

  private seekStartTime: number = 0;

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
   * Rate Change
   */
  async onRateChange(): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent("ratechange", {
      event_ts: this.getCurrentTime(),
      playback_rate: this.video.playbackRate,
      current_time: this.getVideoPlaybackPosition(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("ratechange event fired");
  }

  async onVolumeChange(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent("volumechange", {
      event_ts: this.getCurrentTime(),
      volume: this.video.volume,
      muted: this.video.muted,
      current_time: this.getVideoPlaybackPosition(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("volumechange event fired");
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
  private seekFrom: number = 0;

  onSeeking(): void {
    if (!this.video) return;
    this.seekFrom = this.video.currentTime * 1000;
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
}
