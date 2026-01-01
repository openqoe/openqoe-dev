/**
 * Batch Manager - Accumulates events and triggers flushes
 */

import { BaseEvent } from "../types";
import { Logger } from "../utils/logger";

export class BatchManager {
  private batch: BaseEvent[] = [];
  private maxBatchSize: number;
  private maxBatchInterval: number;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private asyncFlushCallback: (events: BaseEvent[]) => Promise<void>;
  private flushSyncCallback: (events: BaseEvent[]) => void;
  private logger: Logger;

  constructor(
    maxBatchSize: number = 10,
    maxBatchInterval: number = 5000,
    asyncFlushCallback: (events: BaseEvent[]) => Promise<void>,
    flushSyncCallback: (events: BaseEvent[]) => void,
    logger: Logger,
  ) {
    this.maxBatchSize = maxBatchSize;
    this.maxBatchInterval = maxBatchInterval;
    this.asyncFlushCallback = asyncFlushCallback;
    this.flushSyncCallback = flushSyncCallback;
    this.logger = logger;

    // Set up beforeunload handler to flush on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.flushSync();
      });

      // Also handle visibility change
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.flushSync();
        }
      });
    }
  }

  /**
   * Add event to batch
   */
  addEvent(event: BaseEvent): void {
    this.batch.push(event);
    this.logger.debug(`Event added to batch: ${event.event_type}`, event);

    // Check if batch size reached
    if (this.batch.length >= this.maxBatchSize) {
      this.flush();
      return;
    }

    // Start timer if not already running
    if (!this.flushTimer) {
      this.startTimer();
    }
  }

  /**
   * Flush batch (async)
   */
  async flush(): Promise<void> {
    this.stopTimer();

    if (this.batch.length === 0) {
      return;
    }

    const eventsToSend = [...this.batch];
    this.batch = [];

    this.logger.info(`Flushing batch of ${eventsToSend.length} events`);

    try {
      await this.asyncFlushCallback(eventsToSend);
      this.logger.debug("Batch flushed successfully");
    } catch (error) {
      this.logger.error("Failed to flush batch:", error);
      // Re-queue events (up to max queue size)
      // This will be handled by the queue/retry logic
    }
  }

  /**
   * Flush batch synchronously (for page unload)
   */
  flushSync(): void {
    this.stopTimer();

    if (this.batch.length === 0) {
      return;
    }

    const eventsToSend = [...this.batch];
    this.batch = [];

    this.logger.info(
      `Flushing batch synchronously: ${eventsToSend.length} events`,
    );

    // Use sendBeacon if available
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      // The actual sending will be handled by the transport layer
      // For now, just call the callback synchronously
      this.flushSyncCallback(eventsToSend);
    }
  }

  /**
   * Get current batch size
   */
  getBatchSize(): number {
    return this.batch.length;
  }

  /**
   * Clear batch
   */
  clear(): void {
    this.stopTimer();
    this.batch = [];
  }

  /**
   * Destroy batch manager
   */
  destroy(): void {
    this.flushSync();
    this.stopTimer();
  }

  /**
   * Start flush timer
   */
  private startTimer(): void {
    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.maxBatchInterval);
  }

  /**
   * Stop flush timer
   */
  private stopTimer(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}
