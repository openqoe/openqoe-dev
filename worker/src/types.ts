/**
 * Worker Types & Interfaces
 */

// Environment bindings
export interface Env {
  // KV Namespace for cardinality tracking
  CARDINALITY_KV: KVNamespace;

  // Self-Hosted Destinations (Mimir + Loki)
  // Mimir is Prometheus-compatible - same backend as Grafana Cloud Metrics
  MIMIR_URL?: string;                    // Preferred: Mimir endpoint
  PROMETHEUS_URL?: string;               // Backward compat: Falls back to Prometheus
  MIMIR_USERNAME?: string;
  MIMIR_PASSWORD?: string;
  PROMETHEUS_USERNAME?: string;          // Backward compat
  PROMETHEUS_PASSWORD?: string;          // Backward compat
  LOKI_URL?: string;
  LOKI_USERNAME?: string;
  LOKI_PASSWORD?: string;

  // Grafana Cloud Destinations (Mimir + Loki)
  GRAFANA_CLOUD_INSTANCE_ID?: string;    // Your Grafana Cloud instance ID (e.g., "123456")
  GRAFANA_CLOUD_API_KEY?: string;        // Grafana Cloud API key
  GRAFANA_CLOUD_REGION?: string;         // Region (e.g., "us-central1", "eu-west1")
  GRAFANA_CLOUD_METRICS_URL?: string;    // Override Mimir URL (optional)
  GRAFANA_CLOUD_LOGS_URL?: string;       // Override Loki URL (optional)

  // Authentication
  API_KEY?: string;

  // Config
  CARDINALITY_LIMITS?: string; // JSON string
}

// Request body
export interface IngestRequest {
  events: BaseEvent[];
}

// Base event (from SDK)
export interface BaseEvent {
  // Event metadata
  event_type: string;
  event_time: number;
  viewer_time: number;
  playback_time?: number;

  // Session identifiers
  org_id: string;
  player_id: string;
  view_id: string;
  session_id: string;
  viewer_id: string;

  // Environment
  env?: string;
  app_name?: string;
  app_version?: string;

  // Context
  device?: DeviceInfo;
  os?: OSInfo;
  browser?: BrowserInfo;
  player?: PlayerInfo;
  network?: NetworkInfo;
  cdn?: CDNInfo;
  video?: VideoInfo;
  cmcd?: CMCDData;

  // Event-specific data
  data?: Record<string, any>;
}

export interface DeviceInfo {
  name?: string;
  model?: string;
  category?: string;
  manufacturer?: string;
}

export interface OSInfo {
  family?: string;
  version?: string;
}

export interface BrowserInfo {
  family?: string;
  version?: string;
}

export interface PlayerInfo {
  name: string;
  version?: string;
  autoplay?: boolean;
  preload?: string;
}

export interface NetworkInfo {
  asn?: number;
  country_code?: string;
  region?: string;
  city?: string;
}

export interface CDNInfo {
  provider?: string;
  edge_pop?: string;
  origin?: string;
}

export interface VideoInfo {
  id?: string;
  title?: string;
  series?: string;
  duration?: number;
  source_url?: string;
}

export interface CMCDData {
  br?: number;
  bl?: number;
  bs?: boolean;
  cid?: string;
  d?: number;
  dl?: number;
  mtp?: number;
  ot?: string;
  pr?: number;
  sf?: string;
  sid?: string;
  st?: string;
  su?: boolean;
  tb?: number;
}

// Prometheus types
export interface PrometheusMetric {
  metric: string;
  labels: Record<string, string>;
  value: number;
  timestamp: number;
}

export interface PrometheusSample {
  labels: Record<string, string>;
  samples: Array<{
    value: number;
    timestamp: number;
  }>;
}

export interface PrometheusTimeSeries {
  labels: Array<{
    name: string;
    value: string;
  }>;
  samples: Array<{
    value: number;
    timestamp: number;
  }>;
}

export interface PrometheusRemoteWriteRequest {
  timeseries: PrometheusTimeSeries[];
}

// Loki types
export interface LokiStream {
  stream: Record<string, string>;
  values: Array<[string, string]>; // [timestamp_ns, log_line]
}

export interface LokiPushRequest {
  streams: LokiStream[];
}

// Cardinality governance
export interface CardinalityConfig {
  limits: Record<string, CardinalityLimit>;
}

export interface CardinalityLimit {
  max_cardinality: number;
  action: 'allow' | 'bucket' | 'hash' | 'drop';
  bucket_size?: number; // for 'bucket' action
}

// Response types
export interface IngestResponse {
  success: boolean;
  message?: string;
  events_received?: number;
  events_processed?: number;
  errors?: string[];
}
