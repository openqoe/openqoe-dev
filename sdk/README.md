# OpenQoE SDK

JavaScript/TypeScript SDK for video QoE (Quality of Experience) and QoS (Quality of Service) monitoring.

## Features

- **Multi-Player Support**: HTML5, Video.js, HLS.js, dash.js, Shaka Player
- **Comprehensive Event Tracking**: Lifecycle events, playback events, errors, quartiles, heartbeats
- **Privacy-First**: SHA-256 hashing with configurable salt, no raw PII
- **Offline Support**: localStorage-backed queue with retry logic
- **Lightweight**: ~8-10KB gzipped
- **TypeScript**: Full type definitions included

## Installation

```bash
npm install @openqoe/core
```

## Quick Start

### HTML5 Video

```typescript
import { OpenQoE } from '@openqoe/core';

const qoe = new OpenQoE({
  orgId: 'your-org-id',
  playerId: 'your-player-id',
  endpointUrl: 'https://your-ingest-endpoint.com/events'
});

const videoElement = document.querySelector('video');

qoe.attachPlayer('html5', videoElement, {
  videoId: 'video-123',
  videoTitle: 'My Video',
  duration: 120
});
```

### Video.js

```typescript
import { OpenQoE } from '@openqoe/core';
import videojs from 'video.js';

const qoe = new OpenQoE({
  orgId: 'your-org-id',
  playerId: 'your-player-id',
  endpointUrl: 'https://your-ingest-endpoint.com/events'
});

const player = videojs('my-video');

qoe.attachPlayer('videojs', player, {
  videoId: 'video-123',
  videoTitle: 'My Video'
});
```

### HLS.js

```typescript
import { OpenQoE } from '@openqoe/core';
import Hls from 'hls.js';

const qoe = new OpenQoE({
  orgId: 'your-org-id',
  playerId: 'your-player-id',
  endpointUrl: 'https://your-ingest-endpoint.com/events'
});

const video = document.querySelector('video');
const hls = new Hls();
hls.loadSource('https://example.com/video.m3u8');
hls.attachMedia(video);

qoe.attachPlayer('hlsjs', hls, {
  videoId: 'video-123',
  videoTitle: 'My Video'
});
```

### dash.js

```typescript
import { OpenQoE } from '@openqoe/core';
import dashjs from 'dashjs';

const qoe = new OpenQoE({
  orgId: 'your-org-id',
  playerId: 'your-player-id',
  endpointUrl: 'https://your-ingest-endpoint.com/events'
});

const video = document.querySelector('video');
const player = dashjs.MediaPlayer().create();
player.initialize(video, 'https://example.com/video.mpd', true);

qoe.attachPlayer('dashjs', player, {
  videoId: 'video-123',
  videoTitle: 'My Video'
});
```

### Shaka Player

```typescript
import { OpenQoE } from '@openqoe/core';
import shaka from 'shaka-player';

const qoe = new OpenQoE({
  orgId: 'your-org-id',
  playerId: 'your-player-id',
  endpointUrl: 'https://your-ingest-endpoint.com/events'
});

const video = document.querySelector('video');
const player = new shaka.Player(video);
await player.load('https://example.com/video.mpd');

qoe.attachPlayer('shaka', player, {
  videoId: 'video-123',
  videoTitle: 'My Video'
});
```

## Configuration

```typescript
interface OpenQoEConfig {
  // Required
  orgId: string;              // Organization ID
  playerId: string;           // Player/Site ID
  endpointUrl: string;        // Ingest endpoint URL

  // Optional
  env?: 'prod' | 'staging' | 'dev';  // Environment (default: 'prod')
  appName?: string;                   // Application name
  appVersion?: string;                // Application version
  samplingRate?: number;              // 0.0 - 1.0 (default: 1.0)
  enablePII?: boolean;                // Enable PII (default: false)
  hashSalt?: string;                  // Custom salt for hashing
  batchSize?: number;                 // Events per batch (default: 10)
  batchInterval?: number;             // Batch interval in ms (default: 5000)
  maxQueueSize?: number;              // Max offline queue size (default: 100)
  debug?: boolean;                    // Enable debug logging
  logLevel?: 'error' | 'warn' | 'info' | 'debug';  // Log level
}
```

## Video Metadata

```typescript
interface VideoMetadata {
  videoId?: string;          // Unique video ID
  videoTitle?: string;       // Video title
  videoSeries?: string;      // Series/show name
  duration?: number;         // Duration in seconds
  sourceUrl?: string;        // Source URL (will be sanitized)
  customData?: Record<string, any>;  // Custom metadata
}
```

## API Methods

### `attachPlayer(playerType, player, metadata?)`

Attach a player for tracking.

```typescript
qoe.attachPlayer('html5', videoElement, {
  videoId: 'video-123',
  videoTitle: 'My Video'
});
```

### `trackEvent(eventType, data?)`

Track a custom event manually.

```typescript
await qoe.trackEvent('custom_event', {
  action: 'button_click',
  label: 'play_button'
});
```

### `startSession()`

Start a new session manually.

```typescript
const sessionId = qoe.startSession();
```

### `endSession()`

End the current session and flush events.

```typescript
qoe.endSession();
```

### `getSessionId()`

Get the current session ID.

```typescript
const sessionId = qoe.getSessionId();
```

### `getViewId()`

Get the current view ID.

```typescript
const viewId = qoe.getViewId();
```

### `destroy()`

Destroy the SDK instance and clean up.

```typescript
qoe.destroy();
```

## Events Tracked

- **playerready**: Player initialized
- **viewstart**: Video load started
- **playing**: Video playback started
- **pause**: Video paused
- **seek**: User seeked
- **stall_start**: Buffering started
- **stall_end**: Buffering ended
- **qualitychange**: Quality level changed (adaptive streaming)
- **quartile**: 25%, 50%, 75%, 100% progress
- **heartbeat**: Periodic update (every 10s during playback)
- **ended**: Video completed
- **error**: Playback error

## Privacy

The SDK is privacy-first:

- All PII (IP addresses, user agents) are hashed with SHA-256
- Custom salt per organization
- URL sanitization (removes query params and hashes)
- Configurable PII controls

## License

MIT
