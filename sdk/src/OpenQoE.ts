/**
 * OpenQoE - Main SDK class
 */

import { OpenQoEConfig, VideoMetadata, PlayerType } from "./types";
import { Logger } from "./utils/logger";
import { PrivacyModule } from "./utils/privacy";
import { DeviceDetector } from "./utils/device";
import { SessionManager } from "./core/SessionManager";
import { BatchManager } from "./core/BatchManager";
import { QueueManager } from "./core/QueueManager";
import { RetryManager } from "./core/RetryManager";
import { Transport } from "./core/Transport";
import { EventCollector } from "./core/EventCollector";
import { PlayerAdapter } from "./types";

// Import adapters
import { HTML5Adapter } from "./adapters/HTML5Adapter";
import { VideoJsAdapter } from "./adapters/VideoJsAdapter";
import { HlsJsAdapter } from "./adapters/HlsJsAdapter";
import { DashJsAdapter } from "./adapters/DashJsAdapter";
import { ShakaAdapter } from "./adapters/ShakaAdapter";

// Internal config type with defaults applied
type InternalConfig = Required<
  Omit<OpenQoEConfig, "appName" | "appVersion">
> & {
  appName?: string;
  appVersion?: string;
};

export class OpenQoE {
  private config: InternalConfig;
  private logger: Logger;
  private privacy: PrivacyModule;
  private deviceDetector: DeviceDetector;
  private sessionManager: SessionManager;
  private batchManager: BatchManager;
  private queueManager: QueueManager;
  private retryManager: RetryManager;
  private transport: Transport;
  private eventCollector: EventCollector;
  private currentAdapter: PlayerAdapter | null = null;
  private samplingRate: number;

  constructor(config: OpenQoEConfig) {
    // Validate required config
    if (!config.orgId || !config.playerId || !config.endpointUrl) {
      throw new Error("OpenQoE: orgId, playerId, and endpointUrl are required");
    }

    // Set defaults
    this.config = {
      orgId: config.orgId,
      playerId: config.playerId,
      endpointUrl: config.endpointUrl,
      env: config.env || "prod",
      appName: config.appName,
      appVersion: config.appVersion,
      samplingRate: config.samplingRate ?? 1.0,
      enablePII: config.enablePII || false,
      hashSalt: config.hashSalt || config.orgId, // Use orgId as default salt
      batchSize: config.batchSize || 10,
      batchInterval: config.batchInterval || 5000,
      maxQueueSize: config.maxQueueSize || 100,
      debug: config.debug || false,
      logLevel: config.logLevel || "warn",
    };

    this.samplingRate = this.config.samplingRate;

    // Initialize logger
    this.logger = new Logger(this.config.debug, this.config.logLevel);
    this.logger.info("OpenQoE SDK initialized", {
      version: "1.0.0",
      orgId: this.config.orgId,
      playerId: this.config.playerId,
      env: this.config.env,
    });

    // Initialize utilities
    this.privacy = new PrivacyModule(this.config.hashSalt);
    this.deviceDetector = new DeviceDetector();

    // Initialize core modules
    this.sessionManager = new SessionManager(this.privacy);
    this.queueManager = new QueueManager(
      this.config.maxQueueSize,
      true,
      this.logger,
    );
    this.retryManager = new RetryManager(this.logger);
    this.transport = new Transport(
      this.config.endpointUrl,
      this.retryManager,
      this.queueManager,
      this.logger,
    );

    // Initialize batch manager with flush callback
    this.batchManager = new BatchManager(
      this.config.batchSize,
      this.config.batchInterval,
      async (events) => await this.transport.send(events),
      (events) => this.transport.sendSync(events),
      this.logger,
    );

    // Initialize event collector
    this.eventCollector = new EventCollector(
      this.config.orgId,
      this.config.playerId,
      this.sessionManager,
      this.privacy,
      this.deviceDetector,
      this.logger,
      this.config.env,
      this.config.appName,
      this.config.appVersion,
    );

    // Start session
    const sessionId = this.sessionManager.startSession();
    this.logger.info("New session started:", sessionId);
  }

  /**
   * Attach player
   */
  attachPlayer(
    playerType: PlayerType,
    playerInstance: any,
    metadata?: VideoMetadata,
  ): void {
    this.logger.info(`Attaching ${playerType} player`);

    // Apply sampling
    if (!this.shouldSample()) {
      this.logger.info(
        `Skipping tracking due to sampling rate (${this.samplingRate})`,
      );
      return;
    }

    // Detach existing adapter
    if (this.currentAdapter) {
      this.currentAdapter.detach();
    }

    // Set video metadata
    if (metadata) {
      this.eventCollector.setVideoMetadata(metadata);
    }

    // Create appropriate adapter
    switch (playerType) {
      case "html5":
        this.currentAdapter = new HTML5Adapter(
          this.eventCollector,
          this.batchManager,
          this.logger,
        );
        break;
      case "videojs":
        this.currentAdapter = new VideoJsAdapter(
          this.eventCollector,
          this.batchManager,
          this.logger,
        );
        break;
      case "hlsjs":
        this.currentAdapter = new HlsJsAdapter(
          this.eventCollector,
          this.batchManager,
          this.logger,
        );
        break;
      case "dashjs":
        this.currentAdapter = new DashJsAdapter(
          this.eventCollector,
          this.batchManager,
          this.logger,
        );
        break;
      case "shaka":
        this.currentAdapter = new ShakaAdapter(
          this.eventCollector,
          this.batchManager,
          this.logger,
        );
        break;
      default:
        throw new Error(`Unsupported player type: ${playerType}`);
    }

    // Attach adapter to player
    this.currentAdapter.attach(playerInstance, metadata || {});
    this.logger.info(`${playerType} player attached successfully`);
  }

  /**
   * Track custom event manually
   */
  async trackEvent(
    eventType: string,
    data?: Record<string, any>,
  ): Promise<void> {
    if (!this.shouldSample()) {
      return;
    }

    const event = await this.eventCollector.trackEvent(eventType, data);
    this.batchManager.addEvent(event);
  }

  /**
   * Start new session
   */
  startSession(): string {
    const sessionId = this.sessionManager.startSession();
    this.logger.info("New session started:", sessionId);
    return sessionId;
  }

  /**
   * End current session
   */
  endSession(): void {
    this.sessionManager.endSession();
    this.batchManager.flush();
    this.logger.info("Session ended");
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionManager.getSessionId();
  }

  /**
   * Get current view ID
   */
  getViewId(): string | null {
    return this.sessionManager.getViewId();
  }

  /**
   * Get current config
   */
  getConfig(): Readonly<InternalConfig> {
    return { ...this.config };
  }

  /**
   * Destroy SDK instance
   */
  destroy(): void {
    this.logger.info("Destroying OpenQoE SDK instance");

    // Detach adapter
    if (this.currentAdapter) {
      this.currentAdapter.detach();
      this.currentAdapter = null;
    }

    // Flush and clear batch
    this.batchManager.destroy();

    // End session
    this.sessionManager.endSession();
  }

  /**
   * Check if should sample this session
   */
  private shouldSample(): boolean {
    return Math.random() < this.samplingRate;
  }
}
