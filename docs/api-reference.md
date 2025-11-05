# openqoe-core API Reference

**Version:** 1.0
**Last Updated:** 2025-11-04

---

## Table of Contents

1. [SDK API](#sdk-api)
2. [Ingest API](#ingest-api)
3. [Query API Patterns](#query-api-patterns)
4. [Metrics Query Examples](#metrics-query-examples)
5. [Logs Query Examples](#logs-query-examples)
6. [Filter Syntax Reference](#filter-syntax-reference)
7. [Error Codes](#error-codes)

---

## SDK API

### Initialization

#### `new OpenQoE(config)`

Creates a new OpenQoE SDK instance.

**Parameters:**

```typescript
interface OpenQoEConfig {
  // Required
  orgId: string;                    // Organization identifier
  playerId: string;                 // Player instance identifier
  endpointUrl: string;              // Ingest endpoint URL

  // Optional
  env?: 'dev' | 'staging' | 'prod'; // Environment (default: 'prod')
  appName?: string;                 // Application name
  appVersion?: string;              // Application version
  samplingRate?: number;            // 0.0 - 1.0 (default: 1.0)

  // Privacy
  enablePII?: boolean;              // Enable PII collection (default: false)
  hashSalt?: string;                // Per-org salt for hashing

  // Performance
  batchSize?: number;               // Events per batch (default: 10)
  batchInterval?: number;           // Batch flush interval ms (default: 5000)
  maxQueueSize?: number;            // Max offline queue (default: 100)

  // Debugging
  debug?: boolean;                  // Enable console logging (default: false)
  logLevel?: 'error' | 'warn' | 'info' | 'debug'; // (default: 'warn')
}
```

**Returns:** `OpenQoE` instance

**Example:**

```typescript
import { OpenQoE } from '@openqoe/core';

const qoe = new OpenQoE({
  orgId: 'org_abc123',
  playerId: 'player_xyz789',
  endpointUrl: 'https://ingest.openqoe.example.com/v1/events',
  env: 'prod',
  appName: 'MyVideoApp',
  appVersion: '2.1.0',
  samplingRate: 1.0,
  batchSize: 10,
  batchInterval: 5000
});
```

---

### Player Integration

#### `attachPlayer(playerType, playerInstance, metadata?)`

Attaches the SDK to a video player instance.

**Parameters:**

```typescript
type PlayerType = 'html5' | 'videojs' | 'hlsjs' | 'dashjs' | 'shaka';

interface VideoMetadata {
  videoId?: string;
  videoTitle?: string;
  videoSeries?: string;
  duration?: number;           // ms
  customDimensions?: Record<string, string>;
}
```

**Returns:** `void`

**Example:**

```typescript
// HTML5
const video = document.querySelector('video');
qoe.attachPlayer('html5', video, {
  videoId: 'video_123',
  videoTitle: 'Sample Video',
  videoSeries: 'Season 1'
});

// Video.js
const player = videojs('my-video');
qoe.attachPlayer('videojs', player, {
  videoId: 'video_123'
});

// HLS.js
const hls = new Hls();
hls.attachMedia(video);
qoe.attachPlayer('hlsjs', hls, {
  videoId: 'video_123'
});

// dash.js
const player = dashjs.MediaPlayer().create();
player.initialize(video, url, true);
qoe.attachPlayer('dashjs', player, {
  videoId: 'video_123'
});

// Shaka Player
const player = new shaka.Player(video);
qoe.attachPlayer('shaka', player, {
  videoId: 'video_123'
});
```

---

### Manual Event Tracking

#### `trackEvent(eventType, data)`

Manually track a custom event.

**Parameters:**

```typescript
type EventType =
  | 'playerready'
  | 'viewstart'
  | 'playing'
  | 'pause'
  | 'seek'
  | 'stall_start'
  | 'stall_end'
  | 'quality_change'
  | 'ended'
  | 'error'
  | 'quartile'
  | 'heartbeat'
  | string;  // Custom event types allowed

data: Record<string, any>;
```

**Returns:** `void`

**Example:**

```typescript
// Track custom business event
qoe.trackEvent('subscription_upsell_shown', {
  plan: 'premium',
  price: 9.99,
  position: 'mid_roll'
});

// Track custom error
qoe.trackEvent('error', {
  error_family: 'business',
  error_code: 'SUBSCRIPTION_EXPIRED',
  error_message: 'User subscription expired'
});
```

---

### Session Management

#### `startSession()`

Manually start a new session (usually automatic).

**Returns:** `string` - Session ID

**Example:**

```typescript
const sessionId = qoe.startSession();
console.log('Session started:', sessionId);
```

#### `endSession()`

Manually end the current session.

**Returns:** `void`

**Example:**

```typescript
qoe.endSession();
```

---

### Lifecycle

#### `destroy()`

Cleanup and destroy the SDK instance.

**Returns:** `void`

**Example:**

```typescript
// When navigating away or unmounting component
qoe.destroy();
```

---

### Getters

#### `getSessionId()`

Get the current session ID.

**Returns:** `string | null`

#### `getViewId()`

Get the current view ID.

**Returns:** `string | null`

#### `getConfig()`

Get the current configuration.

**Returns:** `OpenQoEConfig`

---

## Ingest API

### POST /v1/events

Submit events to the ingest endpoint.

**Endpoint:** `https://ingest.openqoe.example.com/v1/events`

**Method:** `POST`

**Headers:**

```http
Content-Type: application/json
X-API-Token: <your-api-token>
X-SDK-Version: 1.0.0
```

**Request Body:**

```json
{
  "events": [
    {
      "event_type": "viewstart",
      "event_time": 1699564800000,
      "viewer_time": 1699564800000,
      "playback_time": 0,

      "org_id": "org_abc123",
      "player_id": "player_xyz789",
      "view_id": "550e8400-e29b-41d4-a716-446655440000",
      "session_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "viewer_id": "hashed_viewer_123",

      "env": "prod",
      "app_name": "MyVideoApp",
      "app_version": "2.1.0",

      "device": {
        "name": "MacBook Pro",
        "category": "desktop"
      },
      "os": {
        "family": "macOS",
        "version": "14.1"
      },
      "browser": {
        "family": "Chrome",
        "version": "120.0.0"
      },

      "video": {
        "id": "video_123",
        "title": "Sample Video",
        "duration": 120000
      },

      "data": {
        "video_startup_time": 450
      }
    }
  ]
}
```

**Response:**

**Success (200 OK):**

```json
{
  "status": "ok",
  "accepted": 10,
  "rejected": 0
}
```

**Partial Success (207 Multi-Status):**

```json
{
  "status": "partial",
  "accepted": 8,
  "rejected": 2,
  "errors": [
    {
      "index": 3,
      "error": "Invalid schema: missing required field 'org_id'"
    },
    {
      "index": 7,
      "error": "Quota exceeded for org_id 'org_abc123'"
    }
  ]
}
```

**Error (400 Bad Request):**

```json
{
  "status": "error",
  "error": "Invalid JSON",
  "message": "Request body is not valid JSON"
}
```

**Error (401 Unauthorized):**

```json
{
  "status": "error",
  "error": "Unauthorized",
  "message": "Invalid or missing API token"
}
```

**Error (429 Too Many Requests):**

```json
{
  "status": "error",
  "error": "Rate limit exceeded",
  "message": "Rate limit exceeded for org_id 'org_abc123'",
  "retry_after": 60
}
```

---

### GET /v1/health

Health check endpoint.

**Endpoint:** `https://ingest.openqoe.example.com/v1/health`

**Method:** `GET`

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400,
  "dependencies": {
    "loki": "healthy",
    "prometheus": "healthy"
  }
}
```

---

### GET /v1/metrics

Worker operational metrics (Prometheus format).

**Endpoint:** `https://ingest.openqoe.example.com/v1/metrics`

**Method:** `GET`

**Response:**

```prometheus
# HELP openqoe_events_received_total Total events received
# TYPE openqoe_events_received_total counter
openqoe_events_received_total{org_id="org_abc123"} 123456

# HELP openqoe_events_accepted_total Total events accepted
# TYPE openqoe_events_accepted_total counter
openqoe_events_accepted_total{org_id="org_abc123"} 123400

# HELP openqoe_events_rejected_total Total events rejected
# TYPE openqoe_events_rejected_total counter
openqoe_events_rejected_total{org_id="org_abc123",reason="schema_validation"} 30
openqoe_events_rejected_total{org_id="org_abc123",reason="cardinality_exceeded"} 20
openqoe_events_rejected_total{org_id="org_abc123",reason="quota_exceeded"} 6

# HELP openqoe_ingest_latency_seconds Ingest latency histogram
# TYPE openqoe_ingest_latency_seconds histogram
openqoe_ingest_latency_seconds_bucket{le="0.01"} 100000
openqoe_ingest_latency_seconds_bucket{le="0.05"} 120000
openqoe_ingest_latency_seconds_bucket{le="0.1"} 123000
openqoe_ingest_latency_seconds_bucket{le="0.5"} 123400
openqoe_ingest_latency_seconds_bucket{le="+Inf"} 123456
```

---

## Query API Patterns

These patterns apply to querying Grafana/Prometheus/Loki for metrics and logs.

### Metrics Query Pattern (PromQL)

#### Overall Metric Value

```promql
# Average rebuffer percentage (last 1 hour)
avg_over_time(
  openqoe_rebuffer_percentage{
    org_id="org_abc123",
    player_id="player_xyz789"
  }[1h]
)
```

#### Breakdown by Dimension

```promql
# Rebuffer percentage by country
avg by (country) (
  openqoe_rebuffer_percentage{
    org_id="org_abc123"
  }
)
```

#### Time Series

```promql
# Startup time p95 over time (5-minute windows)
histogram_quantile(0.95,
  rate(openqoe_startup_time_bucket{
    org_id="org_abc123"
  }[5m])
)
```

#### Filtering

```promql
# Rebuffer percentage for US viewers on mobile
avg(
  openqoe_rebuffer_percentage{
    org_id="org_abc123",
    country="US",
    device_category="mobile"
  }
)
```

#### Negative Impact

```promql
# Negative impact score by CDN
(
  avg by (cdn) (openqoe_rebuffer_percentage{org_id="org_abc123"})
  -
  avg(openqoe_rebuffer_percentage{org_id="org_abc123"})
) *
count by (cdn) (openqoe_views{org_id="org_abc123"})
```

---

### Logs Query Pattern (LogQL)

#### Filter Events by Type

```logql
{org_id="org_abc123", event_type="error"}
```

#### Filter with JSON Parsing

```logql
{org_id="org_abc123", event_type="error"}
| json
| error_family="network"
```

#### Count Events

```logql
count_over_time({org_id="org_abc123", event_type="stall_start"}[1h])
```

#### Extract Metrics from Logs

```logql
# Average startup time from viewstart events
avg_over_time(
  {org_id="org_abc123", event_type="viewstart"}
  | json
  | unwrap data_video_startup_time [1h]
)
```

#### View Individual Events

```logql
# Get last 100 error events
{org_id="org_abc123", event_type="error"}
| json
| line_format "{{.event_time}} | {{.data_error_code}} | {{.data_error_message}}"
```

---

## Metrics Query Examples

### Startup Metrics

#### Aggregate Startup Time (P95)

```promql
histogram_quantile(0.95,
  rate(openqoe_aggregate_startup_time_bucket{
    org_id="org_abc123"
  }[5m])
)
```

#### Startup Failure Percentage

```promql
avg(
  openqoe_video_startup_failure_percentage{
    org_id="org_abc123"
  }
)
```

#### Startup Time by Player

```promql
histogram_quantile(0.95,
  rate(openqoe_video_startup_time_bucket{
    org_id="org_abc123"
  }[5m])
) by (player_name)
```

---

### Smoothness Metrics

#### Rebuffer Percentage

```promql
avg(
  openqoe_rebuffer_percentage{
    org_id="org_abc123"
  }
)
```

#### Rebuffer Frequency (per minute of playtime)

```promql
avg(
  openqoe_rebuffer_frequency{
    org_id="org_abc123"
  }
)
```

#### Rebuffer Duration (P95)

```promql
histogram_quantile(0.95,
  rate(openqoe_rebuffer_duration_bucket{
    org_id="org_abc123"
  }[5m])
)
```

---

### Quality Metrics

#### Weighted Average Bitrate

```promql
histogram_quantile(0.5,
  rate(openqoe_weighted_average_bitrate_bucket{
    org_id="org_abc123"
  }[5m])
)
```

#### Downscale Percentage by CDN

```promql
avg by (cdn) (
  openqoe_downscale_percentage{
    org_id="org_abc123"
  }
)
```

---

### Engagement Metrics

#### Total Views

```promql
sum(
  increase(openqoe_views_total{
    org_id="org_abc123"
  }[1h])
)
```

#### Total Playing Time

```promql
sum(
  openqoe_playing_time_seconds{
    org_id="org_abc123"
  }
)
```

#### Unique Viewers

```promql
count(
  count by (viewer_id) (
    openqoe_views_total{
      org_id="org_abc123"
    }
  )
)
```

---

### Failure Metrics

#### Playback Failure Percentage

```promql
avg(
  openqoe_playback_failure_percentage{
    org_id="org_abc123"
  }
)
```

#### Exit Before Start Percentage

```promql
avg(
  openqoe_exits_before_video_start_percentage{
    org_id="org_abc123"
  }
)
```

---

### Experience Scores

#### Viewer Experience Score

```promql
avg(
  openqoe_viewer_experience_score{
    org_id="org_abc123"
  }
)
```

#### Viewer Experience Score by Country (Top 10)

```promql
topk(10,
  avg by (country) (
    openqoe_viewer_experience_score{
      org_id="org_abc123"
    }
  )
)
```

---

### Negative Impact Queries

#### Negative Impact by CDN

```promql
# Calculate delta from global average, weighted by view count
(
  avg by (cdn) (
    openqoe_viewer_experience_score{org_id="org_abc123"}
  )
  -
  avg(
    openqoe_viewer_experience_score{org_id="org_abc123"}
  )
) * -1 *
sum by (cdn) (
  openqoe_views_total{org_id="org_abc123"}
)
```

#### Top 10 Negative Impact Dimensions (Composite)

```promql
# This is conceptual - actual implementation requires multiple queries
sort_desc(
  label_join(
    # Calculate for each dimension: ASN, CDN, country, etc.
    # Then union and sort
  )
)
```

---

## Logs Query Examples

### Event Filtering

#### All Errors in Last Hour

```logql
{org_id="org_abc123", event_type="error"}
| json
| __timestamp__ >= now() - 1h
```

#### Errors by Error Family

```logql
{org_id="org_abc123", event_type="error"}
| json
| data_error_family =~ "network|decoder"
```

#### Stalls for Specific Video

```logql
{org_id="org_abc123", event_type="stall_start"}
| json
| video_id = "video_123"
```

---

### Event Analytics

#### Count Stalls per View

```logql
sum by (view_id) (
  count_over_time(
    {org_id="org_abc123", event_type="stall_start"}[1h]
  )
)
```

#### Average Stall Duration

```logql
avg_over_time(
  {org_id="org_abc123", event_type="stall_end"}
  | json
  | unwrap data_stall_duration [1h]
)
```

#### Error Rate by Player

```logql
sum by (player_name) (
  rate(
    {org_id="org_abc123", event_type="error"}[5m]
  )
)
```

---

### Trace Queries

#### Full Session Timeline

```logql
{org_id="org_abc123", view_id="550e8400-e29b-41d4-a716-446655440000"}
| json
| line_format "{{.event_time}} | {{.event_type}} | {{.playback_time}}ms | {{.data}}"
```

#### Error Context with Preceding Events

```logql
# Get error event
{org_id="org_abc123", view_id="<view_id>", event_type="error"}
| json

# Then manually query for events before error timestamp
{org_id="org_abc123", view_id="<view_id>"}
| json
| event_time < <error_timestamp>
| event_time > <error_timestamp - 30000>  # 30s before error
```

---

## Filter Syntax Reference

### Basic Filters

#### Include

Match dimension equals value:

```
dimension:value
```

**Examples:**

```promql
# PromQL
{country="US"}

# LogQL
{org_id="org_abc123", country="US"}
```

**Query String (API):**

```
?filters[]=country:US
```

#### Exclude

Match dimension NOT equals value:

```
!dimension:value
```

**Examples:**

```promql
# PromQL
{country!="US"}

# LogQL
{country!="US"}
```

**Query String (API):**

```
?filters[]=!country:US
```

---

### Trace Filters

For array-valued dimensions (like `video_cdn_trace`).

#### Contains

Array contains value:

```
+dimension:value
```

**Example:**

```
+video_cdn_trace:cloudflare
```

**LogQL:**

```logql
{org_id="org_abc123"}
| json
| video_cdn_trace =~ ".*cloudflare.*"
```

#### Not Contains

Array does NOT contain value:

```
-dimension:value
```

**Example:**

```
-video_cdn_trace:fastly
```

#### Exact Match

Array exactly matches list:

```
dimension:[value1,value2,value3]
```

**Example:**

```
video_cdn_trace:[cloudflare,akamai]
```

---

### Metric Filters

Apply inequality conditions to metric values.

**Operators:** `>=`, `<=`, `>`, `<`, `=`

**Examples:**

```
aggregate_startup_time>=1000
rebuffer_percentage>=0.01
views>=100
```

**Query String (API):**

```
?metric_filters[]=aggregate_startup_time>=1000
?metric_filters[]=rebuffer_percentage>=0.01
```

**PromQL Equivalent:**

```promql
openqoe_aggregate_startup_time{org_id="org_abc123"} >= 1000
```

---

### Timeframes

#### Monitoring (Real-time)

**Format:** Last N seconds/minutes (bounded to 10 minutes max, within last 24h)

**Examples:**

```
timeframe=60s         # Last 60 seconds
timeframe=5m          # Last 5 minutes
timeframe=10m         # Last 10 minutes (max)
```

**Query String (API):**

```
?timeframe=5m
```

**PromQL:**

```promql
openqoe_metric{org_id="org_abc123"}[5m]
```

#### Historical

**Format:** Duration string or epoch timestamps

**Duration Examples:**

```
7:days
24:hours
30:days
```

**Query String (API):**

```
?timeframe[]=7:days
```

**Epoch Examples:**

```
[1699564800, 1699651200]
```

**Query String (API):**

```
?timeframe[]=1699564800&timeframe[]=1699651200
```

**PromQL:**

```promql
openqoe_metric{org_id="org_abc123"}[7d]
```

---

### Ordering

#### Order By

**Options:**
- `negative_impact` - Worst-performing first (delta from average * view count)
- `views` - By view count
- `value` - By metric value
- `field` - By dimension value (alphabetical)

**Query String (API):**

```
?order_by=negative_impact
?order_by=views
?order_by=value
```

#### Order Direction

**Options:**
- `asc` - Ascending
- `desc` - Descending (default)

**Query String (API):**

```
?order_by=negative_impact&order_direction=desc
```

---

### Limits & Pagination

#### Limit (Top-N)

```
?limit=100
```

**Default:** 25

**PromQL:**

```promql
topk(100, openqoe_metric{org_id="org_abc123"})
```

#### Pagination

```
?page=1&limit=25
?page=2&limit=25
```

---

## Error Codes

### SDK Error Codes

| Code | Error | Description |
|------|-------|-------------|
| `SDK_001` | `INVALID_CONFIG` | Invalid SDK configuration |
| `SDK_002` | `PLAYER_NOT_SUPPORTED` | Player type not supported |
| `SDK_003` | `PLAYER_ATTACH_FAILED` | Failed to attach to player |
| `SDK_004` | `NETWORK_ERROR` | Network request failed |
| `SDK_005` | `QUEUE_FULL` | Event queue is full |
| `SDK_006` | `INVALID_EVENT` | Invalid event data |

### Ingest API Error Codes

| Code | HTTP Status | Error | Description |
|------|-------------|-------|-------------|
| `ING_001` | 400 | `INVALID_JSON` | Request body is not valid JSON |
| `ING_002` | 400 | `SCHEMA_VALIDATION_FAILED` | Event schema validation failed |
| `ING_003` | 401 | `UNAUTHORIZED` | Invalid or missing API token |
| `ING_004` | 403 | `FORBIDDEN` | Org ID not authorized for this token |
| `ING_005` | 429 | `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `ING_006` | 429 | `QUOTA_EXCEEDED` | Org quota exceeded |
| `ING_007` | 400 | `CARDINALITY_EXCEEDED` | Dimension cardinality limit exceeded |
| `ING_008` | 400 | `PII_DETECTED` | Unallowed PII detected in event |
| `ING_009` | 500 | `DOWNSTREAM_ERROR` | Loki/Prometheus downstream error |
| `ING_010` | 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

### Player Error Codes

Error codes reported in `error` events:

| Family | Code | Description |
|--------|------|-------------|
| `network` | `MANIFEST_LOAD_ERROR` | Failed to load manifest |
| `network` | `FRAGMENT_LOAD_ERROR` | Failed to load media fragment |
| `network` | `TIMEOUT` | Request timeout |
| `decoder` | `MEDIA_DECODE_ERROR` | Failed to decode media |
| `decoder` | `UNSUPPORTED_CODEC` | Codec not supported |
| `source` | `INVALID_MANIFEST` | Manifest parsing error |
| `source` | `INVALID_MEDIA` | Invalid media format |
| `drm` | `LICENSE_REQUEST_FAILED` | DRM license request failed |
| `drm` | `KEY_SYSTEM_ERROR` | Key system error |

---

**End of API Reference v1.0**
