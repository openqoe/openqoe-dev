# openqoe-core Data Model Specification

**Version:** 2.0.0
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Event Data Model](#event-data-model)
3. [Metrics Data Model](#metrics-data-model)
4. [Dimensions Reference](#dimensions-reference)
5. [CMCD Data Model](#cmcd-data-model)
6. [Data Types & Formats](#data-types--formats)

---

## Overview

The openqoe-core data model consists of:

- **Events**: Raw playback events with full context (stored in Loki)
- **Metrics**: Aggregated time-series metrics (stored in Prometheus)
- **Dimensions**: Labels for filtering and grouping
- **CMCD**: Common Media Client Data snapshots

---

## Event Data Model

### Base Event Schema

All events share this base structure:

```json
{
  "event_type": "string", // Required (e.g., "playing")
  "event_time": 1736784000000, // Required (Unix ms)
  "viewer_time": 4500, // Required (ms from start)
  "playback_time": 4500, // Optional (miliseconds)

  "org_id": "string", // Required
  "player_id": "string", // Required
  "view_id": "uuid", // Required
  "session_id": "uuid", // Required
  "viewer_id": "hashed-string", // Required

  "env": "prod", // Optional
  "app_name": "string", // Optional
  "app_version": "string", // Optional

  "device": {
    "name": "...",
    "model": "...",
    "category": "...",
    "manufacturer": "..."
  },
  "os": { "family": "...", "version": "..." },
  "browser": { "family": "...", "version": "..." },
  "player": {
    "name": "...",
    "version": "...",
    "autoplay": true,
    "preload": "..."
  },
  "network": {
    "asn": 123,
    "country_code": "...",
    "region": "...",
    "city": "..."
  },
  "cdn": { "provider": "...", "edge_pop": "...", "origin": "..." },
  "video": {
    "id": "...",
    "title": "...",
    "series": "...",
    "duration": 120,
    "source_url": "..."
  },

  "data": {} // Event-specific data
}
```

### Event Types

OpenQoE v2 supports 24+ event types covering the entire playback lifecycle:

| Event Type               | Description                               |
| ------------------------ | ----------------------------------------- |
| `manifestload`           | Manifest request/load started             |
| `playerready`            | Player initialized and ready              |
| `canplay`                | Enough data to start playback             |
| `canplaythrough`         | Full video can be played without stalling |
| `playing`                | Playback actually started                 |
| `pause`                  | Playback paused                           |
| `seek`                   | Seek initiated                            |
| `waitstart`              | Waiting for data (buffering)              |
| `stallstart`             | Explicit stall detected                   |
| `stallend`               | Stall recovered                           |
| `ended`                  | Playback completed                        |
| `error`                  | Playback error                            |
| `quartile`               | 25/50/75/100% milestones                  |
| `heartbeat`              | Periodic status update                    |
| `qualitychangerequested` | Rendition switch requested                |
| `qualitychange`          | Rendition switch completed                |
| `fpsdrop`                | Frame rate degradation                    |
| `fragmentloaded`         | Media segment loaded                      |
| `bandwidthchange`        | Network capacity change                   |
| `playbackratechange`     | Speed change                              |
| `playbackvolumechange`   | Volume change                             |
| `playbackdetached`       | Player unmounted                          |
| `moveaway`               | Page became invisible                     |
| `moveback`               | Page became visible                       |

---

#### 3. playing

Playback started or resumed.

**event_type:** `"playing"`

**data:**

```json
{
  "bitrate": 2500000, // bps (optional)
  "resolution": {
    // optional
    "width": 1920,
    "height": 1080
  },
  "framerate": 30 // fps (optional)
}
```

---

#### 4. pause

Playback paused.

**event_type:** `"pause"`

**data:**

```json
{
  "playing_time": 45000 // ms (optional)
}
```

---

#### 5. seek

User initiated seek.

**event_type:** `"seek"`

**data:**

```json
{
  "from": 10000, // ms (required)
  "to": 45000, // ms (required)
  "seek_latency": 234 // ms (optional)
}
```

---

#### 6. stall_start

Rebuffering started.

**event_type:** `"stall_start"`

**data:**

```json
{
  "buffer_length": 1200, // ms (optional)
  "bitrate": 2500000 // bps (optional)
}
```

---

#### 7. stall_end

Rebuffering ended.

**event_type:** `"stall_end"`

**data:**

```json
{
  "stall_duration": 1234, // ms (required)
  "buffer_length": 5000 // ms (optional)
}
```

---

#### 8. quality_change

Bitrate/rendition changed.

**event_type:** `"quality_change"`

**data:**

```json
{
  "previous_bitrate": 1500000, // bps (optional)
  "new_bitrate": 2500000, // bps (required)
  "previous_resolution": {
    // optional
    "width": 1280,
    "height": 720
  },
  "new_resolution": {
    // optional
    "width": 1920,
    "height": 1080
  },
  "trigger": "abr" // "abr" | "manual" (optional)
}
```

---

#### 9. ended

Playback completed.

**event_type:** `"ended"`

**data:**

```json
{
  "playing_time": 118000, // ms (optional)
  "total_watch_time": 125000, // ms (optional)
  "completion_rate": 0.98, // 0.0 - 1.0 (optional)
  "rebuffer_count": 2, // count (optional)
  "rebuffer_duration": 1500 // ms total (optional)
}
```

---

#### 10. error

Playback error occurred.

**event_type:** `"error"`

**data:**

```json
{
  "error_family": "network", // required
  "error_id": 1001, // optional
  "error_code": "MANIFEST_LOAD_ERROR", // required
  "error_message": "Failed to load manifest", // required
  "error_context": {
    // optional
    "url": "https://cdn.example.com/video.m3u8",
    "http_status": 404,
    "fatal": true
  }
}
```

**Error Families:**

- `"network"` - Network/loading errors
- `"decoder"` - Media decoding errors
- `"source"` - Source/manifest errors
- `"drm"` - DRM/encryption errors
- `"business"` - Business logic errors (e.g., subscription expired)

---

#### 11. quartile

Quartile completion milestone.

**event_type:** `"quartile"`

**data:**

```json
{
  "quartile": 25, // 25 | 50 | 75 | 100 (required)
  "playing_time": 30000, // ms (optional)
  "watch_time": 32000 // ms (optional)
}
```

---

#### 12. heartbeat

Periodic alive signal during playback.

**event_type:** `"heartbeat"`

**data:**

```json
{
  "playing_time": 45000, // ms (optional)
  "bitrate": 2500000, // bps (optional)
  "buffer_length": 15000, // ms (optional)
  "dropped_frames": 5 // count (optional)
}
```

**Frequency:** Every 10 seconds during playback

---

### Context Objects

#### device

```json
{
  "name": "MacBook Pro",
  "model": "MacBookPro18,1",
  "category": "desktop", // "desktop" | "mobile" | "tablet" | "tv"
  "manufacturer": "Apple"
}
```

#### os

```json
{
  "family": "macOS",
  "version": "14.1"
}
```

#### browser

```json
{
  "family": "Chrome",
  "version": "120.0.0"
}
```

#### player

```json
{
  "name": "hls.js",
  "version": "1.5.0",
  "autoplay": true,
  "preload": "auto" // "none" | "metadata" | "auto"
}
```

#### network

```json
{
  "asn": 7922,
  "country_code": "US",
  "region": "CA",
  "city": "San Francisco" // Optional, based on policy
}
```

#### cdn

```json
{
  "provider": "cloudflare",
  "edge_pop": "SFO",
  "origin": "origin.example.com"
}
```

#### video

```json
{
  "id": "video_123",
  "title": "Sample Video",
  "series": "Series Name",
  "duration": 120000, // ms
  "source_url": "https://cdn.example.com/video.m3u8" // Sanitized
}
```

---

## Metrics Data Model

### Metric Naming Convention

```
openqoe_<metric_name>{labels}
```

**Example:**

```
openqoe_rebuffer_percentage{org_id="org_123",country="US"} 0.015
```

### Metric Categories

#### Startup Metrics

| Metric Name                                | Type      | Unit | Labels                          |
| ------------------------------------------ | --------- | ---- | ------------------------------- |
| `openqoe_aggregate_startup_time`           | Histogram | ms   | org_id, player_id, [dimensions] |
| `openqoe_player_startup_time`              | Histogram | ms   | org_id, player_id, [dimensions] |
| `openqoe_video_startup_time`               | Histogram | ms   | org_id, player_id, [dimensions] |
| `openqoe_page_load_time`                   | Histogram | ms   | org_id, player_id, [dimensions] |
| `openqoe_video_startup_failure_percentage` | Gauge     | %    | org_id, player_id, [dimensions] |

#### Smoothness Metrics

| Metric Name                   | Type      | Unit    | Labels                          |
| ----------------------------- | --------- | ------- | ------------------------------- |
| `openqoe_rebuffer_percentage` | Gauge     | %       | org_id, player_id, [dimensions] |
| `openqoe_rebuffer_duration`   | Histogram | ms      | org_id, player_id, [dimensions] |
| `openqoe_rebuffer_frequency`  | Gauge     | per min | org_id, player_id, [dimensions] |
| `openqoe_rebuffer_count`      | Histogram | count   | org_id, player_id, [dimensions] |
| `openqoe_rebuffer_score`      | Gauge     | 0-1     | org_id, player_id, [dimensions] |

#### Quality Metrics

| Metric Name                        | Type      | Unit | Labels                          |
| ---------------------------------- | --------- | ---- | ------------------------------- |
| `openqoe_weighted_average_bitrate` | Histogram | bps  | org_id, player_id, [dimensions] |
| `openqoe_upscale_percentage`       | Histogram | %    | org_id, player_id, [dimensions] |
| `openqoe_downscale_percentage`     | Histogram | %    | org_id, player_id, [dimensions] |
| `openqoe_video_quality_score`      | Gauge     | 0-1  | org_id, player_id, [dimensions] |

#### Engagement Metrics

| Metric Name                    | Type    | Unit    | Labels                          |
| ------------------------------ | ------- | ------- | ------------------------------- |
| `openqoe_playing_time_seconds` | Counter | seconds | org_id, player_id, [dimensions] |
| `openqoe_watch_time_seconds`   | Counter | seconds | org_id, player_id, [dimensions] |
| `openqoe_views_total`          | Counter | count   | org_id, player_id, [dimensions] |
| `openqoe_unique_viewers`       | Gauge   | count   | org_id, player_id, [dimensions] |

#### Failure Metrics

| Metric Name                                   | Type  | Unit | Labels                          |
| --------------------------------------------- | ----- | ---- | ------------------------------- |
| `openqoe_exits_before_video_start_percentage` | Gauge | %    | org_id, player_id, [dimensions] |
| `openqoe_playback_failure_percentage`         | Gauge | %    | org_id, player_id, [dimensions] |

#### Experience Scores

| Metric Name                       | Type  | Unit | Labels                          |
| --------------------------------- | ----- | ---- | ------------------------------- |
| `openqoe_viewer_experience_score` | Gauge | 0-1  | org_id, player_id, [dimensions] |
| `openqoe_startup_time_score`      | Gauge | 0-1  | org_id, player_id, [dimensions] |

### Metric Types

#### Counter

Monotonically increasing value.

**Example:**

```
openqoe_views_total{org_id="org_123",country="US"} 12345
```

#### Gauge

Current value that can go up or down.

**Example:**

```
openqoe_rebuffer_percentage{org_id="org_123",cdn="cloudflare"} 0.015
```

#### Histogram

Distribution of values with buckets.

**Example:**

```
openqoe_video_startup_time_bucket{org_id="org_123",le="500"} 100
openqoe_video_startup_time_bucket{org_id="org_123",le="1000"} 250
openqoe_video_startup_time_bucket{org_id="org_123",le="2000"} 380
openqoe_video_startup_time_bucket{org_id="org_123",le="+Inf"} 400
openqoe_video_startup_time_sum{org_id="org_123"} 345000
openqoe_video_startup_time_count{org_id="org_123"} 400
```

**Bucket Definitions:**

Startup Times: `[100, 250, 500, 1000, 2000, 5000, 10000]` ms

Rebuffer Duration: `[100, 250, 500, 1000, 2500, 5000, 10000]` ms

Bitrate: `[250000, 500000, 1000000, 2500000, 5000000, 10000000]` bps

---

## Dimensions Reference

### Required Dimensions

Always present on all metrics and events:

| Dimension   | Type   | Example           | Description                |
| ----------- | ------ | ----------------- | -------------------------- |
| `org_id`    | string | `"org_abc123"`    | Organization identifier    |
| `player_id` | string | `"player_xyz789"` | Player instance identifier |

### Monitoring Dimensions (Fixed Set)

Used for real-time operational monitoring:

| Dimension          | Type    | Cardinality | Example           |
| ------------------ | ------- | ----------- | ----------------- |
| `asn`              | integer | ~50K        | `7922`            |
| `cdn`              | string  | ~20         | `"cloudflare"`    |
| `country`          | string  | ~250        | `"US"`            |
| `operating_system` | string  | ~10         | `"macOS"`         |
| `player_name`      | string  | 5           | `"hlsjs"`         |
| `region`           | string  | ~5K         | `"CA"`            |
| `stream_type`      | string  | 2           | `"VOD"`           |
| `video_title`      | string  | High        | Top-100 + "Other" |

### Historical Dimensions (Broader Set)

Used for historical analysis:

#### Device Dimensions

| Dimension                    | Type   | Example            |
| ---------------------------- | ------ | ------------------ |
| `viewer_device_name`         | string | `"MacBook Pro"`    |
| `viewer_device_model`        | string | `"MacBookPro18,1"` |
| `viewer_device_category`     | string | `"desktop"`        |
| `viewer_device_manufacturer` | string | `"Apple"`          |

#### Browser/OS Dimensions

| Dimension                  | Type   | Example         |
| -------------------------- | ------ | --------------- |
| `browser`                  | string | `"Chrome"`      |
| `browser_version`          | string | `"120"` (major) |
| `operating_system`         | string | `"macOS"`       |
| `operating_system_version` | string | `"14"` (major)  |

#### Player Dimensions

| Dimension                 | Type    | Example       |
| ------------------------- | ------- | ------------- |
| `player_software`         | string  | `"hls.js"`    |
| `player_software_version` | string  | `"1"` (major) |
| `player_autoplay`         | boolean | `true`        |
| `player_preload`          | string  | `"auto"`      |

#### Video/Content Dimensions

| Dimension      | Type   | Example          |
| -------------- | ------ | ---------------- |
| `video_id`     | string | `"video_123"`    |
| `video_title`  | string | `"Sample Video"` |
| `video_series` | string | `"Series Name"`  |
| `stream_type`  | string | `"VOD"`          |

#### Network Dimensions

| Dimension | Type    | Example        |
| --------- | ------- | -------------- |
| `asn`     | integer | `7922`         |
| `country` | string  | `"US"`         |
| `region`  | string  | `"CA"`         |
| `cdn`     | string  | `"cloudflare"` |

#### Custom Dimensions

| Dimension   | Type   | Example      |
| ----------- | ------ | ------------ |
| `custom_1`  | string | User-defined |
| `custom_2`  | string | User-defined |
| ...         | ...    | ...          |
| `custom_10` | string | User-defined |

---

## CMCD Data Model

### CMCD Fields

Common Media Client Data fields captured in events:

| Field                    | Key   | Type    | Unit | Description                      |
| ------------------------ | ----- | ------- | ---- | -------------------------------- |
| Buffer Length            | `bl`  | integer | ms   | Buffer length                    |
| Buffer Starvation        | `bs`  | boolean | -    | Buffer starvation occurred       |
| Content ID               | `cid` | string  | -    | Unique content identifier        |
| Object Duration          | `d`   | integer | ms   | Object duration                  |
| Deadline                 | `dl`  | integer | ms   | Deadline for delivery            |
| Measured Throughput      | `mtp` | integer | kbps | Measured throughput              |
| Next Object Request      | `nor` | string  | -    | URL of next object               |
| Next Range Request       | `nrr` | string  | -    | Byte range of next request       |
| Object Type              | `ot`  | string  | -    | Object type (m/a/v/i/c/tt/k/o)   |
| Playback Rate            | `pr`  | float   | -    | Playback rate                    |
| Requested Max Throughput | `rtp` | integer | kbps | Requested max throughput         |
| Streaming Format         | `sf`  | string  | -    | Format (d=DASH, h=HLS, s=Smooth) |
| Session ID               | `sid` | string  | -    | Session identifier               |
| Stream Type              | `st`  | string  | -    | Type (v=VOD, l=Live)             |
| Startup                  | `su`  | boolean | -    | Startup flag                     |
| Top Bitrate              | `tb`  | integer | kbps | Top available bitrate            |
| Version                  | `v`   | integer | -    | CMCD version                     |

### CMCD Object Types

| Code | Type              |
| ---- | ----------------- |
| `m`  | Manifest/Playlist |
| `a`  | Audio segment     |
| `v`  | Video segment     |
| `i`  | Init segment      |
| `c`  | Caption/Subtitle  |
| `tt` | Timed text        |
| `k`  | Encryption key    |
| `o`  | Other             |

### CMCD Streaming Formats

| Code | Format           |
| ---- | ---------------- |
| `d`  | MPEG-DASH        |
| `h`  | HLS              |
| `s`  | Smooth Streaming |
| `o`  | Other            |

### CMCD in Events

CMCD data is included in events as a nested object:

```json
{
  "event_type": "heartbeat",
  "cmcd": {
    "bl": 15000,
    "bs": false,
    "cid": "video_123",
    "d": 4000,
    "mtp": 2500,
    "ot": "v",
    "pr": 1.0,
    "rtp": 5000,
    "sf": "h",
    "sid": "session_456",
    "st": "v",
    "tb": 5000,
    "v": 1
  },
  ...
}
```

---

## Data Types & Formats

### Primitive Types

| Type        | Description                 | Example                                  |
| ----------- | --------------------------- | ---------------------------------------- |
| `string`    | UTF-8 string                | `"Sample Video"`                         |
| `integer`   | Signed 64-bit integer       | `12345`                                  |
| `float`     | 64-bit floating point       | `1.5`                                    |
| `boolean`   | True or false               | `true`                                   |
| `timestamp` | Unix milliseconds (integer) | `1699564800000`                          |
| `uuid`      | UUID v4 string              | `"550e8400-e29b-41d4-a716-446655440000"` |
| `hash`      | SHA-256 hex string          | `"5e884898da28047151d0e56f8dc62927..."`  |

### Timestamp Formats

All timestamps are **Unix milliseconds** (integer):

```json
{
  "event_time": 1699564800000,
  "viewer_time": 1699564800123
}
```

**Conversion:**

```javascript
// JavaScript
const timestamp = Date.now(); // 1699564800000

// To ISO 8601
new Date(timestamp).toISOString(); // "2023-11-09T20:00:00.000Z"
```

### UUID Format

UUIDs are **version 4** (random):

```
550e8400-e29b-41d4-a716-446655440000
```

**Generation:**

```javascript
// JavaScript (using crypto API)
crypto.randomUUID();
```

### Hash Format

SHA-256 hashes are **64-character hex strings**:

```
5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

**Generation:**

```javascript
// JavaScript (using Web Crypto API)
async function hash(value, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
```

### Percentage Format

Percentages are represented as **decimal fractions** (0.0 - 1.0):

```json
{
  "rebuffer_percentage": 0.015, // 1.5%
  "completion_rate": 0.98 // 98%
}
```

### Bitrate Format

Bitrates are in **bits per second** (bps):

```json
{
  "bitrate": 2500000 // 2.5 Mbps
}
```

### Duration/Time Format

Durations are in **milliseconds**:

```json
{
  "duration": 120000, // 2 minutes
  "startup_time": 450, // 450ms
  "playing_time": 118000 // 1 minute 58 seconds
}
```

### Resolution Format

Video resolution as object:

```json
{
  "resolution": {
    "width": 1920,
    "height": 1080
  }
}
```

### Enumeration Values

Enums are **lowercase strings**:

```json
{
  "device_category": "desktop", // "desktop" | "mobile" | "tablet" | "tv"
  "stream_type": "vod", // "vod" | "live"
  "player_preload": "auto", // "none" | "metadata" | "auto"
  "error_family": "network" // "network" | "decoder" | "source" | "drm" | "business"
}
```

---

## Data Validation Rules

### Required Fields

Events **MUST** include:

- `event_type`
- `event_time`
- `viewer_time`
- `org_id`
- `player_id`
- `view_id`
- `session_id`
- `viewer_id`

### Field Constraints

| Field           | Constraint                        |
| --------------- | --------------------------------- |
| `event_type`    | Must be a valid event type string |
| `event_time`    | Unix ms timestamp, not in future  |
| `viewer_time`   | Unix ms timestamp                 |
| `playback_time` | >= 0                              |
| `org_id`        | Min length: 1, Max length: 100    |
| `player_id`     | Min length: 1, Max length: 100    |
| `view_id`       | Valid UUID v4                     |
| `session_id`    | Valid UUID v4                     |
| `viewer_id`     | Valid SHA-256 hash (64 chars)     |
| `video_title`   | Max length: 200 (truncated)       |
| `bitrate`       | >= 0                              |
| `duration`      | >= 0                              |

### Optional Fields

All context objects and `data` fields are optional, but recommended.

---

**End of Data Model Specification v1.0**
