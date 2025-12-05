/**
 * Loki Integration Module
 */

import { BaseEvent, LokiStream, LokiPushRequest } from "../definitions/types";
import { Config } from "../config/config";
import { CardinalityService } from "../validations/cardinality";

export class LokiService {
  private config: Config;
  private cardinalityService: CardinalityService;

  constructor(config: Config, cardinalityService: CardinalityService) {
    this.config = config;
    this.cardinalityService = cardinalityService;
  }

  /**
   * Transform events to Loki streams
   */
  async transformEvents(events: BaseEvent[]): Promise<LokiStream[]> {
    // Group events by label set
    const streamMap = new Map<string, LokiStream>();

    for (const event of events) {
      const labels = await this.extractLabels(event);
      const labelKey = this.labelsToKey(labels);

      let stream = streamMap.get(labelKey);
      if (!stream) {
        stream = {
          stream: labels,
          values: [],
        };
        streamMap.set(labelKey, stream);
      }

      // Add log entry
      const logLine = this.eventToLogLine(event);
      const timestampNs = (event.event_time * 1000000).toString(); // Convert ms to ns
      stream.values.push([timestampNs, logLine]);
    }

    return Array.from(streamMap.values());
  }

  /**
   * Extract labels from event
   */
  private async extractLabels(
    event: BaseEvent,
  ): Promise<Record<string, string>> {
    const labels: Record<string, string> = {
      org_id: event.org_id,
      player_id: event.player_id,
      event_type: event.event_type,
    };

    // Add optional labels
    if (event.env) labels.env = event.env;
    if (event.app_name) labels.app_name = event.app_name;
    if (event.app_version) labels.app_version = event.app_version;

    // Device/OS/Browser
    if (event.device?.category) labels.device_category = event.device.category;
    if (event.os?.family) labels.os_family = event.os.family;
    if (event.browser?.family) labels.browser_family = event.browser.family;

    // Player
    if (event.player?.name) labels.player_name = event.player.name;

    // Network
    if (event.network?.country_code)
      labels.network_country = event.network.country_code;

    // Apply cardinality governance
    return await this.cardinalityService.applyGovernanceToLabels(labels);
  }

  /**
   * Convert event to log line (JSON)
   */
  private eventToLogLine(event: BaseEvent): string {
    // Create log entry with all event data
    const logEntry = {
      event_type: event.event_type,
      event_time: event.event_time,
      viewer_time: event.viewer_time,
      playback_time: event.playback_time,

      // IDs (included in log line for searchability)
      view_id: event.view_id,
      session_id: event.session_id,
      viewer_id: event.viewer_id,

      // Context
      device: event.device,
      os: event.os,
      browser: event.browser,
      player: event.player,
      network: event.network,
      video: event.video,
      cmcd: event.cmcd,

      // Event data
      data: event.data,
    };

    // Remove undefined fields
    const cleaned = this.removeUndefined(logEntry);

    return JSON.stringify(cleaned);
  }

  /**
   * Remove undefined fields from object
   */
  private removeUndefined(obj: any): any {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeUndefined(item));
    }

    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = this.removeUndefined(value);
      }
    }
    return cleaned;
  }

  /**
   * Convert labels to unique key for grouping
   */
  private labelsToKey(labels: Record<string, string>): string {
    const sorted = Object.keys(labels).sort();
    return sorted.map((k) => `${k}="${labels[k]}"`).join(",");
  }

  /**
   * Send streams to Loki
   */
  async sendToLoki(streams: LokiStream[]): Promise<void> {
    const lokiConfig = this.config.getLokiConfig();

    if (!lokiConfig.url) {
      console.warn("Loki URL not configured, skipping send");
      return;
    }

    const pushRequest: LokiPushRequest = {
      streams: streams,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authentication if configured
    if (lokiConfig.username && lokiConfig.password) {
      const auth = btoa(`${lokiConfig.username}:${lokiConfig.password}`);
      headers["Authorization"] = `Basic ${auth}`;
    }

    // Merge additional headers from config (e.g., X-Scope-OrgID for Grafana Cloud)
    if (lokiConfig.headers) {
      Object.assign(headers, lokiConfig.headers);
    }

    // Add 10 second timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(lokiConfig.url, {
        method: "POST",
        headers,
        body: JSON.stringify(pushRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Loki push failed: ${response.status} ${errorText}`);
      }

      const totalEntries = streams.reduce(
        (sum, stream) => sum + stream.values.length,
        0,
      );
      console.log(
        `Sent ${totalEntries} log entries in ${streams.length} streams to Loki`,
      );
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Loki request timed out after 10 seconds");
      }
      throw error;
    }
  }

  /**
   * Query Loki (for testing/debugging)
   */
  async query(query: string, limit: number = 100): Promise<any> {
    const lokiConfig = this.config.getLokiConfig();

    if (!lokiConfig.url) {
      throw new Error("Loki URL not configured");
    }

    // Build query URL
    const queryUrl = new URL(
      lokiConfig.url.replace("/loki/api/v1/push", "/loki/api/v1/query_range"),
    );
    queryUrl.searchParams.set("query", query);
    queryUrl.searchParams.set("limit", String(limit));

    const now = Date.now();
    queryUrl.searchParams.set("start", String((now - 3600000) * 1000000)); // 1 hour ago in ns
    queryUrl.searchParams.set("end", String(now * 1000000)); // now in ns

    const headers: Record<string, string> = {};

    // Add authentication if configured
    if (lokiConfig.username && lokiConfig.password) {
      const auth = btoa(`${lokiConfig.username}:${lokiConfig.password}`);
      headers["Authorization"] = `Basic ${auth}`;
    }

    const response = await fetch(queryUrl.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Loki query failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  }
}
