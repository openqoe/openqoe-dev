/**
 * Cardinality Governance Module
 */

import { Config } from './config';
import { Env } from './types';

export class CardinalityService {
  private config: Config;
  private env: Env;

  constructor(config: Config, env: Env) {
    this.config = config;
    this.env = env;
  }

  /**
   * Apply cardinality governance to a dimension value
   */
  async applyGovernance(dimension: string, value: string): Promise<string | null> {
    const limit = this.config.getCardinalityLimit(dimension);

    if (!limit) {
      // No limit defined, allow the value
      return value;
    }

    switch (limit.action) {
      case 'allow':
        return await this.handleAllow(dimension, value, limit.max_cardinality);

      case 'bucket':
        return this.handleBucket(dimension, value, limit.bucket_size || 1000);

      case 'hash':
        return this.handleHash(value);

      case 'drop':
        return null;

      default:
        return value;
    }
  }

  /**
   * Handle 'allow' action - track cardinality and allow if under limit
   */
  private async handleAllow(dimension: string, value: string, maxCardinality: number): Promise<string | null> {
    const key = `cardinality:${dimension}`;

    try {
      // Get current cardinality set from KV
      const existingJson = await this.env.CARDINALITY_KV.get(key);
      const existingSet: Set<string> = existingJson
        ? new Set(JSON.parse(existingJson))
        : new Set();

      // Check if value already exists
      if (existingSet.has(value)) {
        return value; // Already tracked, allow
      }

      // Check if adding this value would exceed limit
      if (existingSet.size >= maxCardinality) {
        console.warn(`Cardinality limit reached for ${dimension}: ${existingSet.size}/${maxCardinality}`);
        return this.handleHash(value); // Fall back to hash
      }

      // Add to set and save back to KV
      existingSet.add(value);
      await this.env.CARDINALITY_KV.put(
        key,
        JSON.stringify(Array.from(existingSet)),
        { expirationTtl: 86400 } // 24 hours TTL
      );

      return value;
    } catch (error) {
      console.error(`Error tracking cardinality for ${dimension}:`, error);
      return value; // Allow on error
    }
  }

  /**
   * Handle 'bucket' action - bucket values into ranges
   */
  private handleBucket(dimension: string, value: string, bucketSize: number): string {
    // For numeric values, bucket into ranges
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const bucketIndex = Math.floor(numValue / bucketSize);
      const bucketStart = bucketIndex * bucketSize;
      const bucketEnd = bucketStart + bucketSize;
      return `${bucketStart}-${bucketEnd}`;
    }

    // For string values, use hash bucketing
    return this.hashBucket(value, bucketSize);
  }

  /**
   * Handle 'hash' action - hash the value
   */
  private handleHash(value: string): string {
    return this.simpleHash(value);
  }

  /**
   * Hash value into buckets
   */
  private hashBucket(value: string, bucketSize: number): string {
    const hash = this.simpleHashNumber(value);
    const bucket = hash % bucketSize;
    return `bucket_${bucket}`;
  }

  /**
   * Simple hash function for strings (returns hash string)
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Simple hash function for strings (returns number)
   */
  private simpleHashNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Apply governance to all dimensions in a label set
   */
  async applyGovernanceToLabels(labels: Record<string, string>): Promise<Record<string, string>> {
    const governed: Record<string, string> = {};

    for (const [key, value] of Object.entries(labels)) {
      const governedValue = await this.applyGovernance(key, value);
      if (governedValue !== null) {
        governed[key] = governedValue;
      }
    }

    return governed;
  }

  /**
   * Get current cardinality stats for a dimension
   */
  async getCardinalityStats(dimension: string): Promise<{ count: number; values: string[] }> {
    const key = `cardinality:${dimension}`;

    try {
      const existingJson = await this.env.CARDINALITY_KV.get(key);
      if (!existingJson) {
        return { count: 0, values: [] };
      }

      const values = JSON.parse(existingJson) as string[];
      return { count: values.length, values };
    } catch (error) {
      console.error(`Error getting cardinality stats for ${dimension}:`, error);
      return { count: 0, values: [] };
    }
  }

  /**
   * Reset cardinality tracking for a dimension
   */
  async resetCardinality(dimension: string): Promise<void> {
    const key = `cardinality:${dimension}`;
    await this.env.CARDINALITY_KV.delete(key);
  }
}
