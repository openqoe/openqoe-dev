# OpenQoE SDK Examples

This directory contains demo applications for testing the OpenQoE SDK with different video players.

## Available Demos

### 1. Dash.js Demo (`dashjs-demo/`)
✅ **Complete** - Production ready for OpenQoE v2

**Features:**
- Full v2 event coverage (24+ events)
- Adaptive bitrate tracking
- OTLP integration testing
- Real-time buffer metrics

**Run:**
```bash
cd examples/dashjs-demo
npx http-server -p 8080
```

### 2. Other Player Demos
🏗️ **Work in Progress** - Core v2 compatibility pending

The following demos are being updated for v2.0.0 architecture:
- **HTML5 Demo** (`html5-demo/`)
- **Video.js Demo** (`videojs-demo/`)
- **HLS.js Demo** (`hlsjs-demo/`)
- **Shaka Player Demo** (`shaka-demo/`)

## Demo Features (All Players)

All demos include:

- ✅ **URL Input** - Load any video/stream URL
- ✅ **Sample URLs** - Quick-load common test videos
- ✅ **Event Display** - Real-time SDK event capture
- ✅ **Session Info** - View/Session/Viewer IDs
- ✅ **Stats Dashboard** - Player metrics
- ✅ **Download Events** - Export as JSON
- ✅ **No Ingestion** - Local testing only
- ✅ **Responsive UI** - Works on all screen sizes

## Sample Video URLs

### MP4 (for HTML5, Video.js)
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4
```

### HLS Streams (for HLS.js, Video.js, Shaka)
```
https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8
https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8
```

### DASH Streams (for Dash.js, Shaka)
```
https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd
https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd
https://dash.akamaized.net/dash264/TestCases/1c/qualcomm/2/MultiRate.mpd
```

## Creating New Demos

To create a new player demo:

1. **Copy HTML5 demo as template:**
   ```bash
   cp -r examples/html5-demo examples/my-player-demo
   cd examples/my-player-demo
   ```

2. **Add player library:**
   ```html
   <!-- In index.html, before OpenQoE SDK -->
   <script src="https://cdn.example.com/player.js"></script>
   ```

3. **Update SDK initialization:**
   ```javascript
   qoe.attachPlayer('your-player-type', playerInstance, {
       videoId: videoId,
       videoTitle: videoTitle
   });
   ```

4. **Test the demo:**
   ```bash
   npx http-server -p 8080
   ```

## Usage Guidelines

### For Testing SDK Integration

1. Open the demo in a browser
2. Load a video URL
3. Play the video
4. Observe events in real-time
5. Verify all expected events are captured:
   - `playerready` - Player initialized
   - `viewstart` - View started
   - `playing` - Video started playing
   - `pause` - Video paused
   - `seek` - User seeked
   - `stall_start` / `stall_end` - Buffering
   - `heartbeat` - Periodic updates
   - `quartile` - 25%, 50%, 75% completion
   - `ended` - Video completed
   - `error` - Any errors

6. Download events as JSON for analysis

### For Integration Examples

Developers can use these demos as:
- Reference implementation
- SDK integration guide
- Testing playground
- Event structure examples

## Keyboard Shortcuts (All Demos)

- **Space** - Play/Pause
- **Arrow Left** - Seek backward 10s
- **Arrow Right** - Seek forward 30s
- **C** - Clear events log

## Technical Architecture

```
┌─────────────────┐
│   Video Player  │ (Dash.js / HTML5 / etc)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Player Adapter │ (DashjsAdapter, etc)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenQoE SDK    │ (Event Collection & Transport)
└────────┬────────┘
         │ POST /v2/events
         ▼
┌─────────────────┐
│  Go Worker      │ (Ingestion & OTLP Export)
└────────┬────────┘
         │ OTLP
         ▼
┌─────────────────┐
│ Grafana Alloy   │ (Collector / Processor)
└─────────────────┘
```

## Development

### Building SDK

Before testing demos, build the SDK:

```bash
cd sdk
npm install
npm run build
```

The demos use the built SDK from `sdk/dist/index.umd.js`.

### Hot Reload

For SDK development with live reload:

1. Terminal 1 - Build SDK in watch mode:
   ```bash
   cd sdk
   npm run build -- --watch
   ```

2. Terminal 2 - Serve demo:
   ```bash
   cd examples/html5-demo
   npx http-server -p 8080
   ```

3. Make changes to SDK, refresh browser to test

### Testing Checklist

For each demo, verify:

- [ ] Video loads successfully
- [ ] `playerready` event fires on load
- [ ] `viewstart` event fires on first play
- [ ] `playing` event fires
- [ ] `pause` event fires
- [ ] `seek` event fires on seek
- [ ] `heartbeat` events fire every ~10s during playback
- [ ] `quartile` events fire at 25%, 50%, 75%
- [ ] `ended` event fires on completion
- [ ] `error` event fires on simulated error
- [ ] Session IDs are generated and displayed
- [ ] All event data is complete and valid
- [ ] Download JSON contains all captured events

## Troubleshooting

### SDK Not Loading

```bash
# Rebuild SDK
cd sdk && npm run build

# Check dist folder exists
ls -la sdk/dist/
```

### Events Not Displaying

- Open browser console (F12)
- Check for JavaScript errors
- Verify SDK is loaded: `window.OpenQoE`
- Check event interception code is working

### Player Not Loading

- Check CDN links are accessible
- Verify CORS settings for video URLs
- Try different sample videos
- Check browser console for errors

## Contributing

To add a new demo:

1. Create directory: `examples/new-player-demo/`
2. Copy HTML5 demo as base
3. Update player-specific code
4. Add sample URLs for that player
5. Test thoroughly
6. Update this README
7. Submit PR

## License

MIT - Same as OpenQoE SDK
