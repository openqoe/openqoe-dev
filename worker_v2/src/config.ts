/**
 * Configuration Module
 */

import { Env, CardinalityConfig, CardinalityLimit } from './types';
import { DestinationManager } from './destinations';

export class Config {
  private env: Env;
  private cardinalityConfig: CardinalityConfig;
  private destinationManager: DestinationManager;

  constructor(env: Env) {
    this.env = env;
    this.cardinalityConfig = this.loadCardinalityConfig();
    this.destinationManager = new DestinationManager(env);

    // Validate configuration on startup to fail fast
    this.validateConfiguration();
  }

  /**
   * Load cardinality configuration
   */
  private loadCardinalityConfig(): CardinalityConfig {
    if (!this.env.CARDINALITY_LIMITS) {
      // Default config
      return {
        limits: {
          // Allow low-cardinality dimensions
          'org_id': { max_cardinality: 1000, action: 'allow' },
          'player_id': { max_cardinality: 10000, action: 'allow' },
          'env': { max_cardinality: 10, action: 'allow' },
          'app_name': { max_cardinality: 100, action: 'allow' },
          'event_type': { max_cardinality: 20, action: 'allow' },

          // Bucket medium-cardinality dimensions
          'video_id': { max_cardinality: 100000, action: 'bucket', bucket_size: 10000 },
          'video_title': { max_cardinality: 100000, action: 'bucket', bucket_size: 10000 },

          // Hash high-cardinality dimensions
          'session_id': { max_cardinality: Infinity, action: 'hash' },
          'view_id': { max_cardinality: Infinity, action: 'hash' },
          'viewer_id': { max_cardinality: Infinity, action: 'hash' },

          // Device/Browser - allow common values, hash others
          'device_category': { max_cardinality: 10, action: 'allow' },
          'browser_family': { max_cardinality: 20, action: 'allow' },
          'os_family': { max_cardinality: 20, action: 'allow' },

          // Network - bucket by country/region
          'network_country': { max_cardinality: 250, action: 'allow' },
          'network_region': { max_cardinality: 1000, action: 'bucket', bucket_size: 100 },

          // Drop very high cardinality
          'video_source_url': { max_cardinality: 0, action: 'drop' }
        }
      };
    }

    try {
      return JSON.parse(this.env.CARDINALITY_LIMITS);
    } catch (e) {
      console.error('Failed to parse CARDINALITY_LIMITS, using defaults', e);
      return this.loadCardinalityConfig();
    }
  }

  /**
   * Get cardinality limit for a dimension
   */
  getCardinalityLimit(dimension: string): CardinalityLimit | undefined {
    return this.cardinalityConfig.limits[dimension];
  }

  /**
   * Get all cardinality limits
   */
  getAllCardinalityLimits(): Record<string, CardinalityLimit> {
    return this.cardinalityConfig.limits;
  }

  /**
   * Get Prometheus/Mimir configuration
   * Now uses DestinationManager for proper multi-destination support
   */
  getPrometheusConfig() {
    const destConfig = this.destinationManager.getDestinationConfig();
    return destConfig.metrics;
  }

  /**
   * Get Loki configuration
   * Now uses DestinationManager for proper multi-destination support
   */
  getLokiConfig() {
    const destConfig = this.destinationManager.getDestinationConfig();
    return destConfig.logs;
  }

  /**
   * Get API key
   */
  getApiKey(): string | undefined {
    return this.env.API_KEY;
  }

  /**
   * Check if authentication is enabled
   */
  isAuthEnabled(): boolean {
    return !!this.env.API_KEY;
  }

  /**
   * Validate configuration on startup
   * Throws errors if required environment variables are missing or invalid
   */
  private validateConfiguration(): void {
    const errors: string[] = [];

    // Validate KV namespace binding
    if (!this.env.CARDINALITY_KV) {
      errors.push('CARDINALITY_KV namespace is not bound. Add it to wrangler.toml [[kv_namespaces]] section.');
    }

    // Validate destination configuration using DestinationManager
    const destValidation = this.destinationManager.validateConfig();
    if (!destValidation.valid) {
      errors.push(...destValidation.errors);
    }

    // If there are validation errors, throw with all details
    if (errors.length > 0) {
      throw new Error(
        'Configuration validation failed:\n' +
        errors.map(e => `  - ${e}`).join('\n') +
        '\n\nPlease check your environment variables and wrangler.toml configuration.'
      );
    }

    console.log('Configuration validated successfully');
  }
}
