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
import { PrivacyModule } from "../utils/privacy";

export class DashJsAdapter implements PlayerAdapter {
  private player: any = null;
  private video: HTMLVideoElement | null = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private metadata: VideoMetadata = {};
  private dashEventHandlers: Map<string, Function> = new Map();
  private dashMetrics: any = null;

  // State tracking
  private lastPlaybackTime: number = 0;
  private playingTime: number = 0;
  private watchTime: number = 0;
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
  private bufferStats = { mean: 0, m2: 0, count: 0 };
  private bufferSampleRate = 0.05; // 5% baseline sampling
  private bufferZThreshold = 2.0; // Report if data is > 2 standard deviations away
  private fragStats = { mean: 0, m2: 0, count: 0 };
  private fragSampleRate = 0.1; // 10% baseline (slightly higher than buffer for network visibility)
  private fragZThreshold = 3.0; // Higher threshold (3.0) for network because latency is naturally jittery

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
    // Handle visibility change
    document.addEventListener("visibilitychange", this.onVisibilityChange);

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
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.video = null;
    this.player = null;
    this.logger.info("DashJsAdapter detached");
  }

  private onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      this.onMoveAway();
    } else if (document.visibilityState === "visible") {
      this.onMoveback();
    }
  };

  private async resolveDashJS(): Promise<any> {
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
    const dashjs = await this.resolveDashJS();
    // Get MediaPlayer events enum
    const events = dashjs.MediaPlayer.events;

    // dash.js specific events
    this.onDash(events.FRAGMENT_LOADING_COMPLETED, (e: any) =>
      this.onFragmentLoaded(e),
    );
    this.onDash(events.MANIFEST_LOADING_FINISHED, () => this.onManifestLoad());
    this.onDash(events.MANIFEST_LOADED, () => this.onPlayerReady());
    this.onDash(events.BUFFER_LEVEL_UPDATED, (e: any) =>
      this.onBufferLevelChange(e),
    );
    this.onDash(events.REPRESENTATION_SWITCH, (e: any) =>
      this.onBandwidthChange(e),
    );
    this.onDash(events.QUALITY_CHANGE_REQUESTED, (e: any) =>
      this.onQualityChangeRequested(e),
    );
    this.onDash(events.QUALITY_CHANGE_RENDERED, (e: any) =>
      this.onQualityChangeRendered(e),
    );
    this.onDash(events.CAN_PLAY, () => {
      this.onCanPlay();
    });
    this.onDash(events.PLAYBACK_PLAYING, (e: any) => this.onPlaying(e));
    this.onDash(events.PLAYBACK_PAUSED, () => this.onPause());
    this.onDash(events.PLAYBACK_STARTED, (e: any) =>
      this.onPlayingAfterWait(e),
    );
    this.onDash(events.PLAYBACK_ENDED, () => this.onEnded());
    this.onDash(events.PLAYBACK_ERROR, (e: any) => this.onPlaybackError(e));
    this.onDash(events.PLAYBACK_SEEKING, () => this.onSeeking());
    this.onDash(events.PLAYBACK_SEEKED, () => this.onSeeked());
    this.onDash(events.PLAYBACK_WAITING, () => this.onStallStart());
    this.onDash(events.PLAYBACK_STALLED, () => this.onStallStart());
    this.onDash(events.PLAYBACK_RATE_CHANGED, (e: any) =>
      this.onPlaybackRateChanged(e),
    );
    this.onDash(events.PLAYBACK_VOLUME_CHANGED, () =>
      this.onPlaybackVolumeChanged(),
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
   * Fragment Loaded event
   */
  private async onFragmentLoaded(data: any): Promise<void> {
    if (!this.video || !data || !data.request) return;
    // Calculate the actual network latency (Time till first byte in ms)
    // We use firstByteDate - availabilityStartTime to get the network latency
    const endTime = new Date(data.request.firstByteDate).getTime();
    const startTime = new Date(data.request.availabilityStartTime).getTime();
    // time till first byte
    const ttfb = endTime - startTime;

    // 1. Update running stats (Welford's Algorithm)
    this.fragStats.count++;
    const delta = ttfb - this.fragStats.mean;
    this.fragStats.mean += delta / this.fragStats.count;
    const delta2 = ttfb - this.fragStats.mean;
    this.fragStats.m2 += delta * delta2;

    // 2. Calculate Standard Deviation and Z-Score
    const stdDev =
      this.fragStats.count > 1
        ? Math.sqrt(this.fragStats.m2 / (this.fragStats.count - 1))
        : 0;
    const zScore =
      stdDev > 0 ? Math.abs(ttfb - this.fragStats.mean) / stdDev : 0;

    // 3. Decision Logic
    const isOutlier = zScore > this.fragZThreshold;
    const isRandomSample = Math.random() < this.fragSampleRate;

    if (isOutlier || isRandomSample) {
      const event = await this.eventCollector.createEvent(
        "fragmentloaded",
        {
          frag_duration: data.request.duration,
          size_bytes: data.request.bytesTotal,
          time_to_load:
            new Date(data.request.endDate).getTime() -
            new Date(data.request.availabilityStartTime).getTime(),
          ttfb_ms: ttfb,
          z_score: parseFloat(zScore.toFixed(2)),
          service_location: data.request.serviceLocation,
          url: PrivacyModule.sanitizeUrl(data.request.url),
          frag_id: data.request.representation?.id,
          media_type: data.request.mediaType,
          type: data.request.type,
          is_outlier: isOutlier,
        },
        this.video.currentTime * 1000,
      );

      this.batchManager.addEvent(event);
      this.logger.debug(
        `Fragment loaded ${isOutlier ? "[OUTLIER]" : "[SAMPLE]"}`,
        {
          latency: ttfb,
          z: zScore.toFixed(2),
        },
      );
    }
  }
  /**
   * Manifest Loading Start event
   */
  private async onManifestLoad(): Promise<void> {
    // Get page load time using Navigation Timing Level 2
    let pageLoadTime: number | undefined;
    const navigationTiming = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      pageLoadTime =
        navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
    }
    const event = await this.eventCollector.createEvent("manifestload", {
      page_load_time: pageLoadTime,
    });

    this.batchManager.addEvent(event);
    this.logger.debug("manifestload event fired");
  }

  /**
   * Manifest Loaded event (Player Ready)
   */
  private async onPlayerReady(): Promise<void> {
    const event = await this.eventCollector.createEvent("playerready", {
      player_startup_time: performance.now(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("playerready event fired");
  }

  /**
   * Buffer Level Change event
   */
  private async onBufferLevelChange(data: any): Promise<void> {
    if (!this.video) return;

    const currentLevel = data.bufferLevel * 1000;

    // 1. Update running stats (Welford's Algorithm)
    this.bufferStats.count++;
    const delta = currentLevel - this.bufferStats.mean;
    this.bufferStats.mean += delta / this.bufferStats.count;
    const delta2 = currentLevel - this.bufferStats.mean;
    this.bufferStats.m2 += delta * delta2;

    // 2. Calculate Standard Deviation and Z-Score
    const stdDev =
      this.bufferStats.count > 1
        ? Math.sqrt(this.bufferStats.m2 / (this.bufferStats.count - 1))
        : 0;
    const zScore =
      stdDev > 0 ? Math.abs(currentLevel - this.bufferStats.mean) / stdDev : 0;

    // 3. Decision Logic: Is this a "boring" sample or a "critical" outlier?
    const isOutlier = zScore > this.bufferZThreshold;
    const isRandomSample = Math.random() < this.bufferSampleRate;

    if (isOutlier || isRandomSample) {
      const event = await this.eventCollector.createEvent(
        "bufferlevelchange",
        {
          buffer_len_ms: currentLevel,
          z_score: parseFloat(zScore.toFixed(2)),
          // Optional: add metadata so backend knows WHY this was sent
          is_outlier: isOutlier,
          media_type: data.mediaType,
        },
        this.video.currentTime * 1000,
      );

      this.batchManager.addEvent(event);
      this.logger.debug(
        `buffer_level_change ${isOutlier ? "[OUTLIER]" : "[SAMPLE]"} added to batch`,
      );
    }
  }

  /**
   * Bitrate Change event
   */
  private async onBandwidthChange(data: any): Promise<void> {
    if (!this.video || !data) return;
    const event = await this.eventCollector.createEvent(
      "bandwidthchange",
      {
        media_type: data.mediaType,
        bandwidth: data.currentRepresentation?.bandwidth || null,
        codec: data.currentRepresentation?.codecFamily || null,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("bandwidthchange event fired");
  }

  /**
   * Quality Change Requested event
   */
  private async onQualityChangeRequested(data: any): Promise<void> {
    if (!this.video || !data) return;
    const event = await this.eventCollector.createEvent(
      "qualitychangerequested",
      {
        old: {
          bitrate_kb: data.oldRepresentation?.bitrateInKbit || null,
          resolution: {
            width: data.oldRepresentation?.width || null,
            height: data.oldRepresentation?.height || null,
          },
          framerate: data.oldRepresentation?.frameRate || null,
          codec: data.oldRepresentation?.codecFamily || null,
        },
        new: {
          bitrate_kb: data.newRepresentation?.bitrateInKbit || null,
          resolution: {
            width: data.newRepresentation?.width || null,
            height: data.newRepresentation?.height || null,
          },
          framerate: data.newRepresentation?.frameRate || null,
          codec: data.newRepresentation?.codecFamily || null,
        },
        media_type: data.mediaType,
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
    this.currentBitrate = data.newRepresentation?.bitrateInKbit || null;
    this.currentResolution = {
      width: data.newRepresentation?.width || null,
      height: data.newRepresentation?.height || null,
    };
    this.currentFPS = data.newRepresentation?.frameRate || null;

    const event = await this.eventCollector.createEvent(
      "qualitychange",
      {
        bitrate_kb: this.currentBitrate,
        media_type: data.mediaType,
        resolution: this.currentResolution,
        bits_per_pixel:
          data.mediaType == "video"
            ? data.newRepresentation.bitsPerPixel
            : null,
        video_width: this.video.videoWidth,
        video_height: this.video.videoHeight,
        player_width: this.video.offsetWidth,
        player_height: this.video.offsetHeight,
        device_pixel_ratio: window.devicePixelRatio,
        framerate: this.currentFPS,
        codec: data.newRepresentation?.codecFamily || null,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("qualitychange event fired");
  }

  /**
   * View Start event
   */
  private async onCanPlay(): Promise<void> {
    const event = await this.eventCollector.createEvent("canplay", {
      video_startup_time: performance.now(),
    });

    this.batchManager.addEvent(event);
    this.logger.debug("canplay event fired");
  }

  /**
   * Playing event
   */
  private async onPlaying(data: any): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent(
      "playing",
      {
        playing_time: data.playingTime,
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
  private async onPlayingAfterWait(data: any): Promise<void> {
    if (!this.video) return;
    // If we were stalled, fire stallend
    const event = await this.eventCollector.createEvent(
      "stallend",
      {
        stall_position_secs: data.startTime,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("stallend event fired");
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
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      "stallstart",
      {
        buffer_len_ms: this.getBufferLength(),
        bitrate: this.getBitrate(),
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("stallstart event fired");
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
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("playbackratechange event fired");
  }

  /**
   * Playback Volume Change event
   */
  private async onPlaybackVolumeChanged(): Promise<void> {
    if (!this.video) return;
    const event = await this.eventCollector.createEvent(
      "playbackvolumechange",
      {
        volume: this.video.volume * 100,
        muted: this.video.muted,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("playbackvolumechange event fired");
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

  private async onMoveAway(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      "moveaway",
      {},
      this.video.currentTime * 1000,
    );
    this.batchManager.addBeaconEventAndSend(event);
    this.logger.debug("moveaway event fired");
  }

  private async onMoveback(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      "moveback",
      {},
      this.video.currentTime * 1000,
    );
    this.batchManager.addEvent(event);
    this.logger.debug("moveback event fired");
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
          buffer_len_ms: this.getBufferLength(),
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
        position: 0,
        duration: 0,
        paused: true,
        ended: false,
        buffered: null,
        ready: 0,
        volume: 0,
        muted: false,
        playback_rate: 0,
      };
    }

    return {
      position: this.video.currentTime,
      duration: this.video.duration,
      paused: this.video.paused,
      ended: this.video.ended,
      buffered: this.video.buffered,
      ready: this.video.readyState,
      volume: this.video.volume * 100,
      muted: this.video.muted,
      playback_rate: this.video.playbackRate,
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
