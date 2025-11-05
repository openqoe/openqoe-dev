/**
 * Retry Manager - Exponential backoff retry logic
 */

import { Logger } from '../utils/logger';

export interface RetryConfig {
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoff: number; // ms
  initialDelay: number; // ms
}

export class RetryManager {
  private config: RetryConfig;
  private logger: Logger;

  constructor(logger: Logger, config?: Partial<RetryConfig>) {
    this.logger = logger;
    this.config = {
      maxRetries: config?.maxRetries ?? 3,
      backoffMultiplier: config?.backoffMultiplier ?? 2,
      maxBackoff: config?.maxBackoff ?? 30000, // 30 seconds
      initialDelay: config?.initialDelay ?? 1000 // 1 second
    };
  }

  /**
   * Calculate backoff delay for a given attempt
   */
  calculateBackoff(attempt: number): number {
    const delay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt);
    const jitter = Math.random() * 1000; // Add jitter (0-1000ms)
    const totalDelay = Math.min(delay + jitter, this.config.maxBackoff);

    this.logger.debug(`Backoff calculated for attempt ${attempt}: ${totalDelay}ms`);
    return totalDelay;
  }

  /**
   * Check if should retry
   */
  shouldRetry(attempts: number, error?: any): boolean {
    // Don't retry if max retries reached
    if (attempts >= this.config.maxRetries) {
      this.logger.warn(`Max retries (${this.config.maxRetries}) reached`);
      return false;
    }

    // Don't retry on client errors (4xx)
    if (error?.status && error.status >= 400 && error.status < 500) {
      this.logger.warn(`Client error (${error.status}), not retrying`);
      return false;
    }

    return true;
  }

  /**
   * Execute with retry
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (!this.shouldRetry(attempt, error)) {
        throw error;
      }

      const delay = this.calculateBackoff(attempt);
      this.logger.info(`Retrying after ${delay}ms (attempt ${attempt + 1}/${this.config.maxRetries})`);

      await this.sleep(delay);
      return this.executeWithRetry(fn, attempt + 1);
    }
  }

  /**
   * Sleep for a given duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
