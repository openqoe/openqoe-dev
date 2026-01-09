/**
 * Event Collector - Collects and enriches events
 */

import { BaseEvent, VideoMetadata, CMCDData, PlayerInfo } from "../types";
import { Logger } from "../utils/logger";
import { SessionManager } from "./SessionManager";
import { PrivacyModule } from "../utils/privacy";
import { DeviceDetector } from "../utils/device";

export class EventCollector {
  private orgId: string;
  private playerId: string;
  private env?: string;
  private appName?: string;
  private appVersion?: string;
  private sessionManager: SessionManager;
  private privacy: PrivacyModule;
  private deviceDetector: DeviceDetector;
  private logger: Logger;
  private viewerId: string | null = null;
  private videoMetadata: VideoMetadata | null = null;
  private playerInfo: PlayerInfo | null = null;

  constructor(
    orgId: string,
    playerId: string,
    sessionManager: SessionManager,
    privacy: PrivacyModule,
    deviceDetector: DeviceDetector,
    logger: Logger,
    env?: string,
    appName?: string,
    appVersion?: string,
  ) {
    this.orgId = orgId;
    this.playerId = playerId;
    this.env = env;
    this.appName = appName;
    this.appVersion = appVersion;
    this.sessionManager = sessionManager;
    this.privacy = privacy;
    this.deviceDetector = deviceDetector;
    this.logger = logger;

    // Generate viewer ID asynchronously
    this.initializeViewerId();
  }

  /**
   * Initialize viewer ID
   */
  private async initializeViewerId(): Promise<void> {
    this.viewerId = await this.privacy.generateViewerId();
    this.logger.debug("Viewer ID initialized");
  }

  /**
   * Set video metadata
   */
  setVideoMetadata(metadata: VideoMetadata): void {
    this.videoMetadata = metadata;
  }

  /**
   * Set player info
   */
  setPlayerInfo(info: PlayerInfo): void {
    this.playerInfo = info;
  }

  /**
   * Create event with full context
   */
  async createEvent(
    eventType: string,
    data?: Record<string, any>,
    playbackTime?: number,
    cmcd?: CMCDData,
  ): Promise<BaseEvent> {
    // Ensure viewer ID is initialized
    if (!this.viewerId) {
      await this.initializeViewerId();
    }

    const event: BaseEvent = {
      // Event metadata
      event_type: eventType,
      event_time: Date.now(),
      viewer_time: Date.now(),
      playback_time: playbackTime,

      // Session identifiers
      org_id: this.orgId,
      player_id: this.playerId,
      view_id: this.sessionManager.getViewId() || "unknown",
      session_id: this.sessionManager.getSessionId() || "unknown",
      viewer_id: this.viewerId || "unknown",

      // Environment
      env: this.env,
      app_name: this.appName,
      app_version: this.appVersion,

      // Context
      device: this.deviceDetector.getDeviceInfo(),
      os: this.deviceDetector.getOSInfo(),
      browser: this.deviceDetector.getBrowserInfo(),
      player: this.playerInfo || undefined,
      network: await this.deviceDetector.getNetworkInfo(),

      // Video metadata
      video: this.videoMetadata
        ? {
            id: this.videoMetadata.videoId,
            title: this.videoMetadata.videoTitle,
            series: this.videoMetadata.videoSeries,
            duration: this.videoMetadata.duration,
            source_url: this.videoMetadata.sourceUrl
              ? PrivacyModule.sanitizeUrl(this.videoMetadata.sourceUrl)
              : undefined,
          }
        : undefined,

      // CMCD
      cmcd: cmcd,

      // Event-specific data
      data: data,
    };

    // Sanitize event
    const sanitizedEvent = this.privacy.sanitizeEvent(event);

    this.logger.debug(`Event created: ${eventType}`, sanitizedEvent);

    return sanitizedEvent;
  }

  /**
   * Track custom event
   */
  async trackEvent(
    eventType: string,
    data?: Record<string, any>,
  ): Promise<BaseEvent> {
    return await this.createEvent(eventType, data);
  }
}
