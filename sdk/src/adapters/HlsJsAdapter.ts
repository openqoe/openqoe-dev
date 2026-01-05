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
  private player: any = null;
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
  private bandwidth: number | null = null;
  private currentBitrate: number | null = null;
  private currentResolution: Resolution | null = null;
  private currentFPS: number | null = null;
  private currentCodec: string | null = null;

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

    this.player = player;
    this.metadata = metadata;

    // Get video element
    this.video = this.player.media;
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
    if (!this.player) return;

    this.stopHeartbeat();

    // Remove HLS event listeners
    this.hlsEventHandlers.forEach((handler, event) => {
      this.player?.off(event, handler);
    });
    this.hlsEventHandlers.clear();

    // Remove video event listeners
    this.eventListeners.forEach((listener, event) => {
      this.video?.removeEventListener(event, listener);
    });
    this.eventListeners.clear();

    this.video = null;
    this.player = null;
    this.logger.info("HlsJsAdapter detached");
  }

  private async resolveHlsJS() {
    // 1. Browser UMD global
    if ((globalThis as any).Hls) {
      return (globalThis as any).Hls;
    }

    // 2. Bundler / Node
    try {
      const mod = await import("hls.js");
      return mod.default ?? mod;
    } catch {
      throw new Error(
        "Hls.js not found. Either load it globally or install hls.js as a dependency.",
      );
    }
  }

  /**
   * Attach all event listeners
   */
  private async attachEventListeners(): Promise<void> {
    if (!this.player || !this.video) return;
    let hls;
    try {
      hls = await this.resolveHlsJS();
    } catch (error) {
      throw new Error(
        "hls.js library is not available. Please ensure hls.js is installed.",
      );
    }
    this.onHls(hls.Events.MANIFEST_LOADING, (_event: any, data: any) =>
      this.onManifestLoadingStart(data),
    );
    this.onHls(hls.Events.MANIFEST_PARSED, (_event: any, data: any) =>
      this.onManifestParsed(data),
    );
    this.onHls(hls.Events.MEDIA_ATTACHED, (_event: any, data: any) =>
      this.onPlaybackInit(data),
    );
    this.onHls(hls.Events.MEDIA_DETACHED, (_event: any, data: any) =>
      this.onPlaybackDetached(data),
    );
    this.onHls(hls.Events.LEVEL_SWITCHING, (_event: any, data: any) =>
      this.onQualityChangeRequested(data),
    );
    this.onHls(hls.Events.LEVEL_SWITCHED, (_event: any, data: any) =>
      this.onLevelSwitched(data),
    );
    this.onHls(hls.Events.FRAG_BUFFERED, (_event: any, data: any) =>
      this.onFragBuffered(data),
    );
    this.onHls(hls.Events.BUFFER_APPENDED, (_event: any, data: any) =>
      this.onBufferAppended(data),
    );
    this.onHls(hls.Events.FPS_DROP, (_event: any, data: any) =>
      this.onFPSDrop(data),
    );
    this.onHls(hls.Events.ERROR, (_event: any, data: any) =>
      this.onHlsError(data),
    );

    // Standard video element events
    // this.addEventListener("loadstart", () => this.onViewStart());
    this.addEventListener("play", () => this.onPlaying());
    this.addEventListener("pause", () => this.onPause());
    this.addEventListener("seeking", () => this.onSeeking());
    this.addEventListener("seeked", () => this.onSeeked());
    this.addEventListener("waiting", () => this.onStallStart());
    this.addEventListener("playing", () => this.onPlayingAfterWait());
    this.addEventListener("ended", () => this.onEnded());
    this.addEventListener("timeupdate", () => this.onTimeUpdate());
    this.addEventListener("ratechange", () => this.onPlaybackRateChanged());
    this.addEventListener("volumechange", () => this.onPlaybackVolumeChanged());
    this.addEventListener("error", () => this.onMediaError());
  }

  /**
   * Helper to add HLS event listener
   */
  private onHls(event: string, handler: Function): void {
    if (!this.player || !event) return;

    this.player.on(event, handler);
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
   * Manifest Loading Start
   */
  private async onManifestLoadingStart(data: any): Promise<void> {
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
        ...data,
        page_load_time: pageLoadTime,
      },
    );

    this.batchManager.addEvent(event);
    this.logger.debug("manifestsloadingstart event fired");
  }

  /**
   * Manifest Parsed event (Player Ready)
   */
  private async onManifestParsed(data: any): Promise<void> {
    const event = await this.eventCollector.createEvent("playerready", {
      player_startup_time: performance.now(),
      bandwidth: data.stats?.bwEstimate,
      aborted: data.stats?.aborted,
      ...this.aggregateLevelsInManifest(data.levels),
    });
    this.batchManager.addEvent(event);
    this.logger.debug("playerready event fired");
  }
  /**
   * Media Attached event
   */
  private async onPlaybackInit(data: any): Promise<void> {
    const event = await this.eventCollector.createEvent("viewstart", {
      ...data,
      preroll_requested: false,
    });
    this.batchManager.addEvent(event);
    this.logger.debug("playbackinit event fired");
  }

  /**
   * Playback Detached event
   */
  private async onPlaybackDetached(data: any): Promise<void> {
    this.logger.debug("Media detached: ", data);
    const event = await this.eventCollector.createEvent("playbackdetached");
    this.batchManager.addEvent(event);
    this.logger.debug("playbackdetached event fired");
  }

  /**
   * Quality Change Request event
   */
  private async onQualityChangeRequested(data: any): Promise<void> {
    this.bandwidth = data.averageBitrate;
    this.currentBitrate = data.bitrate || null;
    this.currentResolution = {
      width: data.width || null,
      height: data.height || null,
    };
    this.currentFPS = parseInt(data.attrs["FRAME-RATE"]) || null;
    this.currentCodec = data.videoCodec || null;
    const event = await this.eventCollector.createEvent(
      "qualitychangerequested",
      {
        new: {
          bitrate_kb: data.bitrate,
          bandwidth: this.bandwidth,
          resolution: this.currentResolution,
          codec: this.currentCodec,
          framerate: this.currentFPS,
          max_bitrate: data.maxBitrate,
          requested_level: data.level,
          audio_codec: data.audioCodec,
        },
      },
      this.video ? this.video.currentTime * 1000 : undefined,
    );
    this.batchManager.addEvent(event);
    this.logger.debug("qualitychangerequested event fired");
  }

  /**
   * Level Switched event (Quality Change)
   */
  private async onLevelSwitched(data: any): Promise<void> {
    if (!this.video) return;
    this.currentLevel = data.level;
    const event = await this.eventCollector.createEvent(
      "qualitychangecompleted",
      {
        bitrate_kb: this.currentBitrate,
        bandwidth: this.bandwidth,
        resolution: this.currentResolution,
        framerate: this.currentFPS,
        codec: this.currentCodec || null,
        level: this.currentLevel,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("qualitychange event fired");
  }

  /**
   * Fragment Buffered event
   */
  private async onFragBuffered(data: any): Promise<void> {
    if (!this.video) return;
    this.bandwidth = data.stats.bwEstimate;
    const event = await this.eventCollector.createEvent(
      "fragmentloaded",
      {
        duration: data.frag.duration,
        bandwidth: this.bandwidth,
        aborted: data.stats.aborted,
        url: data.frag.base.url,
        rel_url: data.frag.relurl,
        media_type: data.frag.type,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("Fragmentbuffered event fired");
  }

  /**
   * Buffer Append event
   */
  private async onBufferAppended(data: any): Promise<void> {
    // Can be used for buffer analysis
    if (!this.video) return;
    const event = await this.eventCollector.createEvent(
      "bufferlevelchange",
      {
        media_type: data.type,
        url: data.frag.base.url,
        rel_url: data.frag.relurl,
        bandwidth: data.frag.stats?.bwEstimate,
        buffer_length: this.getBufferAhead(data.timeRanges[data.type]),
        buffer_gap: data.timeRanges[data.type].length > 1,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("Bufferappended event fired");
  }

  private async onFPSDrop(data: any): Promise<void> {
    if (!this.video) return;
    this.logger.info("FPS dropped", data);
    const event = await this.eventCollector.createEvent(
      "fpsdrop",
      data,
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("FPS dropped event fired");
  }

  /**
   * HLS Error event
   */
  private async onHlsError(data: any): Promise<void> {
    if (!this.player) return;

    const { type, details, fatal } = data;

    let errorFamily: string;
    let errorMessage: string;

    // Determine error family based on type
    if (type === this.player.constructor.ErrorTypes.NETWORK_ERROR) {
      errorFamily = "network";
      errorMessage = `Network error: ${details}`;
    } else if (type === this.player.constructor.ErrorTypes.MEDIA_ERROR) {
      errorFamily = "decoder";
      errorMessage = `Media error: ${details}`;
    } else if (type === this.player.constructor.ErrorTypes.MUX_ERROR) {
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
    if (fatal && type === this.player.constructor.ErrorTypes.NETWORK_ERROR) {
      this.logger.warn("Fatal network error, HLS.js will attempt recovery");
    }
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
   * Playback rate changed
   */
  private async onPlaybackRateChanged(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      "playbackratechange",
      {
        playback_rate: this.video.playbackRate,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("playbackratechange event fired");
  }

  /**
   * Playback volume changed
   */
  private async onPlaybackVolumeChanged(): Promise<void> {
    if (!this.video) return;

    const event = await this.eventCollector.createEvent(
      "playbackvolumechange",
      {
        volume: this.video.volume,
        muted: this.video.muted,
      },
      this.video.currentTime * 1000,
    );

    this.batchManager.addEvent(event);
    this.logger.debug("playbackvolumechange event fired");
  }

  /**
   * Playback error
   */
  private async onMediaError(): Promise<void> {
    if (!this.video || !this.video.error) return;

    const mediaError = this.video.error;
    const errorMessage = `MediaError code ${mediaError.code}: ${mediaError.message}`;
    this.onError({
      code: mediaError.code,
      message: errorMessage,
      fatal: false,
      context: {
        error_family: "media",
      },
    });
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
    return (this, this.currentResolution);
  }

  /**
   * Get framerate
   */
  getFramerate(): number | null {
    return this.currentFPS;
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

    // HLS.js can be configured with CMCD, check if available
    const config = this.player.config;
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
    if (!this.player || !this.video) return undefined;

    // HLS.js provides backBufferLength and maxBufferLength
    const bufferInfo = this.player.media ? this.player.buffered : null;
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

  private getBufferAhead(timeRanges: TimeRanges): number | undefined {
    if (!this.video) return undefined;

    const currentTime = this.video.currentTime;
    const EPSILON = 0.05; // 50ms

    for (let i = 0; i < timeRanges.length; i++) {
      const start = timeRanges.start(i);
      const end = timeRanges.end(i);

      if (currentTime + EPSILON >= start && currentTime < end + EPSILON) {
        const bufferAheadSec = Math.max(0, end - currentTime);
        return bufferAheadSec * 1000;
      }
    }

    return undefined;
  }

  // calculates median of available levels
  private aggregateLevelsInManifest(levels: any[]): {
    bitrates: number[];
    resolution: Resolution[];
    framerate: number[];
  } {
    const stats: {
      bitrates: number[];
      resolution: Resolution[];
      framerate: number[];
    } = {
      bitrates: [],
      resolution: [],
      framerate: [],
    };

    for (const level of levels) {
      stats.bitrates.push(level.bitrate || 0);
      stats.resolution.push({
        width: level.width || 0,
        height: level.height || 0,
      });
      stats.framerate.push(level.frameRate || 0);
    }
    return stats;
  }
}
