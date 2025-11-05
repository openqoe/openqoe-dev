/**
 * Prometheus Integration Module
 */

import { BaseEvent, PrometheusTimeSeries } from './types';
import { Config } from './config';
import { CardinalityService } from './cardinality';
import { Env } from './types';

export class PrometheusService {
  private config: Config;
  private cardinalityService: CardinalityService;

  constructor(config: Config, cardinalityService: CardinalityService) {
    this.config = config;
    this.cardinalityService = cardinalityService;
  }

  /**
   * Transform events to Prometheus metrics
   */
  async transformEvents(events: BaseEvent[]): Promise<PrometheusTimeSeries[]> {
    const timeSeries: PrometheusTimeSeries[] = [];

    for (const event of events) {
      const metrics = await this.eventToMetrics(event);
      timeSeries.push(...metrics);
    }

    return timeSeries;
  }

  /**
   * Convert single event to Prometheus metrics
   */
  private async eventToMetrics(event: BaseEvent): Promise<PrometheusTimeSeries[]> {
    const metrics: PrometheusTimeSeries[] = [];
    const baseLabels = await this.extractBaseLabels(event);
    const timestamp = event.event_time;

    // Event counter
    metrics.push(await this.createMetric(
      'openqoe_events_total',
      baseLabels,
      1,
      timestamp
    ));

    // Event-specific metrics based on event_type
    switch (event.event_type) {
      case 'playerready':
        if (event.data?.player_startup_time) {
          metrics.push(await this.createMetric(
            'openqoe_player_startup_seconds',
            baseLabels,
            event.data.player_startup_time / 1000,
            timestamp
          ));
        }
        if (event.data?.page_load_time) {
          metrics.push(await this.createMetric(
            'openqoe_page_load_seconds',
            baseLabels,
            event.data.page_load_time / 1000,
            timestamp
          ));
        }
        break;

      case 'viewstart':
        metrics.push(await this.createMetric(
          'openqoe_views_started_total',
          baseLabels,
          1,
          timestamp
        ));
        break;

      case 'playing':
        if (event.data?.video_startup_time) {
          // Use histogram for accurate percentile calculations (P50, P95, P99)
          // Buckets: 0.5s, 1s, 2s, 3s, 5s, 10s, 15s, 30s
          const vstHistogram = await this.createHistogram(
            'openqoe_video_startup_seconds',
            baseLabels,
            event.data.video_startup_time / 1000,
            timestamp,
            [0.5, 1, 2, 3, 5, 10, 15, 30]
          );
          metrics.push(...vstHistogram);
        }
        if (event.data?.bitrate) {
          metrics.push(await this.createMetric(
            'openqoe_bitrate_bps',
            baseLabels,
            event.data.bitrate,
            timestamp
          ));
        }
        if (event.data?.resolution) {
          // Track resolution distribution (business metric)
          // Convert resolution to label: 360p, 480p, 720p, 1080p, 2160p (4K)
          const resolutionLabel = this.getResolutionLabel(event.data.resolution);
          metrics.push(await this.createMetric(
            'openqoe_resolution_total',
            {
              ...baseLabels,
              resolution: resolutionLabel
            },
            1,
            timestamp
          ));
        }
        break;

      case 'stall_start':
        metrics.push(await this.createMetric(
          'openqoe_rebuffer_events_total',
          baseLabels,
          1,
          timestamp
        ));
        if (event.data?.buffer_length) {
          metrics.push(await this.createMetric(
            'openqoe_buffer_length_seconds',
            baseLabels,
            event.data.buffer_length / 1000,
            timestamp
          ));
        }
        break;

      case 'stall_end':
        if (event.data?.stall_duration) {
          // Use histogram for rebuffer duration percentiles
          // Buckets: 0.5s, 1s, 2s, 3s, 5s, 10s, 30s
          const rebufferHistogram = await this.createHistogram(
            'openqoe_rebuffer_duration_seconds',
            baseLabels,
            event.data.stall_duration / 1000,
            timestamp,
            [0.5, 1, 2, 3, 5, 10, 30]
          );
          metrics.push(...rebufferHistogram);
        }
        break;

      case 'seek':
        metrics.push(await this.createMetric(
          'openqoe_seeks_total',
          baseLabels,
          1,
          timestamp
        ));
        if (event.data?.seek_latency) {
          // Use histogram for seek latency percentiles
          // Buckets: 0.1s, 0.25s, 0.5s, 1s, 2s, 5s (seeks should be fast)
          const seekHistogram = await this.createHistogram(
            'openqoe_seek_latency_seconds',
            baseLabels,
            event.data.seek_latency / 1000,
            timestamp,
            [0.1, 0.25, 0.5, 1, 2, 5]
          );
          metrics.push(...seekHistogram);
        }
        break;

      case 'ended':
        metrics.push(await this.createMetric(
          'openqoe_views_completed_total',
          baseLabels,
          1,
          timestamp
        ));
        if (event.data?.playing_time) {
          metrics.push(await this.createMetric(
            'openqoe_playing_time_seconds',
            baseLabels,
            event.data.playing_time / 1000,
            timestamp
          ));
        }
        if (event.data?.completion_rate !== undefined) {
          metrics.push(await this.createMetric(
            'openqoe_completion_rate',
            baseLabels,
            event.data.completion_rate,
            timestamp
          ));
        }
        if (event.data?.rebuffer_count !== undefined) {
          metrics.push(await this.createMetric(
            'openqoe_rebuffer_count',
            baseLabels,
            event.data.rebuffer_count,
            timestamp
          ));
        }
        break;

      case 'error':
        const errorLabels = {
          ...baseLabels,
          error_family: event.data?.error_family || 'unknown',
          error_code: event.data?.error_code || 'unknown'
        };
        metrics.push(await this.createMetric(
          'openqoe_errors_total',
          await this.cardinalityService.applyGovernanceToLabels(errorLabels),
          1,
          timestamp
        ));
        break;

      case 'heartbeat':
        if (event.data?.playing_time) {
          metrics.push(await this.createMetric(
            'openqoe_heartbeat_playing_time_seconds',
            baseLabels,
            event.data.playing_time / 1000,
            timestamp
          ));
        }
        if (event.data?.bitrate) {
          metrics.push(await this.createMetric(
            'openqoe_heartbeat_bitrate_bps',
            baseLabels,
            event.data.bitrate,
            timestamp
          ));
        }
        if (event.data?.dropped_frames !== undefined) {
          metrics.push(await this.createMetric(
            'openqoe_dropped_frames_total',
            baseLabels,
            event.data.dropped_frames,
            timestamp
          ));
        }
        break;

      case 'quartile':
        if (event.data?.quartile) {
          const quartileLabels = {
            ...baseLabels,
            quartile: String(event.data.quartile)
          };
          metrics.push(await this.createMetric(
            'openqoe_quartile_reached_total',
            await this.cardinalityService.applyGovernanceToLabels(quartileLabels),
            1,
            timestamp
          ));
        }
        break;

      case 'pause':
        metrics.push(await this.createMetric(
          'openqoe_pause_events_total',
          baseLabels,
          1,
          timestamp
        ));
        if (event.data?.playing_time) {
          metrics.push(await this.createMetric(
            'openqoe_pause_playing_time_seconds',
            baseLabels,
            event.data.playing_time / 1000,
            timestamp
          ));
        }
        break;

      case 'quality_change':
        const qualityLabels = {
          ...baseLabels,
          trigger: event.data?.trigger || 'unknown'
        };
        metrics.push(await this.createMetric(
          'openqoe_quality_changes_total',
          await this.cardinalityService.applyGovernanceToLabels(qualityLabels),
          1,
          timestamp
        ));
        if (event.data?.new_bitrate) {
          metrics.push(await this.createMetric(
            'openqoe_quality_change_bitrate_bps',
            baseLabels,
            event.data.new_bitrate,
            timestamp
          ));
        }
        if (event.data?.old_bitrate) {
          metrics.push(await this.createMetric(
            'openqoe_quality_change_old_bitrate_bps',
            baseLabels,
            event.data.old_bitrate,
            timestamp
          ));
        }
        if (event.data?.resolution) {
          // Track resolution after quality change
          const resolutionLabel = this.getResolutionLabel(event.data.resolution);
          metrics.push(await this.createMetric(
            'openqoe_resolution_total',
            {
              ...baseLabels,
              resolution: resolutionLabel
            },
            1,
            timestamp
          ));
        }
        break;
    }

    return metrics;
  }

  /**
   * Extract base labels from event
   */
  private async extractBaseLabels(event: BaseEvent): Promise<Record<string, string>> {
    const labels: Record<string, string> = {
      org_id: event.org_id,
      player_id: event.player_id,
      event_type: event.event_type
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
    if (event.network?.country_code) labels.network_country = event.network.country_code;

    // Video (apply cardinality governance)
    if (event.video?.id) labels.video_id = event.video.id;

    // Apply cardinality governance
    return await this.cardinalityService.applyGovernanceToLabels(labels);
  }

  /**
   * Create a Prometheus time series
   */
  private async createMetric(
    name: string,
    labels: Record<string, string>,
    value: number,
    timestamp: number
  ): Promise<PrometheusTimeSeries> {
    return {
      labels: [
        { name: '__name__', value: name },
        ...Object.entries(labels).map(([k, v]) => ({ name: k, value: v }))
      ],
      samples: [{
        value: value,
        timestamp: timestamp
      }]
    };
  }

  /**
   * Create histogram time series for percentile calculations
   * Generates _bucket, _sum, and _count metrics required by histogram_quantile()
   */
  private async createHistogram(
    name: string,
    labels: Record<string, string>,
    value: number,
    timestamp: number,
    buckets: number[]
  ): Promise<PrometheusTimeSeries[]> {
    const series: PrometheusTimeSeries[] = [];

    // Create bucket metrics (le = "less than or equal")
    for (const bucket of buckets) {
      const bucketLabels = [
        { name: '__name__', value: `${name}_bucket` },
        ...Object.entries(labels).map(([k, v]) => ({ name: k, value: v })),
        { name: 'le', value: bucket.toString() }
      ];

      series.push({
        labels: bucketLabels,
        samples: [{
          value: value <= bucket ? 1 : 0,
          timestamp: timestamp
        }]
      });
    }

    // Add +Inf bucket (required by Prometheus)
    const infLabels = [
      { name: '__name__', value: `${name}_bucket` },
      ...Object.entries(labels).map(([k, v]) => ({ name: k, value: v })),
      { name: 'le', value: '+Inf' }
    ];

    series.push({
      labels: infLabels,
      samples: [{
        value: 1,
        timestamp: timestamp
      }]
    });

    // Add _sum metric (total sum of all observations)
    const sumLabels = [
      { name: '__name__', value: `${name}_sum` },
      ...Object.entries(labels).map(([k, v]) => ({ name: k, value: v }))
    ];

    series.push({
      labels: sumLabels,
      samples: [{
        value: value,
        timestamp: timestamp
      }]
    });

    // Add _count metric (total number of observations)
    const countLabels = [
      { name: '__name__', value: `${name}_count` },
      ...Object.entries(labels).map(([k, v]) => ({ name: k, value: v }))
    ];

    series.push({
      labels: countLabels,
      samples: [{
        value: 1,
        timestamp: timestamp
      }]
    });

    return series;
  }

  /**
   * Send metrics to Prometheus remote write endpoint
   */
  async sendToPrometheus(timeSeries: PrometheusTimeSeries[]): Promise<void> {
    const prometheusConfig = this.config.getPrometheusConfig();

    if (!prometheusConfig.url) {
      console.warn('Prometheus URL not configured, skipping send');
      return;
    }

    // Encode as JSON - Mimir/Grafana Cloud supports JSON format via /api/v1/push endpoint
    // Note: This uses Mimir's JSON API, not the standard Prometheus remote write protocol
    const payload = this.encodeRemoteWriteRequest(timeSeries);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Prometheus-Remote-Write-Version': '0.1.0'
    };

    // Add authentication if configured
    if (prometheusConfig.username && prometheusConfig.password) {
      const auth = btoa(`${prometheusConfig.username}:${prometheusConfig.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    // Merge additional headers from config (e.g., X-Scope-OrgID for Grafana Cloud)
    if (prometheusConfig.headers) {
      Object.assign(headers, prometheusConfig.headers);
    }

    // Add 10 second timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(prometheusConfig.url, {
        method: 'POST',
        headers,
        body: payload,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prometheus remote write failed: ${response.status} ${errorText}`);
      }

      console.log(`Sent ${timeSeries.length} time series to Prometheus`);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Prometheus request timed out after 10 seconds');
      }
      throw error;
    }
  }

  /**
   * Encode remote write request as JSON
   *
   * Note: This uses Mimir's native JSON API (/api/v1/push) which accepts JSON payloads.
   * For standard Prometheus remote write, you would need Protobuf + Snappy compression.
   * Mimir and Grafana Cloud both support this JSON format for easier integration.
   */
  private encodeRemoteWriteRequest(timeSeries: PrometheusTimeSeries[]): string {
    return JSON.stringify({ timeseries: timeSeries });
  }

  /**
   * Convert resolution object to standard label
   * Maps resolution to common labels: 360p, 480p, 720p, 1080p, 2160p, 4320p
   */
  private getResolutionLabel(resolution: { width?: number; height?: number }): string {
    if (!resolution || !resolution.height) {
      return 'unknown';
    }

    const height = resolution.height;

    // Map to standard resolutions
    if (height >= 4320) return '8k';      // 7680x4320
    if (height >= 2160) return '4k';      // 3840x2160
    if (height >= 1440) return '1440p';   // 2560x1440
    if (height >= 1080) return '1080p';   // 1920x1080
    if (height >= 720) return '720p';     // 1280x720
    if (height >= 480) return '480p';     // 854x480
    if (height >= 360) return '360p';     // 640x360
    if (height >= 240) return '240p';     // 426x240

    return 'unknown';
  }
}
