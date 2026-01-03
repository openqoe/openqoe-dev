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
  private dashMetrics: any = null;

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
  private currentBitrate: number | null = null;
  private currentResolution: Resolution | null = null;
  private currentFPS: number | null = null;

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
    this.dashMetrics = this.player.getDashMetrics();

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

  async resolveDashJS(): Promise<void> {
    // 1. Try global (browser UMD)
    if ((globalThis as any).dashjs) {
      return (globalThis as any).dashjs;
    }

    // 2. Try module (bundler / Node)
    try {
      const mod = await import("dashjs");
      return mod.default ?? mod;
    } catch {
      throw new Error(
        "dashjs not found. Either load dash.all.min.js globally or install dashjs as a dependency.",
      );
    }
  }

  /**
   * Attach all event listeners
   */
  private async attachEventListeners(): Promise<void> {
    if (!this.player || !this.video) return;
    let dashjs;
    try {
      dashjs = await this.resolveDashJS();
    } catch (e) {
      throw new Error(
        "dashjs library is not available. Please ensure dashjs is installed.",
      );
    }
    // Get MediaPlayer events enum
    const events = dashjs.MediaPlayer.events;

    // dash.js specific events
    this.onDash(events.MANIFEST_LOADING_STARTED, () =>
      this.onManifestLoadingStart(),
    );
    this.onDash(events.MANIFEST_LOADED, () => this.onManifestLoaded());
    this.onDash(events.PLAYBACK_INITIALIZED, () => this.onPlaybackInit());
    this.onDash(events.PLAYBACK_PLAYING, () => this.onPlaying());
    this.onDash(events.PLAYBACK_PAUSED, () => this.onPause());
    this.onDash(events.PLAYBACK_STARTED, () => this.onPlayingAfterWait());
    this.onDash(events.PLAYBACK_ENDED, () => this.onEnded());
    this.onDash(events.QUALITY_CHANGE_REQUESTED, (e: any) =>
      this.onQualityChangeRequested(e),
    );
    this.onDash(events.QUALITY_CHANGE_RENDERED, (e: any) =>
      this.onQualityChangeRendered(e),
    );
    this.onDash(events.PLAYBACK_ERROR, (e: any) => this.onPlaybackError(e));
    this.onDash(events.FRAGMENT_LOADING_COMPLETED, (e: any) =>
      this.onFragmentLoaded(e),
    );
    this.onDash(events.PLAYBACK_SEEKING, () => this.onSeeking());
    this.onDash(events.PLAYBACK_SEEKED, () => this.onSeeked());
    this.onDash(events.PLAYBACK_WAITING, () => this.onStallStart());
    this.onDash(events.PLAYBACK_STALLED, () => this.onStallStart());
    this.onDash(events.BUFFER_LEVEL_STATE_CHANGED, (e: any) =>
      this.onBufferLevelChange(e),
    );
    this.onDash(events.REPRESENTATION_SWITCH, (e: any) =>
      this.onBitrateChange(e),
    );
    this.onDash(events.PLAYBACK_RATE_CHANGED, (e: any) =>
      this.onPlaybackRateChanged(e),
    );
    this.onDash(events.PLAYBACK_VOLUME_CHANGED, (e: any) =>
      this.onPlaybackVolumeChanged(e),
    );
    this.onDash(events.PLAYBACK_TIME_UPDATED, () => this.onTimeUpdate());
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
   * Manifest Loading Start event
   */
  private async onManifestLoadingStart(): Promise<void> {
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
      "manifestloadingstart",
      {
        page_load_time: pageLoadTime,
      },
    );

    this.batchManager.addEvent(event);
    this.logger.debug("manifestloadingstart event fired");
  }

  /**
   * Manifest Loaded event (Player Ready)
   */
  private async onManifestLoaded(): Promise<void> {
    const event = await this.eventCollector.createEvent("playerready", {
      player_startup_time: performance.now(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("playerready event fired");
  }

  /**
   * View Start event
   */
  private async onPlaybackInit(): Promise<void> {
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
   * Quality Change Requested event
   */
  private async onQualityChangeRequested(data: any): Promise<void> {
    if (!this.video || !data) return;
    console.log("Quality change requested data:", data);
    const event = await this.eventCollector.createEvent(
      "qualitychangerequested",
      {
        requested_quality: data.newQuality,
        bitrate: this.getBitrate(),
        resolution: this.getVideoResolution(),
        framerate: this.getFramerate(),
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("qualitychange_requested event fired");
  }

  /**
   * Quality Change Rendered event
   */
  private async onQualityChangeRendered(data: any): Promise<void> {
    if (!this.video || !data) return;
    console.log("Quality change rendered data:", data);
    this.currentQuality = data.newQuality;

    const event = await this.eventCollector.createEvent(
      "qualitychangecompleted",
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
   * Playback Error event
   */
  private async onPlaybackError(data: any): Promise<void> {
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
   * Fragment Loaded event
   */
  private async onFragmentLoaded(data: any): Promise<void> {
    // This can be used for throughput calculation
    this.logger.debug("Fragment loaded", {
      duration: data.request?.duration,
      type: data.request?.type,
    });
  }

  /**
   * Seeking event
   */
  private async onSeeking(): Promise<void> {
    if (!this.video) return;
    this.seekFrom = this.video.currentTime * 1000;
    this.seekStartTime = performance.now();
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

  /**
   * Stall Start (waiting) event
   */
  private async onStallStart(): Promise<void> {
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
   * Buffer Level Change event
   */
  private async onBufferLevelChange(data: any): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent(
      "bufferlevelchange",
      {
        state: data.state,
        media_type: data.mediaType,
        buffer_len_ms: this.getBufferLength(data.mediaType),
        bitrate: this.getBitrate(),
      },
      this.video.currentTime,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("buffer_level_change event fired");
  }

  /**
   * Bitrate Change event
   */
  private async onBitrateChange(data: any): Promise<void> {
    if (!this.video || !data) return;
    console.log("Bitrate change data:", data);
    this.currentBitrate = data.currentRepresentation?.bitrateInKbit || null;
    this.currentResolution = {
      width: data.currentRepresentation?.width || null,
      height: data.currentRepresentation?.height || null,
    };
    this.currentFPS = data.currentRepresentation?.frameRate || null;
    const event = await this.eventCollector.createEvent(
      "bitratechange",
      {
        bitrate_kb: this.currentBitrate,
        bandwidth: data.currentRepresentation?.bandwidth || null,
        resolution: this.currentResolution,
        framerate: this.currentFPS,
        previous_quality: data.oldQuality,
        new_quality: data.newQuality,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("bitratechange event fired");
  }

  /**
   * Playback Rate Change event
   */
  private async onPlaybackRateChanged(data: any): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent(
      "playbackratechange",
      {
        playback_rate: data.playbackRate,
      },
      this.video.currentTime,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("playbackratechange event fired");
  }

  /**
   * Playback Volume Change event
   */
  private async onPlaybackVolumeChanged(data: any): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent(
      "playbackvolumechange",
      {
        volume: data.volume,
        muted: data.muted,
      },
      this.video.currentTime,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("playbackvolumechange event fired");
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
    return this.currentBitrate;
  }

  /**
   * Get video resolution
   */
  getVideoResolution(): Resolution | null {
    return this.currentResolution;
  }

  /**
   * Get framerate
   */
  getFramerate(): number | null {
    // dash.js doesn't directly expose framerate in bitrateList
    // Would need to parse from manifest
    return this.currentFPS;
  }

  /**
   * Get dropped frames
   */
  getDroppedFrames(): number | undefined {
    if (!this.player || !this.video) return undefined;
    try {
      if (this.dashMetrics) {
        const droppedFrames = this.dashMetrics.getCurrentDroppedFrames();
        if (droppedFrames !== undefined && droppedFrames !== null) {
          return droppedFrames;
        }
      }
    } catch (e) {
      this.logger.debug("Error getting dropped frames from metrics:", e);
    }
    return undefined;
  }

  /**
   * Get player state
   */
  getPlayerState(): PlayerState {
    if (!this.video) {
      return {
        pos: 0,
        dur: 0,
        psd: true,
        endd: false,
        bufd: null,
        rdy: 0,
        vol: 0,
        mut: false,
        spd: 0,
      };
    }

    return {
      pos: this.video.currentTime,
      dur: this.video.duration,
      psd: this.video.paused,
      endd: this.video.ended,
      bufd: this.video.buffered,
      rdy: this.video.readyState,
      vol: this.video.volume,
      mut: this.video.muted,
      spd: this.video.playbackRate,
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
  private getBufferLength(
    mediaType: "audio" | "video" = "video",
  ): number | undefined {
    if (!this.player || !this.video) return undefined;

    try {
      if (this.dashMetrics) {
        const bufferLevel = this.dashMetrics.getCurrentBufferLevel(mediaType);
        if (bufferLevel !== undefined && bufferLevel !== null) {
          return bufferLevel * 1000; // Convert to ms
        } else {
          return 0;
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
