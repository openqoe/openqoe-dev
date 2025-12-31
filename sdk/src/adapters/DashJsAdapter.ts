/**
 * dash.js Player Adapter
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

export class DashJsAdapter implements PlayerAdapter {
  private player: any = null;
  private video: HTMLVideoElement | null = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private metadata: VideoMetadata = {};
  private eventListeners: Map<string, EventListenerOrEventListenerObject> =
    new Map();
  private dashEventHandlers: Map<string, Function> = new Map();

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
  private currentQuality: number = -1;

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
   * Attach to dash.js player
   */
  attach(player: any, metadata: VideoMetadata): void {
    if (!player || typeof player.on !== "function") {
      throw new Error(
        "DashJsAdapter: player must be a dash.js MediaPlayer instance",
      );
    }

    this.player = player;
    this.metadata = metadata;

    // Get video element
    this.video = this.player.getVideoElement();
    if (!this.video) {
      throw new Error(
        "DashJsAdapter: dash.js player must be attached to a video element",
      );
    }

    // Set player info
    const version = this.player.getVersion
      ? this.player.getVersion()
      : undefined;
    this.eventCollector.setPlayerInfo({
      name: "dashjs",
      version: version,
      autoplay: this.video.autoplay,
      preload: (this.video.preload as any) || "auto",
    });

    // Attach event listeners
    this.attachEventListeners();

    this.logger.info("DashJsAdapter attached");
  }

  /**
   * Detach from player
   */
  detach(): void {
    if (!this.player) return;

    this.stopHeartbeat();

    // Remove dash.js event listeners
    this.dashEventHandlers.forEach((handler, event) => {
      this.player?.off(event, handler);
    });
    this.dashEventHandlers.clear();

    // Remove video event listeners
    this.eventListeners.forEach((listener, event) => {
      this.video?.removeEventListener(event, listener);
    });
    this.eventListeners.clear();

    this.video = null;
    this.player = null;
    this.logger.info("DashJsAdapter detached");
  }

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    if (!this.player || !this.video) return;

    // Get MediaPlayer events enum
    const events = this.player.constructor.events || {};

    // dash.js specific events
    this.onDash(events.MANIFEST_LOADED, () => this.onManifestLoaded());
    this.onDash(events.QUALITY_CHANGE_RENDERED, (e: any) =>
      this.onQualityChangeRendered(e),
    );
    this.onDash(events.PLAYBACK_ERROR, (e: any) => this.onPlaybackError(e));
    this.onDash(events.FRAGMENT_LOADING_COMPLETED, (e: any) =>
      this.onFragmentLoaded(e),
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
   * Helper to add dash.js event listener
   */
  private onDash(event: string, handler: Function): void {
    if (!this.player || !event) return;

    this.player.on(event, handler);
    this.dashEventHandlers.set(event, handler);
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
        player_startup_time: startupTime,
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
   * Quality Change Rendered event
   */
  async onQualityChangeRendered(data: any): Promise<void> {
    if (!this.video || !data) return;

    this.currentQuality = data.newQuality;

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
  async onFragmentLoaded(data: any): Promise<void> {
    // This can be used for throughput calculation
    this.logger.debug("Fragment loaded", {
      duration: data.request?.duration,
      type: data.request?.type,
    });
  }

  /**
   * Playback Error event
   */
  async onPlaybackError(data: any): Promise<void> {
    if (!this.player) return;

    const { error } = data;

    let errorFamily: string = "source";
    let errorMessage: string = "Playback error";

    if (error) {
      errorMessage = error.message || error.toString();

      // Categorize error
      if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        errorFamily = "network";
      } else if (
        errorMessage.includes("decode") ||
        errorMessage.includes("codec")
      ) {
        errorFamily = "decoder";
      } else if (
        errorMessage.includes("manifest") ||
        errorMessage.includes("media")
      ) {
        errorFamily = "source";
      }
    }

    this.onError({
      code: error?.code || -1,
      message: errorMessage,
      fatal: true,
      context: {
        error_family: errorFamily,
        error_data: data,
      },
    });
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
      const bitrateList = this.player.getBitrateInfoListFor("video");
      if (
        bitrateList &&
        this.currentQuality >= 0 &&
        this.currentQuality < bitrateList.length
      ) {
        return bitrateList[this.currentQuality].bitrate || null;
      }

      // Fallback to current quality
      const currentQuality = this.player.getQualityFor("video");
      if (
        currentQuality >= 0 &&
        bitrateList &&
        currentQuality < bitrateList.length
      ) {
        this.currentQuality = currentQuality;
        return bitrateList[currentQuality].bitrate || null;
      }
    } catch (e) {
      this.logger.debug("Error getting bitrate:", e);
    }

    return null;
  }

  /**
   * Get video resolution
   */
  getVideoResolution(): Resolution | null {
    if (!this.player) return null;

    try {
      const bitrateList = this.player.getBitrateInfoListFor("video");
      if (
        bitrateList &&
        this.currentQuality >= 0 &&
        this.currentQuality < bitrateList.length
      ) {
        const quality = bitrateList[this.currentQuality];
        return {
          width: quality.width,
          height: quality.height,
        };
      }
    } catch (e) {
      this.logger.debug("Error getting resolution:", e);
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
    // dash.js doesn't directly expose framerate in bitrateList
    // Would need to parse from manifest
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
    if (!this.player) return null;

    // dash.js can support CMCD via configuration
    // Return basic CMCD data
    return {
      br: this.getBitrate() || undefined,
      bl: this.getBufferLength() || undefined,
      cid: this.metadata.videoId,
      // Add more fields as needed
    };
  }

  /**
   * Get buffer length in ms
   */
  private getBufferLength(): number | undefined {
    if (!this.player || !this.video) return undefined;

    try {
      // dash.js provides getDashMetrics
      const dashMetrics = this.player.getDashMetrics();
      if (dashMetrics) {
        const bufferLevel = dashMetrics.getCurrentBufferLevel("video");
        if (bufferLevel !== undefined && bufferLevel !== null) {
          return bufferLevel * 1000; // Convert to ms
        }
      }
    } catch (e) {
      this.logger.debug("Error getting buffer length from metrics:", e);
    }

    // Fallback to video element buffered
    const buffered = this.video.buffered;
    if (!buffered || buffered.length === 0) return undefined;

    const currentTime = this.video.currentTime;
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
        return (buffered.end(i) - currentTime) * 1000; // Convert to ms
      }
    }

    return undefined;
  }
}
