# openqoe-core SDK Integration Guide

**Version:** 1.0
**Last Updated:** 2025-11-04

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [HTML5 Integration](#html5-integration)
4. [Video.js Integration](#videojs-integration)
5. [HLS.js Integration](#hlsjs-integration)
6. [dash.js Integration](#dashjs-integration)
7. [Shaka Player Integration](#shaka-player-integration)
8. [Configuration Options](#configuration-options)
9. [Advanced Usage](#advanced-usage)
10. [Troubleshooting](#troubleshooting)

---

## Installation

### NPM

```bash
npm install @openqoe/core
```

### Yarn

```bash
yarn add @openqoe/core
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@openqoe/core@1.0.0/dist/openqoe.min.js"></script>
```

---

## Quick Start

### Minimal Example

```javascript
import { OpenQoE } from '@openqoe/core';

// 1. Initialize SDK
const qoe = new OpenQoE({
  orgId: 'org_abc123',
  playerId: 'player_xyz789',
  endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
});

// 2. Attach to player
const video = document.querySelector('video');
qoe.attachPlayer('html5', video, {
  videoId: 'video_123',
  videoTitle: 'Sample Video'
});

// 3. Player will now automatically track QoE metrics!
```

---

## HTML5 Integration

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>HTML5 Video with openqoe-core</title>
</head>
<body>
  <!-- Video Element -->
  <video id="my-video" controls width="640" height="360">
    <source src="https://cdn.example.com/video.mp4" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>

  <!-- SDK Script -->
  <script type="module">
    import { OpenQoE } from '@openqoe/core';

    // Initialize SDK
    const qoe = new OpenQoE({
      orgId: 'your-org-id',
      playerId: 'your-player-id',
      endpointUrl: 'https://ingest.openqoe.example.com/v1/events',
      env: 'prod',
      appName: 'MyVideoSite',
      appVersion: '1.0.0'
    });

    // Get video element
    const video = document.getElementById('my-video');

    // Attach SDK
    qoe.attachPlayer('html5', video, {
      videoId: 'video_001',
      videoTitle: 'Introduction to HTML5 Video',
      videoSeries: 'Tutorial Series'
    });
  </script>
</body>
</html>
```

### React Example

```jsx
import React, { useEffect, useRef } from 'react';
import { OpenQoE } from '@openqoe/core';

function VideoPlayer({ videoId, videoTitle, videoUrl }) {
  const videoRef = useRef(null);
  const qoeRef = useRef(null);

  useEffect(() => {
    // Initialize SDK once
    if (!qoeRef.current) {
      qoeRef.current = new OpenQoE({
        orgId: process.env.REACT_APP_QOE_ORG_ID,
        playerId: process.env.REACT_APP_QOE_PLAYER_ID,
        endpointUrl: process.env.REACT_APP_QOE_ENDPOINT,
        env: process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
      });
    }

    // Attach to video element
    if (videoRef.current) {
      qoeRef.current.attachPlayer('html5', videoRef.current, {
        videoId,
        videoTitle
      });
    }

    // Cleanup
    return () => {
      qoeRef.current?.destroy();
    };
  }, [videoId, videoTitle]);

  return (
    <video ref={videoRef} controls width="100%">
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}

export default VideoPlayer;
```

### Vue.js Example

```vue
<template>
  <video ref="videoElement" controls width="640" height="360">
    <source :src="videoUrl" type="video/mp4">
  </video>
</template>

<script>
import { OpenQoE } from '@openqoe/core';

export default {
  name: 'VideoPlayer',
  props: {
    videoId: String,
    videoTitle: String,
    videoUrl: String
  },
  data() {
    return {
      qoe: null
    };
  },
  mounted() {
    // Initialize SDK
    this.qoe = new OpenQoE({
      orgId: process.env.VUE_APP_QOE_ORG_ID,
      playerId: process.env.VUE_APP_QOE_PLAYER_ID,
      endpointUrl: process.env.VUE_APP_QOE_ENDPOINT
    });

    // Attach to video
    this.qoe.attachPlayer('html5', this.$refs.videoElement, {
      videoId: this.videoId,
      videoTitle: this.videoTitle
    });
  },
  beforeUnmount() {
    this.qoe?.destroy();
  }
};
</script>
```

---

## Video.js Integration

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>Video.js with openqoe-core</title>
  <link href="https://vjs.zencdn.net/8.6.1/video-js.css" rel="stylesheet" />
</head>
<body>
  <!-- Video.js Element -->
  <video id="my-video" class="video-js" controls preload="auto" width="640" height="264">
    <source src="https://cdn.example.com/video.mp4" type="video/mp4">
  </video>

  <!-- Video.js Library -->
  <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>

  <!-- openqoe-core SDK -->
  <script type="module">
    import { OpenQoE } from '@openqoe/core';

    // Initialize Video.js
    const player = videojs('my-video', {
      autoplay: false,
      controls: true,
      preload: 'auto'
    });

    // Initialize openqoe-core SDK
    const qoe = new OpenQoE({
      orgId: 'your-org-id',
      playerId: 'your-player-id',
      endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
    });

    // Attach SDK to Video.js player
    qoe.attachPlayer('videojs', player, {
      videoId: 'video_002',
      videoTitle: 'Video.js Demo',
      duration: 180000  // 3 minutes
    });

    // Optional: Listen for player ready
    player.ready(function() {
      console.log('Player is ready, QoE tracking enabled');
    });
  </script>
</body>
</html>
```

### React + Video.js Example

```jsx
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { OpenQoE } from '@openqoe/core';

function VideoJsPlayer({ videoId, videoTitle, videoUrl }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const qoeRef = useRef(null);

  useEffect(() => {
    // Initialize Video.js
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        sources: [{
          src: videoUrl,
          type: 'video/mp4'
        }]
      });
    }

    // Initialize openqoe-core
    if (!qoeRef.current) {
      qoeRef.current = new OpenQoE({
        orgId: process.env.REACT_APP_QOE_ORG_ID,
        playerId: process.env.REACT_APP_QOE_PLAYER_ID,
        endpointUrl: process.env.REACT_APP_QOE_ENDPOINT
      });
    }

    // Attach QoE tracking
    qoeRef.current.attachPlayer('videojs', playerRef.current, {
      videoId,
      videoTitle
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      if (qoeRef.current) {
        qoeRef.current.destroy();
        qoeRef.current = null;
      }
    };
  }, [videoId, videoTitle, videoUrl]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}

export default VideoJsPlayer;
```

---

## HLS.js Integration

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>HLS.js with openqoe-core</title>
</head>
<body>
  <video id="video" controls width="640" height="360"></video>

  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <script type="module">
    import { OpenQoE } from '@openqoe/core';

    const video = document.getElementById('video');
    const videoUrl = 'https://cdn.example.com/stream.m3u8';

    // Initialize HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      // Initialize openqoe-core
      const qoe = new OpenQoE({
        orgId: 'your-org-id',
        playerId: 'your-player-id',
        endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
      });

      // Attach SDK to HLS.js
      qoe.attachPlayer('hlsjs', hls, {
        videoId: 'video_003',
        videoTitle: 'HLS.js Livestream',
        videoSeries: 'Live Events'
      });

      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        console.log('HLS manifest loaded, QoE tracking active');
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = videoUrl;

      const qoe = new OpenQoE({
        orgId: 'your-org-id',
        playerId: 'your-player-id',
        endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
      });

      // Fallback to HTML5 adapter
      qoe.attachPlayer('html5', video, {
        videoId: 'video_003',
        videoTitle: 'HLS.js Livestream'
      });
    }
  </script>
</body>
</html>
```

### React + HLS.js Example

```jsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { OpenQoE } from '@openqoe/core';

function HlsPlayer({ videoId, videoTitle, hlsUrl }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const qoeRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      // Initialize HLS.js
      hlsRef.current = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 30,
        maxMaxBufferLength: 60
      });

      hlsRef.current.loadSource(hlsUrl);
      hlsRef.current.attachMedia(video);

      // Initialize openqoe-core
      qoeRef.current = new OpenQoE({
        orgId: process.env.REACT_APP_QOE_ORG_ID,
        playerId: process.env.REACT_APP_QOE_PLAYER_ID,
        endpointUrl: process.env.REACT_APP_QOE_ENDPOINT
      });

      // Attach QoE tracking to HLS.js
      qoeRef.current.attachPlayer('hlsjs', hlsRef.current, {
        videoId,
        videoTitle
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = hlsUrl;

      qoeRef.current = new OpenQoE({
        orgId: process.env.REACT_APP_QOE_ORG_ID,
        playerId: process.env.REACT_APP_QOE_PLAYER_ID,
        endpointUrl: process.env.REACT_APP_QOE_ENDPOINT
      });

      qoeRef.current.attachPlayer('html5', video, {
        videoId,
        videoTitle
      });
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (qoeRef.current) {
        qoeRef.current.destroy();
      }
    };
  }, [videoId, videoTitle, hlsUrl]);

  return (
    <video ref={videoRef} controls width="100%" />
  );
}

export default HlsPlayer;
```

---

## dash.js Integration

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>dash.js with openqoe-core</title>
</head>
<body>
  <video id="video" controls width="640" height="360"></video>

  <script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
  <script type="module">
    import { OpenQoE } from '@openqoe/core';

    const video = document.getElementById('video');
    const url = 'https://cdn.example.com/stream.mpd';

    // Initialize dash.js
    const player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);

    // Configure dash.js
    player.updateSettings({
      streaming: {
        bufferTimeAtTopQuality: 30,
        bufferTimeAtTopQualityLongForm: 60
      }
    });

    // Initialize openqoe-core
    const qoe = new OpenQoE({
      orgId: 'your-org-id',
      playerId: 'your-player-id',
      endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
    });

    // Attach SDK to dash.js
    qoe.attachPlayer('dashjs', player, {
      videoId: 'video_004',
      videoTitle: 'DASH Stream',
      videoSeries: 'VOD Content'
    });

    console.log('dash.js player ready with QoE tracking');
  </script>
</body>
</html>
```

### React + dash.js Example

```jsx
import React, { useEffect, useRef } from 'react';
import dashjs from 'dashjs';
import { OpenQoE } from '@openqoe/core';

function DashPlayer({ videoId, videoTitle, dashUrl }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const qoeRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Initialize dash.js
    playerRef.current = dashjs.MediaPlayer().create();
    playerRef.current.initialize(video, dashUrl, true);

    // Configure dash.js
    playerRef.current.updateSettings({
      streaming: {
        bufferTimeAtTopQuality: 30,
        bufferTimeAtTopQualityLongForm: 60,
        abr: {
          autoSwitchBitrate: {
            video: true
          }
        }
      }
    });

    // Initialize openqoe-core
    qoeRef.current = new OpenQoE({
      orgId: process.env.REACT_APP_QOE_ORG_ID,
      playerId: process.env.REACT_APP_QOE_PLAYER_ID,
      endpointUrl: process.env.REACT_APP_QOE_ENDPOINT
    });

    // Attach QoE tracking
    qoeRef.current.attachPlayer('dashjs', playerRef.current, {
      videoId,
      videoTitle
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (qoeRef.current) {
        qoeRef.current.destroy();
      }
    };
  }, [videoId, videoTitle, dashUrl]);

  return (
    <video ref={videoRef} controls width="100%" />
  );
}

export default DashPlayer;
```

---

## Shaka Player Integration

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>Shaka Player with openqoe-core</title>
</head>
<body>
  <video id="video" controls width="640" height="360"></video>

  <script src="https://cdn.jsdelivr.net/npm/shaka-player@latest/dist/shaka-player.compiled.js"></script>
  <script type="module">
    import { OpenQoE } from '@openqoe/core';

    // Install polyfills
    shaka.polyfill.installAll();

    const video = document.getElementById('video');
    const manifestUri = 'https://cdn.example.com/stream.mpd';

    // Check browser support
    if (shaka.Player.isBrowserSupported()) {
      // Initialize Shaka Player
      const player = new shaka.Player(video);

      // Configure Shaka
      player.configure({
        abr: {
          enabled: true
        },
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2
        }
      });

      // Initialize openqoe-core
      const qoe = new OpenQoE({
        orgId: 'your-org-id',
        playerId: 'your-player-id',
        endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
      });

      // Attach SDK to Shaka Player
      qoe.attachPlayer('shaka', player, {
        videoId: 'video_005',
        videoTitle: 'Shaka Player Demo',
        duration: 240000  // 4 minutes
      });

      // Load manifest
      player.load(manifestUri).then(function() {
        console.log('Shaka Player loaded with QoE tracking');
      }).catch(function(error) {
        console.error('Error loading manifest:', error);
      });

    } else {
      console.error('Browser not supported');
    }
  </script>
</body>
</html>
```

### React + Shaka Player Example

```jsx
import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled';
import { OpenQoE } from '@openqoe/core';

function ShakaPlayer({ videoId, videoTitle, manifestUrl }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const qoeRef = useRef(null);

  useEffect(() => {
    // Install polyfills
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
      const video = videoRef.current;

      // Initialize Shaka Player
      playerRef.current = new shaka.Player(video);

      // Configure Shaka
      playerRef.current.configure({
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 1000000
        },
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
          bufferBehind: 30
        }
      });

      // Initialize openqoe-core
      qoeRef.current = new OpenQoE({
        orgId: process.env.REACT_APP_QOE_ORG_ID,
        playerId: process.env.REACT_APP_QOE_PLAYER_ID,
        endpointUrl: process.env.REACT_APP_QOE_ENDPOINT
      });

      // Attach QoE tracking
      qoeRef.current.attachPlayer('shaka', playerRef.current, {
        videoId,
        videoTitle
      });

      // Load manifest
      playerRef.current.load(manifestUrl).catch(error => {
        console.error('Error loading manifest:', error);
      });
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (qoeRef.current) {
        qoeRef.current.destroy();
      }
    };
  }, [videoId, videoTitle, manifestUrl]);

  return (
    <video ref={videoRef} controls width="100%" />
  );
}

export default ShakaPlayer;
```

---

## Configuration Options

### Full Configuration

```javascript
const qoe = new OpenQoE({
  // Required
  orgId: 'org_abc123',              // Organization ID
  playerId: 'player_xyz789',        // Player instance ID
  endpointUrl: 'https://ingest.openqoe.example.com/v1/events',

  // Optional - Environment
  env: 'prod',                      // 'dev' | 'staging' | 'prod'
  appName: 'MyVideoApp',            // Application name
  appVersion: '2.1.0',              // Application version

  // Optional - Sampling
  samplingRate: 1.0,                // 0.0 - 1.0 (default: 1.0 = 100%)

  // Optional - Privacy
  enablePII: false,                 // Enable PII collection (default: false)
  hashSalt: 'your-org-salt',        // Per-org salt for hashing

  // Optional - Performance
  batchSize: 10,                    // Events per batch (default: 10)
  batchInterval: 5000,              // Batch flush interval ms (default: 5000)
  maxQueueSize: 100,                // Max offline queue (default: 100)

  // Optional - Debugging
  debug: false,                     // Enable console logging (default: false)
  logLevel: 'warn'                  // 'error' | 'warn' | 'info' | 'debug'
});
```

### Video Metadata

```javascript
qoe.attachPlayer('html5', videoElement, {
  // Required
  videoId: 'video_123',             // Unique video identifier

  // Optional
  videoTitle: 'Sample Video',       // Video title
  videoSeries: 'Season 1',          // Series name
  duration: 120000,                 // Duration in ms

  // Optional - Custom dimensions
  customDimensions: {
    custom_1: 'premium',            // Custom dimension 1
    custom_2: 'sports',             // Custom dimension 2
    custom_3: 'live'                // Custom dimension 3
  }
});
```

---

## Advanced Usage

### Manual Event Tracking

```javascript
// Track custom business events
qoe.trackEvent('subscription_prompt_shown', {
  plan: 'premium',
  price: 9.99,
  location: 'mid_roll'
});

// Track custom errors
qoe.trackEvent('error', {
  error_family: 'business',
  error_code: 'SUBSCRIPTION_REQUIRED',
  error_message: 'Premium content requires active subscription'
});
```

### Session Management

```javascript
// Manually start a new session
const sessionId = qoe.startSession();
console.log('Session started:', sessionId);

// End the current session
qoe.endSession();

// Get current session info
const currentSessionId = qoe.getSessionId();
const currentViewId = qoe.getViewId();
```

### Sampling Control

```javascript
// Set sampling rate dynamically
const qoe = new OpenQoE({
  orgId: 'org_abc123',
  playerId: 'player_xyz789',
  endpointUrl: 'https://ingest.openqoe.example.com/v1/events',
  samplingRate: 0.1  // 10% sampling
});

// For A/B testing:
const isInTestGroup = Math.random() < 0.5;
const samplingRate = isInTestGroup ? 1.0 : 0.1;

const qoe = new OpenQoE({
  // ...
  samplingRate
});
```

### Custom Dimensions

```javascript
qoe.attachPlayer('videojs', player, {
  videoId: 'video_123',
  videoTitle: 'Premium Content',
  customDimensions: {
    custom_1: 'premium_tier',      // Subscription tier
    custom_2: 'sports',            // Content category
    custom_3: 'live',              // Content type
    custom_4: 'featured',          // Placement
    custom_5: 'campaign_abc'       // Marketing campaign
  }
});
```

### Error Handling

```javascript
const qoe = new OpenQoE({
  orgId: 'org_abc123',
  playerId: 'player_xyz789',
  endpointUrl: 'https://ingest.openqoe.example.com/v1/events',
  debug: true,  // Enable debug logging
  logLevel: 'debug'
});

// Listen for SDK errors (if available)
qoe.on('error', (error) => {
  console.error('QoE SDK error:', error);
});

// Listen for ingest failures (if available)
qoe.on('ingest_failure', (batch, error) => {
  console.warn('Failed to send batch:', batch, error);
});
```

### Multi-Video Support

```javascript
// Same SDK instance, multiple players
const qoe = new OpenQoE({
  orgId: 'org_abc123',
  playerId: 'player_xyz789',
  endpointUrl: 'https://ingest.openqoe.example.com/v1/events'
});

// Player 1
const video1 = document.getElementById('video-1');
qoe.attachPlayer('html5', video1, {
  videoId: 'video_001',
  videoTitle: 'Video 1'
});

// Player 2
const video2 = document.getElementById('video-2');
qoe.attachPlayer('html5', video2, {
  videoId: 'video_002',
  videoTitle: 'Video 2'
});
```

---

## Troubleshooting

### Events Not Appearing

**Problem:** Events are not showing up in Loki/Grafana.

**Checklist:**
1. Verify `orgId` and `playerId` are correct
2. Check `endpointUrl` is reachable
3. Verify API token is valid (if required)
4. Check browser console for errors
5. Enable debug mode: `debug: true, logLevel: 'debug'`
6. Check network tab for failed requests
7. Verify Go Worker is running

**Debug:**
```javascript
const qoe = new OpenQoE({
  // ...
  debug: true,
  logLevel: 'debug'
});
```

---

### High Data Usage

**Problem:** SDK is sending too much data.

**Solutions:**
1. Reduce sampling rate:
   ```javascript
   samplingRate: 0.1  // 10% sampling
   ```
2. Increase batch interval:
   ```javascript
   batchInterval: 10000  // 10 seconds
   ```
3. Increase batch size:
   ```javascript
   batchSize: 20  // 20 events per batch
   ```

---

### CORS Errors

**Problem:** Browser blocks requests to ingest endpoint.

**Solution:**
Ensure Go Worker returns proper CORS headers:
```javascript
// Worker should include:
{
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Token'
}
```

---

### Player Not Detected

**Problem:** SDK not capturing player events.

**Checklist:**
1. Verify player is initialized before `attachPlayer()`
2. Check player type matches actual player ('html5', 'videojs', etc.)
3. Ensure player instance is passed correctly
4. Check for player version compatibility

**Example (correct order):**
```javascript
// ❌ Wrong: SDK attached before player ready
const player = videojs('my-video');
qoe.attachPlayer('videojs', player, { videoId: 'abc' });

// ✅ Correct: Wait for player ready
const player = videojs('my-video');
player.ready(function() {
  qoe.attachPlayer('videojs', player, { videoId: 'abc' });
});
```

---

### Bundle Size Too Large

**Problem:** SDK bundle is too large for your use case.

**Solution:**
Import only the adapter you need:
```javascript
// Instead of full bundle:
// import { OpenQoE } from '@openqoe/core';

// Import specific adapter:
import { OpenQoE } from '@openqoe/core/html5';
// or
import { OpenQoE } from '@openqoe/core/hlsjs';
```

---

### Memory Leaks

**Problem:** Memory usage increases over time.

**Solution:**
Always call `destroy()` when done:
```javascript
// React useEffect cleanup
useEffect(() => {
  const qoe = new OpenQoE({ /* ... */ });
  qoe.attachPlayer('html5', videoRef.current, { /* ... */ });

  return () => {
    qoe.destroy();  // ✅ Clean up
  };
}, []);
```

---

## Best Practices

### 1. Initialize Once

```javascript
// ✅ Good: Initialize once per app
const qoe = new OpenQoE({ /* ... */ });

// Reuse for multiple videos
qoe.attachPlayer('html5', video1, { videoId: 'video_1' });
qoe.attachPlayer('html5', video2, { videoId: 'video_2' });
```

### 2. Use Environment Variables

```javascript
// ✅ Good: Store config in env vars
const qoe = new OpenQoE({
  orgId: process.env.REACT_APP_QOE_ORG_ID,
  playerId: process.env.REACT_APP_QOE_PLAYER_ID,
  endpointUrl: process.env.REACT_APP_QOE_ENDPOINT,
  env: process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
});
```

### 3. Handle Player Ready

```javascript
// ✅ Good: Wait for player ready
player.ready(() => {
  qoe.attachPlayer('videojs', player, { /* ... */ });
});
```

### 4. Clean Up Resources

```javascript
// ✅ Good: Always clean up
componentWillUnmount() {
  this.qoe?.destroy();
}
```

### 5. Use Sampling in Dev/Staging

```javascript
// ✅ Good: Reduce data in non-prod
const samplingRate = process.env.NODE_ENV === 'production' ? 1.0 : 0.1;

const qoe = new OpenQoE({
  // ...
  samplingRate
});
```

---

**End of SDK Integration Guide v1.0**
