# OpenQoE Demo Template Guide

This guide explains how to create event tester demos for all supported players.

## ✅ Completed Demos

1. **HTML5 Demo** - `examples/html5-demo/index.html`
2. **Video.js Demo** - `examples/videojs-demo/index.html`
3. **HLS.js Demo** - `examples/hlsjs-demo/index.html`
4. **Dash.js Demo** - `examples/dashjs-demo/index.html`
5. **Shaka Player Demo** - `examples/shaka-demo/index.html`

---

## Demo Structure

Each demo follows this structure:

```
examples/
├── html5-demo/
│   └── index.html          # Self-contained HTML file
├── videojs-demo/
│   └── index.html          # Self-contained HTML file
├── hlsjs-demo/
│   └── index.html          # To be created
├── dashjs-demo/
│   └── index.html          # To be created
└── shaka-demo/
    └── index.html          # To be created
```

---

## Template Pattern

All demos share the same UI and functionality:

### 1. HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
    <title>OpenQoE [PLAYER] Demo - SDK Event Tester</title>

    <!-- Player-specific CSS -->
    <link href="[PLAYER_CSS_CDN]" rel="stylesheet" />

    <!-- Inline styles (same for all demos) -->
    <style>
        /* Copy from HTML5 demo */
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎬 OpenQoE [PLAYER] Event Tester</h1>
            <p class="subtitle">Test and visualize [PLAYER] SDK events in real-time</p>
        </header>

        <!-- URL Input Section -->
        <div class="url-input-section">...</div>

        <!-- Main Content: Player + Events -->
        <div class="main-content">
            <div class="player-section">
                <!-- Player element here -->
            </div>
            <div class="events-section">
                <!-- Events display here -->
            </div>
        </div>
    </div>

    <!-- Player Library -->
    <script src="[PLAYER_JS_CDN]"></script>

    <!-- OpenQoE SDK -->
    <script src="../../sdk/dist/index.umd.js"></script>

    <!-- Demo Logic -->
    <script>
        // Initialize player
        // Initialize OpenQoE SDK
        // Intercept events
        // Display events
    </script>
</body>
</html>
```

### 2. JavaScript Pattern

```javascript
// Sample videos (player-specific formats)
const sampleVideos = [ /* MP4, HLS, DASH, etc */ ];

// Global variables
let player = null;
let qoe = null;
let eventCount = 0;
let capturedEvents = [];
let autoScroll = true;

// Initialize player (player-specific)
function initializePlayer() {
    // Create player instance
}

// Load video
function loadVideo(sampleData = null) {
    // 1. Initialize/reset player
    // 2. Clear previous SDK instance
    // 3. Determine video metadata
    // 4. Set video source
    // 5. Initialize OpenQoE SDK
    // 6. Intercept transport.send
    // 7. Attach to player
    // 8. Update UI
}

// Event display (same for all)
function addEventToLog(event) { /* ... */ }
function clearLogs() { /* ... */ }

// Stats update (player-specific API)
setInterval(() => {
    // Update current time, duration, buffer, state
}, 250);

// Video controls (player-specific API)
const videoControls = {
    play: () => { /* player-specific */ },
    pause: () => { /* player-specific */ },
    seek: (offset) => { /* player-specific */ },
    // ... other controls
};

// Keyboard shortcuts (same for all)
document.addEventListener('keydown', ...);

// Cleanup
window.addEventListener('beforeunload', ...);
```

---

## Player-Specific Configuration

### HLS.js Demo

**Library:**
```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```

**Sample Videos:**
```javascript
{
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
    id: 'apple-bipbop-hls',
    title: 'Apple BipBop HLS Stream'
}
```

**Initialization:**
```javascript
if (Hls.isSupported()) {
    player = new Hls();
    player.loadSource(url);
    player.attachMedia(video);
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
}
```

**SDK Attachment:**
```javascript
qoe.attachPlayer('hlsjs', player, {
    videoId: videoId,
    videoTitle: videoTitle
});
```

**Stats:**
```javascript
// HLS.js provides:
// - player.media.currentTime
// - player.media.duration
// - player.media.buffered
// - player.levels (quality levels)
```

---

### Dash.js Demo

**Library:**
```html
<script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
```

**Sample Videos:**
```javascript
{
    url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    id: 'bbb-dash',
    title: 'Big Buck Bunny DASH'
}
```

**Initialization:**
```javascript
player = dashjs.MediaPlayer().create();
player.initialize(video, url, false);
```

**SDK Attachment:**
```javascript
qoe.attachPlayer('dashjs', player, {
    videoId: videoId,
    videoTitle: videoTitle
});
```

**Stats:**
```javascript
// Dash.js provides:
// - video.currentTime
// - video.duration
// - player.getQualityFor('video')
// - player.getBitrateInfoListFor('video')
```

---

### Shaka Player Demo

**Library:**
```html
<script src="https://cdn.jsdelivr.net/npm/shaka-player@latest/dist/shaka-player.compiled.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@latest/dist/controls.css">
```

**Sample Videos:**
```javascript
{
    url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    id: 'shaka-dash',
    title: 'Shaka Demo DASH'
}
```

**Initialization:**
```javascript
shaka.polyfill.installAll();

if (shaka.Player.isBrowserSupported()) {
    player = new shaka.Player(video);
    player.load(url);
}
```

**SDK Attachment:**
```javascript
qoe.attachPlayer('shaka', player, {
    videoId: videoId,
    videoTitle: videoTitle
});
```

**Stats:**
```javascript
// Shaka provides:
// - video.currentTime
// - video.duration
// - player.getStats() (detailed stats object)
// - player.getVariantTracks() (quality tracks)
```

---

## Common Features Checklist

Each demo must include:

- [ ] URL input field
- [ ] Sample video quick-load buttons
- [ ] Player element
- [ ] Play/Pause/Seek controls
- [ ] Player stats display (6 cards)
- [ ] Session info display
- [ ] Real-time event log
- [ ] Clear events button
- [ ] Download JSON button
- [ ] Auto-scroll toggle
- [ ] Keyboard shortcuts (Space, Arrows, C)
- [ ] Warning banner (testing mode)
- [ ] Event counter and rate display
- [ ] Color-coded events
- [ ] Responsive layout

---

## Testing Checklist

For each demo, verify:

### Basic Functionality
- [ ] Page loads without errors
- [ ] Player initializes correctly
- [ ] Video URL can be entered
- [ ] Sample videos load successfully
- [ ] Player controls work

### SDK Events
- [ ] `playerready` fires on initialization
- [ ] `viewstart` fires on first play
- [ ] `playing` fires when video plays
- [ ] `pause` fires when video pauses
- [ ] `seek` fires on seek operations
- [ ] `heartbeat` fires periodically during playback
- [ ] `stall_start`/`stall_end` fire on buffering
- [ ] `quartile` events fire at 25%, 50%, 75%
- [ ] `ended` fires on completion
- [ ] `error` fires on simulated error

### UI Elements
- [ ] Events display in real-time
- [ ] Event count increases
- [ ] Event rate calculates correctly
- [ ] Stats update every 250ms
- [ ] Session IDs populate
- [ ] Auto-scroll works
- [ ] Clear events works
- [ ] Download JSON works
- [ ] Keyboard shortcuts work

### Edge Cases
- [ ] Invalid URL shows error
- [ ] Clearing video resets state
- [ ] Loading new video cleans up previous
- [ ] Page unload cleans up resources
- [ ] 50+ events maintain performance
- [ ] Long event data displays correctly

---

## Development Workflow

### Creating a New Demo

1. **Copy HTML5 demo as template:**
   ```bash
   cp examples/html5-demo/index.html examples/newplayer-demo/index.html
   ```

2. **Update player library references:**
   - Add CDN links for the player
   - Update player initialization code

3. **Update title and header:**
   - Change "HTML5" to "NewPlayer"
   - Update subtitle text

4. **Modify sample videos:**
   - Add formats supported by the player
   - HLS for HLS.js, DASH for Dash.js, etc.

5. **Update initialization:**
   ```javascript
   function initializePlayer() {
       // Player-specific initialization
       player = new PlayerLibrary(...);
   }
   ```

6. **Update SDK attachment:**
   ```javascript
   qoe.attachPlayer('playertype', player, {
       videoId: videoId,
       videoTitle: videoTitle
   });
   ```

7. **Update stats collection:**
   ```javascript
   // Use player-specific API
   player.getCurrentTime()  // etc
   ```

8. **Test thoroughly** against checklist above

### Testing a Demo

```bash
# 1. Build SDK
cd sdk
npm run build

# 2. Serve demo
cd ../examples/newplayer-demo
npx http-server -p 8080

# 3. Open browser
open http://localhost:8080

# 4. Run through testing checklist
```

---

## File Organization

```
examples/
├── README.md                  # Overview of all demos
├── DEMO_TEMPLATE.md          # This file - template guide
├── html5-demo/
│   └── index.html            # ✅ Complete
├── videojs-demo/
│   └── index.html            # ✅ Complete
├── hlsjs-demo/
│   └── index.html            # ✅ Complete
├── dashjs-demo/
│   └── index.html            # ✅ Complete
└── shaka-demo/
    └── index.html            # ✅ Complete
```

---

## Testing All Demos

All demos are now complete! To test them:

1. **Build the SDK** (if not already built):
   ```bash
   cd sdk
   npm install
   npm run build
   ```

2. **Test each demo individually**:
   ```bash
   # HTML5 Demo
   cd examples/html5-demo
   npx http-server -p 8080

   # Video.js Demo
   cd examples/videojs-demo
   npx http-server -p 8080

   # HLS.js Demo
   cd examples/hlsjs-demo
   npx http-server -p 8080

   # Dash.js Demo
   cd examples/dashjs-demo
   npx http-server -p 8080

   # Shaka Player Demo
   cd examples/shaka-demo
   npx http-server -p 8080
   ```

3. **Run through testing checklist** for each demo (see below)

4. **Verify consistency** across all player types

---

## Reference Implementation

All demos are complete and follow the pattern described above:

- `examples/html5-demo/index.html` - Base template for MP4 videos
- `examples/videojs-demo/index.html` - Video.js with plugins and themes
- `examples/hlsjs-demo/index.html` - HLS.js for adaptive HLS streaming
- `examples/dashjs-demo/index.html` - Dash.js for MPEG-DASH streaming
- `examples/shaka-demo/index.html` - Shaka Player for DASH/HLS with DRM support

Each demo:
- Uses the same UI/UX pattern
- Captures events locally without backend
- Displays real-time event visualization
- Supports keyboard shortcuts
- Provides JSON export functionality
- Auto-loads sample videos on page load
