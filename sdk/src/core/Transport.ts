/**
 * Transport - HTTP client for sending events
 */

import { BaseEvent } from "../types";
import { Logger } from "../utils/logger";
import { RetryManager } from "./RetryManager";
import { QueueManager } from "./QueueManager";

export class Transport {
  private endpointUrl: string;
  private retryManager: RetryManager;
  private queueManager: QueueManager;
  private logger: Logger;

  constructor(
    endpointUrl: string,
    retryManager: RetryManager,
    queueManager: QueueManager,
    logger: Logger,
  ) {
    this.endpointUrl = endpointUrl;
    this.retryManager = retryManager;
    this.queueManager = queueManager;
    this.logger = logger;

    // Process queue on init
    this.processQueue();

    // Set up online/offline handlers
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.logger.info("Network online, processing queue");
        this.processQueue();
      });
    }
  }

  /**
   * Send batch of events
   */
  async send(events: BaseEvent[]): Promise<void> {
    // Enqueue first
    const batchId = this.queueManager.enqueue(events);

    // Try to send immediately if online
    if (this.isOnline()) {
      await this.processQueue();
    } else {
      this.logger.info("Offline, events queued for later");
    }
  }

  /**
   * Process queue - send queued batches
   */
  private async processQueue(): Promise<void> {
    while (this.queueManager.getSize() > 0 && this.isOnline()) {
      const batch = this.queueManager.peek();
      if (!batch) break;

      try {
        await this.retryManager.executeWithRetry(async () => {
          return await this.sendBatch(batch.events);
        }, batch.attempts);

        // Success - remove from queue
        this.queueManager.dequeue();
        this.logger.info(`Batch ${batch.id} sent successfully`);
      } catch (error) {
        this.logger.error(`Failed to send batch ${batch.id}:`, error);

        // Check if should retry
        if (this.retryManager.shouldRetry(batch.attempts, error)) {
          // Re-queue for later
          const requeuedBatch = this.queueManager.dequeue();
          if (requeuedBatch) {
            this.queueManager.requeue(requeuedBatch);
          }
        } else {
          // Max retries reached or permanent error - discard
          this.queueManager.dequeue();
          this.logger.warn(`Batch ${batch.id} discarded after max retries`);
        }

        // Stop processing queue on error
        break;
      }
    }
  }

  /**
   * Send a single batch via HTTP
   */
  private async sendBatch(events: BaseEvent[]): Promise<void> {
    const payload = {
      events,
    };

    this.logger.debug(`Sending ${events.length} events to ${this.endpointUrl}`);

    const response = await fetch(this.endpointUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-SDK-Version": "1.0.0",
      },
      body: JSON.stringify(payload),
      keepalive: true, // Important for sendBeacon-like behavior
    });

    if (!response.ok) {
      const error: any = new Error(
        `HTTP ${response.status}: ${response.statusText}`,
      );
      error.status = response.status;
      error.response = response;

      // Try to get error details from response
      try {
        const errorData = await response.json();
        error.data = errorData;
      } catch (e) {
        // Ignore
      }

      throw error;
    }

    const result = await response.json();
    this.logger.debug("Batch sent successfully:", result);
  }

  /**
   * Send batch synchronously (for page unload)
   */
  sendSync(events: BaseEvent[]): void {
    if (!this.isOnline()) {
      this.logger.info("Offline, cannot send synchronously");
      return;
    }

    const payload = {
      events,
    };

    // Use sendBeacon if available
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const sent = navigator.sendBeacon(this.endpointUrl, blob);
      if (sent) {
        this.logger.info(`Sent ${events.length} events via sendBeacon`);
      } else {
        this.logger.warn("sendBeacon failed");
      }
    } else {
      // Fallback to synchronous XHR (not recommended but works)
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", this.endpointUrl, false); // synchronous
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
        this.logger.info(`Sent ${events.length} events via sync XHR`);
      } catch (error) {
        this.logger.error("Sync XHR failed:", error);
      }
    }
  }

  /**
   * Check if online
   */
  private isOnline(): boolean {
    return typeof navigator === "undefined" || navigator.onLine !== false;
  }
}
