import { BatchManager } from "../core/BatchManager";
import { EventCollector } from "../core/EventCollector";
import { CMCDData, PlayerAdapter, PlayerState, Resolution } from "../types";
import { Logger } from "../utils/logger";

export class HTML5Adapter implements PlayerAdapter {
  private video: HTMLVideoElement | null = null;
  private eventCollector: EventCollector;
  private batchManager: BatchManager;
  private logger: Logger;
  private eventListeners: Map<string, { target: EventTarget; handler: any }> =
    new Map();

  private heartbeatInterval: any = null;
  private isSeeking: boolean = false;

  constructor(
    eventCollector: EventCollector,
    batchManager: BatchManager,
    logger: Logger,
  ) {
    this.eventCollector = eventCollector;
    this.batchManager = batchManager;
    this.logger = logger;
  }

  // --- Interface Implementation ---

  attach(player: HTMLVideoElement): void {
    this.video = player;
    this.attachEventListeners();
    this.startHeartbeat();

    // Initial State Capture
    this.emit("adapter_attached");
    this.logger.info("HTML5Adapter attached to video element.");
  }

  detach(): void {
    this.stopHeartbeat();
    this.eventListeners.forEach(({ target, handler }, event) => {
      target.removeEventListener(event, handler);
    });
    this.eventListeners.clear();
    this.video = null;
  }

  getVideoPlaybackPosition(): number {
    return (this.video?.currentTime || 0) * 1000;
  }
  getDuration(): number {
    return (this.video?.duration || 0) * 1000;
  }
  getBitrate(): number | null {
    return null;
  }
  getVideoResolution(): Resolution | null {
    if (!this.video || this.video.videoWidth === 0) return null;
    return { width: this.video.videoWidth, height: this.video.videoHeight };
  }
  getPlayerState(): PlayerState {
    if (!this.video)
      return {
        currentTime: 0,
        duration: 0,
        paused: true,
        ended: false,
        buffered: null,
        readyState: 0,
      };
    return {
      currentTime: this.video.currentTime,
      duration: this.video.duration,
      paused: this.video.paused,
      ended: this.video.ended,
      buffered: this.video.buffered,
      readyState: this.video.readyState,
    };
  }
  getCMCDData(): CMCDData | null {
    return null;
  }

  // --- Critical Event Collection ---

  private async emit(eventName: string, data: object = {}): Promise<void> {
    const event = await this.eventCollector.createEvent(eventName, {
      ...data,
      p_ts: performance.now(), // High-res time for duration math
      pos: this.getVideoPlaybackPosition(),
      buf: this.getBufferLength(),
      res: this.getVideoResolution(),
      seeking: this.isSeeking,
      v_state: document.visibilityState,
      net: navigator.onLine, // QoS: Is the device actually connected?
      vol: this.video?.volume, // QoE: Is the user actually listening?
      mute: this.video?.muted,
      speed: this.video?.playbackRate,
      dropped: this.getDroppedFrames(),
    });
    this.batchManager.addEvent(event);
    this.logger.debug(`Event emitted: ${eventName}`, event);
  }

  private attachEventListeners(): void {
    if (!this.video) return;

    // 1. Startup & Loading Lifecycle (The "Join Time" sequence)
    this.bind(this.video, "loadstart"); // Step 1: Requesting bits
    this.bind(this.video, "loadedmetadata"); // Step 2: Know duration/res
    this.bind(this.video, "loadeddata"); // Step 3: First frame ready
    this.bind(this.video, "canplay"); // Step 4: Ready to start
    this.bind(this.video, "canplaythrough"); // Step 5: Buffer is healthy

    // 2. Playback State
    this.bind(this.video, "play");
    this.bind(this.video, "playing");
    this.bind(this.video, "pause");
    this.bind(this.video, "ended");
    this.bind(this.video, "ratechange"); // User changing speed (0.5x, 2x)
    this.bind(this.video, "volumechange"); // Engagement tracking

    // 3. QoS / Network Issues
    this.bind(this.video, "waiting"); // Stalling
    this.bind(this.video, "stalled"); // Protocol/Fetch level hang
    this.bind(this.video, "progress"); // Fired as browser downloads bits
    this.bind(this.video, "resize"); // CRITICAL: Proxy for ABR changes
    this.bind(this.video, "error");

    // 4. Seeking (User behavior)
    this.bind(this.video, "seeking", () => (this.isSeeking = true));
    this.bind(this.video, "seeked", () => (this.isSeeking = false));

    // 5. Environmental / Engagement
    this.bind(document, "visibilitychange", () => {
      this.emit("visibility_change");
      if (document.visibilityState === "hidden") this.batchManager.flush();
    });

    this.bind(window, "online");
    this.bind(window, "offline");
  }

  private bind(
    target: EventTarget,
    event: string,
    extraLogic?: Function,
  ): void {
    const handler = () => {
      if (extraLogic) extraLogic();
      this.emit(evt_name_map[event] || event);
    };
    target.addEventListener(event, handler);
    this.eventListeners.set(event, { target, handler });
  }

  // --- QoS Helpers ---

  private getBufferLength(): number {
    if (!this.video) return 0;
    const b = this.video.buffered;
    const t = this.video.currentTime;
    for (let i = 0; i < b.length; i++) {
      if (t >= b.start(i) && t <= b.end(i)) return (b.end(i) - t) * 1000;
    }
    return 0;
  }

  private getDroppedFrames(): number {
    return (
      (this.video as any)?.getVideoPlaybackQuality?.().droppedVideoFrames || 0
    );
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => this.emit("heartbeat"), 10000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
  }
}

const evt_name_map: Record<string, string> = {
  loadstart: "buffer_init",
  canplaythrough: "buffer_full",
  waiting: "stall_start",
};
