/**
 * Destination Configuration Module
 * Supports both self-hosted and Grafana Cloud
 */

import { Env } from "../definitions/types";

export type DestinationType = "self-hosted" | "grafana-cloud";

export interface DestinationConfig {
  type: DestinationType;
  metrics: {
    url: string;
    username?: string;
    password?: string;
    headers?: Record<string, string>;
  };
  logs: {
    url: string;
    username?: string;
    password?: string;
    headers?: Record<string, string>;
  };
}

export class DestinationManager {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  /**
   * Get destination configuration based on environment
   */
  getDestinationConfig(): DestinationConfig {
    const destinationType = this.getDestinationType();

    if (destinationType === "grafana-cloud") {
      return this.getGrafanaCloudConfig();
    }

    return this.getSelfHostedConfig();
  }

  /**
   * Determine destination type from environment
   */
  private getDestinationType(): DestinationType {
    // Check if Grafana Cloud URLs are set
    if (
      this.env.GRAFANA_CLOUD_METRICS_URL ||
      this.env.GRAFANA_CLOUD_INSTANCE_ID
    ) {
      return "grafana-cloud";
    }

    return "self-hosted";
  }

  /**
   * Get Grafana Cloud configuration
   * Uses Grafana Cloud Metrics (Mimir) for metrics
   * Uses Grafana Cloud Logs (Loki) for logs
   *
   * IMPORTANT: URLs must be provided explicitly from your Grafana Cloud stack details.
   * Do not try to construct these URLs - copy them directly from Grafana Cloud portal.
   */
  private getGrafanaCloudConfig(): DestinationConfig {
    const instanceId = this.env.GRAFANA_CLOUD_INSTANCE_ID;
    const apiKey = this.env.GRAFANA_CLOUD_API_KEY;
    const metricsUrl = this.env.GRAFANA_CLOUD_METRICS_URL;
    const logsUrl = this.env.GRAFANA_CLOUD_LOGS_URL;

    // Validate required fields
    if (!instanceId || !apiKey) {
      throw new Error(
        "Grafana Cloud configuration incomplete: GRAFANA_CLOUD_INSTANCE_ID and GRAFANA_CLOUD_API_KEY are required",
      );
    }

    if (!metricsUrl || !logsUrl) {
      throw new Error(
        "Grafana Cloud URLs are required: Set GRAFANA_CLOUD_METRICS_URL and GRAFANA_CLOUD_LOGS_URL.\n" +
          "Get these from: Grafana Cloud Portal → Your Stack → Details\n" +
          '- Metrics URL: Copy from "Prometheus" section → "Remote Write Endpoint"\n' +
          '- Logs URL: Copy from "Loki" section → "URL"',
      );
    }

    return {
      type: "grafana-cloud",
      metrics: {
        url: metricsUrl,
        username: instanceId,
        password: apiKey,
        headers: {
          "X-Scope-OrgID": instanceId,
        },
      },
      logs: {
        url: logsUrl,
        username: instanceId,
        password: apiKey,
        headers: {
          "X-Scope-OrgID": instanceId,
        },
      },
    };
  }

  /**
   * Get self-hosted configuration
   * Uses Mimir (preferred) or Prometheus (backward compat) for metrics
   * Uses Loki for logs
   *
   * Note: Mimir is Prometheus-compatible and is the same backend used by Grafana Cloud
   */
  private getSelfHostedConfig(): DestinationConfig {
    // Prefer MIMIR_URL, fall back to PROMETHEUS_URL for backward compatibility
    const metricsUrl =
      this.env.MIMIR_URL ||
      this.env.PROMETHEUS_URL ||
      "http://mimir:9009/api/v1/push";

    // Prefer MIMIR credentials, fall back to PROMETHEUS credentials
    const metricsUsername =
      this.env.MIMIR_USERNAME || this.env.PROMETHEUS_USERNAME;
    const metricsPassword =
      this.env.MIMIR_PASSWORD || this.env.PROMETHEUS_PASSWORD;

    return {
      type: "self-hosted",
      metrics: {
        url: metricsUrl,
        username: metricsUsername,
        password: metricsPassword,
      },
      logs: {
        url: this.env.LOKI_URL || "http://loki:3100/loki/api/v1/push",
        username: this.env.LOKI_USERNAME,
        password: this.env.LOKI_PASSWORD,
      },
    };
  }

  /**
   * Validate destination configuration
   */
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.getDestinationConfig();

    if (!config.metrics.url) {
      errors.push("Metrics URL is not configured");
    }

    if (!config.logs.url) {
      errors.push("Logs URL is not configured");
    }

    if (config.type === "grafana-cloud") {
      if (!this.env.GRAFANA_CLOUD_INSTANCE_ID) {
        errors.push("Grafana Cloud Instance ID is required");
      }
      if (!this.env.GRAFANA_CLOUD_API_KEY) {
        errors.push("Grafana Cloud API Key is required");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
