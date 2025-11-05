/**
 * Queue Manager - Offline queue with localStorage persistence
 */

import { BaseEvent } from '../types';
import { Logger } from '../utils/logger';

interface QueuedBatch {
  id: string;
  events: BaseEvent[];
  timestamp: number;
  attempts: number;
}

export class QueueManager {
  private queue: QueuedBatch[] = [];
  private maxQueueSize: number;
  private persistToStorage: boolean;
  private storageKey: string;
  private logger: Logger;

  constructor(
    maxQueueSize: number = 100,
    persistToStorage: boolean = true,
    logger: Logger
  ) {
    this.maxQueueSize = maxQueueSize;
    this.persistToStorage = persistToStorage;
    this.storageKey = 'openqoe_queue';
    this.logger = logger;

    // Load persisted queue
    if (this.persistToStorage) {
      this.loadFromStorage();
    }
  }

  /**
   * Enqueue a batch of events
   */
  enqueue(events: BaseEvent[]): string {
    const batch: QueuedBatch = {
      id: this.generateId(),
      events,
      timestamp: Date.now(),
      attempts: 0
    };

    this.queue.push(batch);
    this.logger.debug(`Batch enqueued: ${batch.id}, queue size: ${this.queue.length}`);

    // Enforce max queue size (FIFO eviction)
    while (this.queue.length > this.maxQueueSize) {
      const removed = this.queue.shift();
      this.logger.warn(`Queue full, removing oldest batch: ${removed?.id}`);
    }

    // Persist to storage
    if (this.persistToStorage) {
      this.saveToStorage();
    }

    return batch.id;
  }

  /**
   * Dequeue next batch
   */
  dequeue(): QueuedBatch | null {
    if (this.queue.length === 0) {
      return null;
    }

    const batch = this.queue.shift() || null;

    if (batch) {
      this.logger.debug(`Batch dequeued: ${batch.id}`);

      if (this.persistToStorage) {
        this.saveToStorage();
      }
    }

    return batch;
  }

  /**
   * Peek at next batch without removing
   */
  peek(): QueuedBatch | null {
    return this.queue[0] || null;
  }

  /**
   * Re-queue a batch (for retry)
   */
  requeue(batch: QueuedBatch): void {
    batch.attempts += 1;
    this.queue.unshift(batch); // Add to front of queue

    this.logger.debug(`Batch requeued: ${batch.id}, attempt: ${batch.attempts}`);

    if (this.persistToStorage) {
      this.saveToStorage();
    }
  }

  /**
   * Remove a specific batch by ID
   */
  remove(batchId: string): void {
    const index = this.queue.findIndex(b => b.id === batchId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.logger.debug(`Batch removed: ${batchId}`);

      if (this.persistToStorage) {
        this.saveToStorage();
      }
    }
  }

  /**
   * Get queue size
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Get total event count in queue
   */
  getEventCount(): number {
    return this.queue.reduce((sum, batch) => sum + batch.events.length, 0);
  }

  /**
   * Clear entire queue
   */
  clear(): void {
    this.queue = [];
    this.logger.info('Queue cleared');

    if (this.persistToStorage) {
      this.saveToStorage();
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const data = JSON.stringify(this.queue);
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      this.logger.warn('Failed to save queue to storage:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.queue = JSON.parse(data);
        this.logger.info(`Loaded ${this.queue.length} batches from storage`);
      }
    } catch (error) {
      this.logger.warn('Failed to load queue from storage:', error);
      this.queue = [];
    }
  }

  /**
   * Generate unique batch ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
