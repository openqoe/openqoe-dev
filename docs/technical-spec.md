# openqoe-core Technical Specification

**Version:** 2.0.0
**Last Updated:** January 2026
**Status:** Final

---

## Table of Contents

1. [System Overview](#system-overview)
2. [SDK Technical Specification](#sdk-technical-specification)
3. [Event Schema Specification](#event-schema-specification)
4. [Metrics Specification](#metrics-specification)
5. [Dimensions Catalog](#dimensions-catalog)
6. [Go Worker Specification](#go-worker-specification)
7. [Backend Integration](#backend-integration)
8. [CMCD Implementation](#cmcd-implementation)
9. [Performance Requirements](#performance-requirements)
10. [Security Specifications](#security-specifications)

---

## System Overview

### Architecture Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Video Player (HTML5/Video.js/HLS.js/dash.js/Shaka)│    │
│  └─────────────────┬──────────────────────────────────┘    │
│                    │                                         │
│  ┌─────────────────▼──────────────────────────────────┐    │
│  │         openqoe-core SDK (TypeScript)              │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Player Adapter Layer                         │  │    │
│  │  │  - HTML5Adapter                               │  │    │
│  │  │  - VideoJsAdapter                             │  │    │
│  │  │  - HlsJsAdapter                               │  │    │
│  │  │  - DashJsAdapter                              │  │    │
│  │  │  - ShakaAdapter                               │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Core SDK Components                          │  │    │
│  │  │  - Event Collector                            │  │    │
│  │  │  - CMCD Processor                             │  │    │
│  │  │  - Session Manager                            │  │    │
│  │  │  - Privacy Module (Hashing)                   │  │    │
│  │  │  - Batch Manager                              │  │    │
│  │  │  - Offline Queue                              │  │    │
│  │  │  - Retry Logic (Exponential Backoff)          │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └─────────────────┬──────────────────────────────────┘    │
└────────────────────┼────────────────────────────────────────┘
                     │ HTTPS (TLS 1.2+)
                     │ Batched Events (JSON)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Go Worker (Ingest & OTLP)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Authentication & Validation Layer                  │    │
│  │  - Token verification                               │    │
│  │  - Schema validation (JSON Schema)                  │    │
│  │  - Version checks                                   │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Privacy & PII Control Layer                        │    │
│  │  - Hash verification                                │    │
│  │  - PII allowlist enforcement                        │    │
│  │  - Redaction engine                                 │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Cardinality Governance Engine                      │    │
│  │  - Dimension policy enforcement                     │    │
│  │  - Top-K bucketing                                  │    │
│  │  - Label sanitization                               │    │
│  │  - Quota management                                 │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Transform & Route Layer                            │    │
│  │  - Event → Loki transformer                         │    │
│  │  - Metric → Prometheus transformer                  │    │
│  │  - Circuit breaker                                  │    │
│  │  - Batch accumulator                                │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────┬──────────────────┬───────────────────────────┘
               │                  │
               │ HTTP POST        │ remote_write
               │ (JSON)           │ (Protobuf)
               ▼                  ▼
    ┌─────────────────┐    ┌─────────────────┐
    │   Loki          │    │ Prometheus/Mimir│
    │   (Logs)        │    │ (Metrics)       │
    │                 │    │                 │
    │ - Raw events    │    │ - Aggregated    │
    │ - Per-view data │    │   metrics       │
    │ - Error traces  │    │ - Time-series   │
    └────────┬────────┘    └────────┬────────┘
             │                      │
             └──────────┬───────────┘
                        │
                        │ LogQL / PromQL
                        ▼
            ┌─────────────────────────┐
            │   Grafana               │
            │                         │
            │ - VOD Monitoring        │
            │ - Impact Explorer       │
            │ - Quality & Delivery    │
            │ - Content Performance   │
            │ - Ingest Health         │
            │                         │
            │ - Alerting Engine       │
            │ - Runbook Links         │
            └─────────────────────────┘
                        │
                        ▼
            ┌─────────────────────────┐
            │  Notification Channels  │
            │  - Slack                │
            │  - PagerDuty            │
            │  - Email                │
            └─────────────────────────┘
```

### Technology Stack

| Component           | Technology                    | Version |
| ------------------- | ----------------------------- | ------- |
| SDK Language        | TypeScript                    | 5.x+    |
| Build Tool          | Rollup/Webpack                | Latest  |
| Package Manager     | npm/yarn                      | Latest  |
| Ingestion Worker    | Go (1.21+)                    | -       |
| Telemetry Collector | Grafana Alloy                 | -       |
| Tracing Backend     | Grafana Tempo                 | -       |
| Serialization       | JSON (Ingest) / OTLP (Export) | -       |
| Metrics Format      | OTLP / Prometheus             | -       |

---

## SDK Technical Specification

### 1. Core SDK Module

#### 1.1 Initialization

```typescript
interface OpenQoEConfig {
  // Required
  orgId: string; // Organization identifier
  playerId: string; // Player instance identifier
  endpointUrl: string; // Ingest endpoint URL

  // Optional
  env?: "dev" | "staging" | "prod"; // Environment
  appName?: string; // Application name
  appVersion?: string; // Application version
  samplingRate?: number; // 0.0 - 1.0 (default: 1.0)

  // Privacy
  enablePII?: boolean; // Enable PII collection (default: false)
  hashSalt?: string; // Per-org salt for hashing

  // Performance
  batchSize?: number; // Events per batch (default: 10)
  batchInterval?: number; // Batch flush interval ms (default: 5000)
  maxQueueSize?: number; // Max offline queue (default: 100)

  // Debugging
  debug?: boolean; // Enable console logging
  logLevel?: "error" | "warn" | "info" | "debug";
}

class OpenQoE {
  constructor(config: OpenQoEConfig);

  // Player integration
  attachPlayer(
    playerType: "html5" | "videojs" | "hlsjs" | "dashjs" | "shaka",
    playerInstance: any,
    metadata?: VideoMetadata,
  ): void;

  // Manual event tracking
  trackEvent(eventType: string, data: any): void;

  // Session management
  startSession(): void;
  endSession(): void;

  // Lifecycle
  destroy(): void;
}
```

#### 1.2 Event Collector

**Responsibilities:**

- Capture player events
- Enrich with context (device, network, etc.)
- Apply privacy transformations
- Queue for batching

**Performance Targets:**

- Event capture: <1ms per event
- Memory footprint: <5MB
- CPU overhead: <1% on modern devices

#### 1.3 Session Manager

**Session Lifecycle:**

```typescript
interface Session {
  sessionId: string; // UUID v4
  viewId: string; // UUID v4 (unique per video view)
  viewStart: number; // Unix timestamp ms
  viewEnd?: number; // Unix timestamp ms

  playbackPosition: number; // Current position ms
  lastHeartbeat: number; // Last heartbeat timestamp

  metadata: {
    orgId: string;
    playerId: string;
    env: string;
    appName?: string;
    appVersion?: string;
  };
}
```

**Session Rules:**

- New `viewId` on each `viewstart` event
- `sessionId` persists across views (browser session)
- Heartbeats every 10 seconds during playback
- Session expires after 30 minutes of inactivity

#### 1.4 Privacy Module

**Hashing Implementation:**

```typescript
interface PrivacyConfig {
  hashAlgorithm: "SHA-256";
  salt: string; // Per-org salt
  fieldsToHash: string[]; // viewer_id, session_id, etc.
}

// Example hashed field
const hashedViewerId = SHA256(viewerId + orgSalt);
```

**PII Handling:**

- **Always hashed:** viewer_id, session_id, user_id
- **Never collected:** email, name, phone, IP address
- **Configurable:** device_id, custom fields

#### 1.5 Batch Manager

**Batching Strategy:**

```typescript
interface BatchConfig {
  maxBatchSize: number; // Max events per batch (default: 10)
  maxBatchInterval: number; // Max time before flush ms (default: 5000)
  maxRetries: number; // Max retry attempts (default: 3)
  backoffMultiplier: number; // Exponential backoff (default: 2)
  maxBackoff: number; // Max backoff ms (default: 30000)
}
```

**Flush Triggers:**

- Batch size reached (default: 10 events)
- Time interval elapsed (default: 5 seconds)
- Critical event (error, ended)
- Page unload (beforeunload)

#### 1.6 Offline Queue

**Queue Behavior:**

- Store events in memory when offline
- Persist to localStorage (optional, max 1MB)
- Flush on reconnection
- FIFO eviction when full

```typescript
interface QueueConfig {
  maxSize: number; // Max events (default: 100)
  persistToStorage: boolean; // Use localStorage (default: true)
  storageKey: string; // Storage key (default: 'openqoe_queue')
}
```

### 2. Player Adapters

Each adapter implements the `PlayerAdapter` interface:

```typescript
interface PlayerAdapter {
  // Lifecycle
  attach(player: any, metadata: VideoMetadata): void;
  detach(): void;

  // Event handlers
  onPlayerReady(): void;
  onViewStart(): void;
  onPlaying(): void;
  onPause(): void;
  onSeek(): void;
  onStallStart(): void;
  onStallEnd(): void;
  onQualityChange(): void;
  onEnded(): void;
  onError(error: PlayerError): void;

  // State getters
  getCurrentTime(): number;
  getDuration(): number;
  getBitrate(): number;
  getVideoResolution(): { width: number; height: number };
  getPlayerState(): PlayerState;

  // CMCD extraction
  getCMCDData(): CMCDSnapshot;
}
```

#### 2.1 HTML5 Adapter

**Event Mapping:**

| Native Event              | openqoe Event |
| ------------------------- | ------------- |
| `loadedmetadata`          | `playerready` |
| `loadstart`               | `viewstart`   |
| `play`                    | `playing`     |
| `pause`                   | `pause`       |
| `seeking`                 | `seek`        |
| `waiting`                 | `stall_start` |
| `playing` (after waiting) | `stall_end`   |
| `ended`                   | `ended`       |
| `error`                   | `error`       |

#### 2.2 Video.js Adapter

**Event Mapping:**

| Video.js Event  | openqoe Event    |
| --------------- | ---------------- |
| `ready`         | `playerready`    |
| `loadstart`     | `viewstart`      |
| `play`          | `playing`        |
| `pause`         | `pause`          |
| `seeking`       | `seek`           |
| `waiting`       | `stall_start`    |
| `playing`       | `stall_end`      |
| `ended`         | `ended`          |
| `error`         | `error`          |
| `qualitychange` | `quality_change` |

#### 2.3 HLS.js Adapter

**Event Mapping:**

| HLS.js Event      | openqoe Event    |
| ----------------- | ---------------- |
| `MANIFEST_LOADED` | `playerready`    |
| `MEDIA_ATTACHED`  | `viewstart`      |
| (video) `play`    | `playing`        |
| (video) `pause`   | `pause`          |
| (video) `seeking` | `seek`           |
| `BUFFER_STALLED`  | `stall_start`    |
| (video) `playing` | `stall_end`      |
| (video) `ended`   | `ended`          |
| `ERROR`           | `error`          |
| `LEVEL_SWITCHED`  | `quality_change` |

**CMCD Extraction:**

- Access `hls.config.cmcd` object
- Extract from XHR/fetch request headers

#### 2.4 dash.js Adapter

**Event Mapping:**

| dash.js Event           | openqoe Event    |
| ----------------------- | ---------------- |
| `streamInitialized`     | `playerready`    |
| `playbackStarted`       | `viewstart`      |
| `playbackPlaying`       | `playing`        |
| `playbackPaused`        | `pause`          |
| `playbackSeeking`       | `seek`           |
| `playbackStalled`       | `stall_start`    |
| `playbackPlaying`       | `stall_end`      |
| `playbackEnded`         | `ended`          |
| `error`                 | `error`          |
| `qualityChangeRendered` | `quality_change` |

#### 2.5 Shaka Player Adapter

**Event Mapping:**

| Shaka Event         | openqoe Event    |
| ------------------- | ---------------- |
| `loaded`            | `playerready`    |
| `streaming`         | `viewstart`      |
| (video) `play`      | `playing`        |
| (video) `pause`     | `pause`          |
| (video) `seeking`   | `seek`           |
| `buffering` (true)  | `stall_start`    |
| `buffering` (false) | `stall_end`      |
| (video) `ended`     | `ended`          |
| `error`             | `error`          |
| `adaptation`        | `quality_change` |

---

## Event Schema Specification

### Base Event Envelope

All events share this base structure:

```json
{
  "event_type": "string", // Event name
  "event_time": 1234567890123, // Event timestamp (ms)
  "viewer_time": 1234567890123, // Client timestamp (ms)
  "playback_time": 5432, // Position in video (ms)

  // Session identifiers
  "org_id": "org_abc123",
  "player_id": "player_xyz789",
  "view_id": "uuid-v4",
  "session_id": "uuid-v4",
  "viewer_id": "hashed-sha256",

  // Environment
  "env": "prod",
  "app_name": "MyVideoApp",
  "app_version": "2.1.0",

  // Device context
  "device": {
    "name": "MacBook Pro",
    "model": "MacBookPro18,1",
    "category": "desktop",
    "manufacturer": "Apple"
  },

  // OS context
  "os": {
    "family": "macOS",
    "version": "14.1"
  },

  // Browser context
  "browser": {
    "family": "Chrome",
    "version": "120.0.0"
  },

  // Player context
  "player": {
    "name": "hls.js",
    "version": "1.5.0",
    "autoplay": true,
    "preload": "auto"
  },

  // Network context
  "network": {
    "asn": 7922,
    "country_code": "US",
    "region": "CA",
    "city": "San Francisco" // Optional, based on policy
  },

  // CDN context (if detectable)
  "cdn": {
    "provider": "cloudflare",
    "edge_pop": "SFO",
    "origin": "origin.example.com"
  },

  // Video metadata
  "video": {
    "id": "video_123",
    "title": "Sample Video",
    "series": "Series Name",
    "duration": 120000, // ms
    "source_url": "https://cdn.example.com/video.m3u8" // Sanitized
  },

  // Event-specific data
  "data": {} // Varies by event type
}
```

### Event Types & Data Schemas

#### 1. playerready

```json
{
  "event_type": "playerready",
  "data": {
    "player_startup_time": 125, // ms
    "page_load_time": 1234 // ms (if available)
  }
}
```

#### 2. viewstart

```json
{
  "event_type": "viewstart",
  "data": {
    "video_startup_time": 450, // ms to first frame
    "preroll_requested": false
  }
}
```

#### 3. playing

```json
{
  "event_type": "playing",
  "data": {
    "bitrate": 2500000, // bps
    "resolution": {
      "width": 1920,
      "height": 1080
    },
    "framerate": 30
  }
}
```

#### 4. pause

```json
{
  "event_type": "pause",
  "data": {
    "playing_time": 45000 // ms spent playing
  }
}
```

#### 5. seek

```json
{
  "event_type": "seek",
  "data": {
    "from": 10000, // ms
    "to": 45000, // ms
    "seek_latency": 234 // ms to resume playback
  }
}
```

#### 6. stall_start

```json
{
  "event_type": "stall_start",
  "data": {
    "buffer_length": 1200, // ms of buffered content
    "bitrate": 2500000 // bps at stall
  }
}
```

#### 7. stall_end

```json
{
  "event_type": "stall_end",
  "data": {
    "stall_duration": 1234, // ms
    "buffer_length": 5000 // ms after recovery
  }
}
```

#### 8. quality_change

```json
{
  "event_type": "quality_change",
  "data": {
    "previous_bitrate": 1500000, // bps
    "new_bitrate": 2500000, // bps
    "previous_resolution": {
      "width": 1280,
      "height": 720
    },
    "new_resolution": {
      "width": 1920,
      "height": 1080
    },
    "trigger": "abr" // "abr" | "manual"
  }
}
```

#### 9. ended

```json
{
  "event_type": "ended",
  "data": {
    "playing_time": 118000, // ms
    "total_watch_time": 125000, // ms (includes pauses)
    "completion_rate": 0.98, // 0.0 - 1.0
    "rebuffer_count": 2,
    "rebuffer_duration": 1500 // ms total
  }
}
```

#### 10. error

```json
{
  "event_type": "error",
  "data": {
    "error_family": "network", // "network" | "decoder" | "source" | "drm"
    "error_id": 1001,
    "error_code": "MANIFEST_LOAD_ERROR",
    "error_message": "Failed to load manifest",
    "error_context": {
      "url": "https://cdn.example.com/video.m3u8",
      "http_status": 404,
      "fatal": true
    }
  }
}
```

#### 11. quartile

```json
{
  "event_type": "quartile",
  "data": {
    "quartile": 25, // 25 | 50 | 75 | 100
    "playing_time": 30000, // ms
    "watch_time": 32000 // ms
  }
}
```

#### 12. heartbeat

```json
{
  "event_type": "heartbeat",
  "data": {
    "playing_time": 45000, // ms since viewstart
    "bitrate": 2500000, // bps
    "buffer_length": 15000, // ms
    "dropped_frames": 5
  }
}
```

---

## Metrics Specification

### Metric Categories

#### 1. Startup Metrics

| Metric ID                          | Display Name           | Measurement       | Unit | Description                              |
| ---------------------------------- | ---------------------- | ----------------- | ---- | ---------------------------------------- |
| `aggregate_startup_time`           | Aggregate Startup Time | median, 95th, avg | ms   | Total time from page load to first frame |
| `player_startup_time`              | Player Startup Time    | median, 95th      | ms   | Time to initialize player                |
| `video_startup_time`               | Video Startup Time     | median, 95th      | ms   | Time from play request to first frame    |
| `page_load_time`                   | Page Load Time         | median, 95th      | ms   | Browser page load time                   |
| `video_startup_failure_percentage` | Startup Failure %      | avg               | %    | Percentage of views that failed to start |

#### 2. Smoothness Metrics

| Metric ID             | Display Name       | Measurement         | Unit    | Description                         |
| --------------------- | ------------------ | ------------------- | ------- | ----------------------------------- |
| `rebuffer_percentage` | Rebuffer %         | avg                 | %       | % of playing time spent rebuffering |
| `rebuffer_duration`   | Rebuffer Duration  | median, 95th, sum   | ms      | Total rebuffer time per view        |
| `rebuffer_frequency`  | Rebuffer Frequency | avg                 | per min | Rebuffers per minute of playtime    |
| `rebuffer_count`      | Rebuffer Count     | median, 95th, count | count   | Number of rebuffer events           |
| `rebuffer_score`      | Rebuffer Score     | avg                 | 0-1     | Composite smoothness score          |

#### 3. Quality Metrics

| Metric ID                  | Display Name        | Measurement       | Unit | Description                            |
| -------------------------- | ------------------- | ----------------- | ---- | -------------------------------------- |
| `weighted_average_bitrate` | Avg Bitrate         | median, 95th      | bps  | Time-weighted average bitrate          |
| `upscale_percentage`       | Upscale %           | median, 95th, avg | %    | % time video upscaled vs player size   |
| `downscale_percentage`     | Downscale %         | median, 95th, avg | %    | % time video downscaled vs player size |
| `video_quality_score`      | Video Quality Score | avg               | 0-1  | Composite quality score                |

#### 4. Engagement Metrics

| Metric ID        | Display Name   | Measurement | Unit  | Description                 |
| ---------------- | -------------- | ----------- | ----- | --------------------------- |
| `playing_time`   | Playing Time   | sum         | ms    | Total time in playing state |
| `watch_time`     | Watch Time     | sum         | ms    | Total session duration      |
| `views`          | Views          | count       | count | Total view count            |
| `unique_viewers` | Unique Viewers | count       | count | Distinct viewer count       |

#### 5. Failure Metrics

| Metric ID                     | Display Name        | Measurement | Unit | Description                         |
| ----------------------------- | ------------------- | ----------- | ---- | ----------------------------------- |
| `exits_before_video_start`    | Exit Before Start % | avg         | %    | % viewers who leave before playback |
| `playback_failure_percentage` | Playback Failure %  | avg         | %    | % of views with playback errors     |

#### 6. Experience Scores

| Metric ID                 | Display Name            | Measurement | Unit | Description           |
| ------------------------- | ----------------------- | ----------- | ---- | --------------------- |
| `viewer_experience_score` | Viewer Experience Score | avg         | 0-1  | Overall QoE score     |
| `startup_time_score`      | Startup Time Score      | avg         | 0-1  | Startup quality score |

---

## Dimensions Catalog

### Monitoring Dimensions (Real-time, Fixed Set)

| Dimension          | Type    | Cardinality | Example Values                                 |
| ------------------ | ------- | ----------- | ---------------------------------------------- |
| `asn`              | integer | ~50K        | 7922, 15169                                    |
| `cdn`              | string  | ~20         | "cloudflare", "fastly", "akamai"               |
| `country`          | string  | ~250        | "US", "GB", "JP"                               |
| `operating_system` | string  | ~10         | "macOS", "Windows", "Linux", "iOS", "Android"  |
| `player_name`      | string  | 5           | "html5", "videojs", "hlsjs", "dashjs", "shaka" |
| `region`           | string  | ~5K         | "CA", "NY", "London"                           |
| `stream_type`      | string  | 2           | "VOD", "Live"                                  |
| `video_title`      | string  | High        | Bucketed to top-100 + "Other"                  |

### Historical Dimensions (Broader Set)

#### Device Dimensions

| Dimension                    | Type   | Cardinality | Policy                              |
| ---------------------------- | ------ | ----------- | ----------------------------------- |
| `viewer_device_name`         | string | High        | Bucket to families                  |
| `viewer_device_model`        | string | Very High   | Bucket to top-K                     |
| `viewer_device_category`     | string | ~5          | "desktop", "mobile", "tablet", "tv" |
| `viewer_device_manufacturer` | string | ~100        | "Apple", "Samsung", "Google"        |

#### Browser/OS Dimensions

| Dimension                  | Type   | Cardinality | Policy                  |
| -------------------------- | ------ | ----------- | ----------------------- |
| `browser`                  | string | ~10         | Allow                   |
| `browser_version`          | string | High        | Bucket to major version |
| `operating_system`         | string | ~10         | Allow                   |
| `operating_system_version` | string | High        | Bucket to major version |

#### Player Dimensions

| Dimension                 | Type    | Cardinality | Policy                     |
| ------------------------- | ------- | ----------- | -------------------------- |
| `player_software`         | string  | ~20         | Allow                      |
| `player_software_version` | string  | High        | Bucket to major version    |
| `player_autoplay`         | boolean | 2           | Allow                      |
| `player_preload`          | string  | 3           | "none", "metadata", "auto" |

#### Video/Content Dimensions

| Dimension      | Type   | Cardinality | Policy                            |
| -------------- | ------ | ----------- | --------------------------------- |
| `video_id`     | string | Very High   | Hash or bucket                    |
| `video_title`  | string | Very High   | Top-100 + "Other", length cap 100 |
| `video_series` | string | High        | Top-50 + "Other"                  |
| `stream_type`  | string | 2           | "VOD", "Live"                     |

#### Network Dimensions

| Dimension         | Type    | Cardinality | Policy                 |
| ----------------- | ------- | ----------- | ---------------------- |
| `asn`             | integer | ~50K        | Allow                  |
| `country`         | string  | ~250        | Allow                  |
| `region`          | string  | ~5K         | Allow                  |
| `cdn`             | string  | ~20         | Allow                  |
| `video_cdn_trace` | array   | Very High   | Drop (trace dimension) |

#### Custom Dimensions

| Dimension                | Type   | Cardinality | Policy                    |
| ------------------------ | ------ | ----------- | ------------------------- |
| `custom_1` - `custom_10` | string | Varies      | Per-org approval required |

---

## Go Worker Specification

### 1. Worker Architecture

The Go Worker uses the Gin web framework for HTTP handling and a buffered channel with a worker pool for OTLP export.

```go
// Simplified main handler logic
func handleEvents(c *gin.Context) {
    var envelope EventEnvelope
    if err := c.ShouldBindJSON(&envelope); err != nil {
        c.JSON(400, gin.H{"error": "invalid schema"})
        return
    }

    // Push to internal queue for async OTLP export
    eventQueue <- envelope.Events
    c.Status(202) // Accepted
}
```

### 2. Implementation Modules

- **Ingestion**: Gin-based REST API for synchronous event reception.
- **Enrichment**: Adds server-side context (e.g., GeoIP, User-Agent parsing).
- **Governance**: Protects backends from cardinality explosion.
- **Export**: OTLP-native exporter for Mimir, Loki, and Tempo.

### 3. Metric Transformation (OTLP)

Events are mapped to OTel metrics:

- `playing` → Gauge `openqoe_playing_status`
- `stall_start/end` → Histogram `openqoe_rebuffer_duration_seconds`
- `viewstart` → Counter `openqoe_views_started_total`

### 3. Schema Validation

Uses JSON Schema validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["event_type", "event_time", "org_id", "player_id", "view_id"],
  "properties": {
    "event_type": {
      "type": "string",
      "enum": [
        "manifestload playerready canplay canplaythrough playing pause seek waitstart stallstart stallend ended error quartile heartbeat qualitychangerequested qualitychange fpsdrop fragmentloaded bufferlevelchange bandwidthchange playbackratechange playbackvolumechange playbackdetached moveaway moveback"
      ]
    },
    "event_time": { "type": "number" },
    "org_id": { "type": "string", "minLength": 1 },
    "player_id": { "type": "string", "minLength": 1 },
    "view_id": { "type": "string", "format": "uuid" }
  }
}
```

### 4. Cardinality Policies

```typescript
interface CardinalityPolicy {
  field: string;
  action: "allow" | "bucket" | "hash" | "drop";
  topK?: number; // For bucketing
  maxLength?: number; // String length cap
  bucketPattern?: string; // Regex for bucketing
}

const DEFAULT_POLICIES: CardinalityPolicy[] = [
  // Always safe
  { field: "country", action: "allow" },
  { field: "region", action: "allow" },
  { field: "asn", action: "allow" },
  { field: "cdn", action: "allow" },

  // Controlled
  { field: "video_title", action: "bucket", topK: 100, maxLength: 100 },
  { field: "device_model", action: "bucket", topK: 50 },
  { field: "browser_version", action: "bucket", bucketPattern: "^(\\d+)" }, // Major version only

  // Dangerous
  { field: "source_url", action: "hash" },
  { field: "referrer", action: "drop" },
  { field: "query_params", action: "drop" },
];
```

### 5. Loki Transform

```typescript
async function sendToLoki(events: Event[]): Promise<void> {
  const streams = events.map((event) => ({
    stream: {
      org_id: event.org_id,
      player_id: event.player_id,
      event_type: event.event_type,
      env: event.env || "prod",
    },
    values: [[String(event.event_time * 1000000), JSON.stringify(event)]],
  }));

  await fetch(LOKI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Scope-OrgID": event.org_id,
    },
    body: JSON.stringify({ streams }),
  });
}
```

### 6. Prometheus Transform

```typescript
async function sendToPrometheus(events: Event[]): Promise<void> {
  const metrics = aggregateToMetrics(events);

  const timeSeries = metrics.map((metric) => ({
    labels: [
      { name: "__name__", value: metric.name },
      { name: "org_id", value: metric.orgId },
      { name: "player_id", value: metric.playerId },
      ...metric.labels,
    ],
    samples: [
      {
        value: metric.value,
        timestamp: metric.timestamp,
      },
    ],
  }));

  const writeRequest = createRemoteWriteRequest(timeSeries);

  await fetch(PROMETHEUS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-protobuf",
      "X-Prometheus-Remote-Write-Version": "0.1.0",
    },
    body: writeRequest,
  });
}
```

---

## Performance Requirements

### SDK Performance Targets

| Metric                 | Target     | Measurement Method              |
| ---------------------- | ---------- | ------------------------------- |
| Bundle Size (gzip)     | < 10 KB    | webpack-bundle-analyzer         |
| Event Capture Overhead | < 1 ms     | performance.measure()           |
| Memory Footprint       | < 5 MB     | Chrome DevTools Memory Profiler |
| CPU Usage              | < 1%       | Chrome DevTools Performance     |
| Network Requests       | ≤ 1 per 5s | Chrome DevTools Network         |

### Worker Performance Targets

| Metric       | Target   | Measurement Method    |
| ------------ | -------- | --------------------- |
| P50 Latency  | < 50 ms  | Worker Internal Stats |
| P95 Latency  | < 100 ms | Worker Internal Stats |
| P99 Latency  | < 200 ms | Worker Internal Stats |
| Success Rate | > 99.9%  | Worker Internal Stats |
| CPU Time     | < 50 ms  | Worker Metrics        |

### End-to-End Latency

| Path               | Target      | Measurement                       |
| ------------------ | ----------- | --------------------------------- |
| Event → Loki       | < 2 seconds | Timestamp delta                   |
| Event → Prometheus | < 5 seconds | Timestamp delta                   |
| Alert Detection    | < 1 minute  | Alert timestamp - event timestamp |

---

## Security Specifications

### 1. Transport Security

- **Protocol:** HTTPS only
- **TLS Version:** TLS 1.2 minimum, TLS 1.3 preferred
- **Certificate Validation:** Strict (no self-signed certs in prod)
- **HSTS:** Enabled with max-age=31536000

### 2. Authentication

```typescript
// Worker authentication
interface TokenConfig {
  algorithm: "HMAC-SHA256" | "JWT";
  secret: string; // Stored in KV/Secrets
  ttl?: number; // Token TTL (optional)
}

// SDK does NOT store secrets
// Tokens injected server-side or via secure config endpoint
```

### 3. Data Privacy

**Hashing Standard:**

```
SHA-256(value + per_org_salt)
- Salt length: 32 bytes (256 bits)
- Salt storage: Environment Variables / Secrets Manager
- Salt rotation: Supported (with migration period)
```

**PII Allowlist (default: empty):**

```typescript
interface PIIPolicy {
  allowedFields: string[]; // Fields allowed to contain PII
  redactionPattern: RegExp; // Pattern for auto-redaction
  auditLog: boolean; // Log PII access
}
```

### 4. CORS Configuration

```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://yourdomain.com", // Specific origin
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Token",
  "Access-Control-Max-Age": "86400",
};
```

### 5. CSP (Content Security Policy)

Recommended CSP for pages using openqoe-core:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  connect-src 'self' https://ingest.openqoe.example.com;
  media-src 'self' https://cdn.example.com;
```

---

## CMCD Implementation

### CMCD Fields Captured

| Field                    | Key   | Type    | Description                                      |
| ------------------------ | ----- | ------- | ------------------------------------------------ |
| Buffer Length            | `bl`  | integer | Buffer length (ms)                               |
| Buffer Starvation        | `bs`  | boolean | Buffer starvation flag                           |
| Content ID               | `cid` | string  | Unique content identifier                        |
| Object Duration          | `d`   | integer | Object duration (ms)                             |
| Deadline                 | `dl`  | integer | Deadline (ms)                                    |
| Measured Throughput      | `mtp` | integer | Throughput (kbps)                                |
| Next Object Request      | `nor` | string  | Next request URL                                 |
| Next Range Request       | `nrr` | string  | Next byte range                                  |
| Object Type              | `ot`  | string  | Object type (m=manifest, a=audio, v=video, etc.) |
| Playback Rate            | `pr`  | float   | Playback rate                                    |
| Requested Max Throughput | `rtp` | integer | Requested max throughput (kbps)                  |
| Streaming Format         | `sf`  | string  | Streaming format (d=DASH, h=HLS, etc.)           |
| Session ID               | `sid` | string  | Session identifier                               |
| Stream Type              | `st`  | string  | Stream type (v=VOD, l=Live)                      |
| Startup                  | `su`  | boolean | Startup flag                                     |
| Top Bitrate              | `tb`  | integer | Top bitrate (kbps)                               |
| Version                  | `v`   | integer | CMCD version                                     |

### CMCD Extraction by Player

#### HLS.js

```typescript
// Access from request headers or player config
player.on(Hls.Events.FRAG_LOADING, (event, data) => {
  const cmcd = extractCMCDFromHeaders(data.frag.url);
});
```

#### dash.js

```typescript
// Access from RequestModifier
player.on(dashjs.MediaPlayer.events.FRAGMENT_LOADING_STARTED, (e) => {
  const cmcd = e.request.cmcd;
});
```

#### Shaka

```typescript
// Access from network request filter
player.getNetworkingEngine().registerRequestFilter((type, request) => {
  const cmcd = request.headers["CMCD"];
});
```

---

**End of Technical Specification v2.0**
