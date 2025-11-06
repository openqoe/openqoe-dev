# OpenQoE

**Open-Source Video Quality of Experience (QoE) Monitoring Platform**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](docs/production-ready.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/contributing.md)

> **Production-grade video quality monitoring for web video players with comprehensive business and technical metrics, accurate percentile calculations, and real-time alerting.**

> **This project needs acrtive contribution from the experts in video tech, players and opensource developers. Let's build it together**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Deployment Options](#deployment-options)
- [Metrics & Dashboards](#metrics--dashboards)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

OpenQoE is a complete, production-ready observability platform for video streaming that helps you:

- **Monitor Quality**: Track video startup time, rebuffering, errors, and playback quality
- **Understand Engagement**: Measure watch time, completion rates, and viewer behavior
- **Optimize Performance**: Identify bottlenecks with P50/P95/P99 percentile analysis
- **Alert Proactively**: Get notified when quality degrades or business metrics drop
- **Scale Globally**: Deploy on Cloudflare's edge network or self-host

### What's Included

| Component | Description | Status |
|-----------|-------------|--------|
| **JavaScript SDK** | 5 player adapters capturing 12 event types | ✅ Production Ready |
| **Cloudflare Worker** | Edge ingestion with validation & routing | ✅ Production Ready |
| **Grafana Dashboards** | 4 comprehensive dashboards (58 panels total) | ✅ Production Ready |
| **Recording Rules** | 25 pre-aggregated metrics for performance | ✅ Production Ready |
| **Alert Rules** | 18 production-ready alerts | ✅ Production Ready |
| **Docker Stack** | Self-hosted Mimir + Loki + Grafana | ✅ Production Ready |

---

## ✨ Features

### SDK Capabilities

- ✅ **Multi-Player Support**: HTML5, Video.js, HLS.js, dash.js, Shaka Player
- ✅ **Comprehensive Events**: 12 event types with full context capture
- ✅ **Privacy-First**: SHA-256 hashing, configurable PII controls
- ✅ **Offline Support**: LocalStorage-backed queue with exponential backoff retry
- ✅ **Lightweight**: ~10KB gzipped per adapter
- ✅ **TypeScript**: Full type definitions included
- ✅ **Framework Agnostic**: Works with React, Vue, Angular, vanilla JS

### Worker Features

- ✅ **Histogram Metrics**: Accurate P50/P95/P99 percentile calculations
- ✅ **Dual Destinations**: Self-hosted (Mimir/Loki) or Grafana Cloud
- ✅ **Authentication**: Secure header-based API key auth
- ✅ **Validation**: Comprehensive event schema validation with whitelisting
- ✅ **Cardinality Governance**: Automatic high-cardinality dimension management
- ✅ **Timeout Protection**: 10-second timeout on all HTTP requests
- ✅ **Configuration Validation**: Fails fast with clear error messages
- ✅ **Edge Deployment**: Runs on Cloudflare's global network

### Observability Stack

- ✅ **4 Production Dashboards**: VOD, Live Streaming, Quality & Delivery, Impact Explorer
- ✅ **58 Dashboard Panels**: Comprehensive business + technical coverage
- ✅ **25 Recording Rules**: Pre-aggregated metrics for 10-50x faster queries
- ✅ **18 Alert Rules**: Critical quality, business impact, performance, live streaming alerts
- ✅ **Histogram Support**: Accurate percentile calculations (not approximations)
- ✅ **Multi-Tenancy**: Full Grafana Cloud support with X-Scope-OrgID header
- ✅ **Self-Hosted**: Complete Docker Compose stack included

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Your Application                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ HTML5   │  │Video.js │  │ HLS.js  │  │dash.js/ │    │
│  │ Player  │  │ Player  │  │ Player  │  │  Shaka  │    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │
│       └────────────┴─────────────┴────────────┘          │
│                         │                                 │
│                 ┌───────▼────────┐                       │
│                 │  OpenQoE SDK   │                       │
│                 │  (12 events)   │                       │
│                 └───────┬────────┘                       │
└─────────────────────────┼──────────────────────────────┘
                          │ HTTPS POST /v1/events
                          ▼
         ┌────────────────────────────────┐
         │   Cloudflare Worker (Edge)     │
         │  • Authentication              │
         │  • Validation & Sanitization   │
         │  • Cardinality Governance      │
         │  • Transform to Histograms     │
         └────────┬───────────────┬───────┘
                  │               │
        Metrics   │               │   Logs
                  ▼               ▼
      ┌──────────────┐   ┌──────────────┐
      │    Mimir     │   │     Loki     │
      │  (Metrics)   │   │    (Logs)    │
      │ Prometheus-  │   │ Log          │
      │ compatible   │   │ Aggregation  │
      └──────┬───────┘   └──────┬───────┘
             │                  │
             └────────┬─────────┘
                      ▼
           ┌────────────────────┐
           │      Grafana       │
           │  • 4 Dashboards    │
           │  • 58 Panels       │
           │  • Recording Rules │
           │  • Alert Rules     │
           └────────────────────┘
```

**Flow**:
1. SDK captures events from video players (all major web players supported)
2. Events batched and sent to Cloudflare Worker edge endpoint
3. Worker validates, enriches, and transforms to histogram metrics
4. Metrics sent to Mimir (Prometheus-compatible), logs to Loki
5. Grafana visualizes with pre-built dashboards and alerts

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose v2
- Cloudflare account (for worker deployment)
- OR Grafana Cloud account (alternative to self-hosting)

### 1. Clone Repository

```bash
git clone https://github.com/openqoe/openqoe-dev.git
cd openqoe
```

### 2. Start Observability Stack

```bash
# Start Mimir, Loki, and Grafana
docker compose up -d

# Verify all services are healthy
docker compose ps

# Access Grafana at http://localhost:3000 (admin/admin)
```

### 3. Load Recording & Alert Rules

```bash
cd observability/prometheus/rules

# Load recording rules
./load-rules.sh http://localhost:9009

# Load alert rules
curl -X POST \
  "http://localhost:9009/prometheus/config/v1/rules/anonymous" \
  -H "Content-Type: application/yaml" \
  --data-binary "@openqoe-alert-rules.yml"
```

### 4. Deploy Worker (Local Development)

```bash
cd worker

# Install dependencies
npm install

# Create local config
cp .dev.vars.example .dev.vars

# Edit .dev.vars with localhost URLs:
# MIMIR_URL=http://localhost:9009/api/v1/push
# LOKI_URL=http://localhost:3100/loki/api/v1/push

# Run locally
npm run dev
# Worker available at http://localhost:8787
```

### 5. Integrate SDK

```html
<!DOCTYPE html>
<html>
<head>
  <title>Video Player Example</title>
</head>
<body>
  <video id="myVideo" controls width="640">
    <source src="https://example.com/video.mp4" type="video/mp4">
  </video>

  <script type="module">
    import { OpenQoE } from './sdk/dist/index.js';

    // Initialize SDK
    const qoe = new OpenQoE({
      orgId: 'my-org',
      playerId: 'my-website',
      endpointUrl: 'http://localhost:8787/v1/events',
      debug: true
    });

    // Attach to player
    const video = document.getElementById('myVideo');
    qoe.attachPlayer('html5', video, {
      videoId: 'demo-video-123',
      videoTitle: 'Demo Video'
    });

    // SDK will now automatically track all events!
  </script>
</body>
</html>
```

### 6. View Dashboards

1. Open Grafana: http://localhost:3000
2. Navigate to **Dashboards** → **OpenQoE** folder
3. Open **VOD Monitoring** dashboard
4. Play a video and watch metrics appear in real-time!

**That's it!** Your video QoE monitoring is now live. 🎉

---

## 📚 Documentation

### Getting Started

| Document | Description |
|----------|-------------|
| [Deployment Guide](docs/deployment-guide.md) | Complete deployment instructions for all environments |
| [Deployment Checklist](docs/deployment-checklist.md) | Step-by-step validation checklist |
| [SDK Integration Guide](docs/sdk-integration.md) | SDK setup for all 5 supported players |
| [API Reference](docs/api-reference.md) | Complete API documentation and event schemas |

### Architecture & Design

| Document | Description |
|----------|-------------|
| [Architecture Overview](docs/architecture.md) | System architecture and component design |
| [Technical Specification](docs/technical-spec.md) | Detailed technical specifications |
| [Data Model](docs/data-model.md) | Event schemas and data structures |
| [Production Ready Status](docs/production-ready.md) | Complete production readiness report |

### Observability

| Document | Description |
|----------|-------------|
| [Observability README](docs/observability/README.md) | Stack overview, metrics, queries, troubleshooting |
| [Dashboard Documentation](docs/observability/dashboards.md) | Dashboard specifications and panel details |
| [Recording Rules](observability/prometheus/rules/openqoe-recording-rules.yml) | 25 pre-aggregated metrics |
| [Alert Rules](observability/prometheus/rules/openqoe-alert-rules.yml) | 18 production alerts |

### Component READMEs

| Component | README |
|-----------|--------|
| SDK | [sdk/README.md](sdk/README.md) |
| Worker | [worker/README.md](worker/README.md) |
| Examples | [examples/README.md](examples/README.md) |

---

## 🌍 Deployment Options

### Option 1: Self-Hosted (Docker)

**Best for**: On-premise deployments, full control, data sovereignty

```bash
# Start complete stack
docker compose up -d

# Configure worker for localhost
cd worker && npm run dev
```

**Includes**: Mimir (metrics), Loki (logs), Grafana (dashboards)

**Docs**: [Self-Hosted Deployment](docs/deployment-guide.md#option-1-self-hosted-docker-stack)

---

### Option 2: Grafana Cloud

**Best for**: Managed service, zero infrastructure, global scale

```bash
# Configure worker with Grafana Cloud credentials
cd worker
wrangler secret put GRAFANA_CLOUD_INSTANCE_ID
wrangler secret put GRAFANA_CLOUD_API_KEY
wrangler secret put GRAFANA_CLOUD_METRICS_URL
wrangler secret put GRAFANA_CLOUD_LOGS_URL

# Deploy to Cloudflare
wrangler deploy
```

**Docs**: [Grafana Cloud Deployment](docs/deployment-guide.md#option-3-grafana-cloud)

---

### Option 3: Hybrid (Self-Hosted + Cloudflare Worker)

**Best for**: Edge ingestion with on-premise storage

Combine Cloudflare Worker for global edge ingestion with self-hosted observability stack.

**Docs**: [Hybrid Deployment](docs/deployment-guide.md#network-connectivity-for-self-hosted-deployments)

---

## 📊 Metrics & Dashboards

### Dashboard Overview

| Dashboard | Panels | Purpose | Key Metrics |
|-----------|--------|---------|-------------|
| **VOD Monitoring** | 21 | Real-time VOD quality | VST, rebuffering, completion, quartiles |
| **Live Streaming** | 11 | Live event monitoring | Concurrent viewers, join time, geographic |
| **Quality & Delivery** | 12 | Technical deep-dive | Seek latency, dropped frames, ABR |
| **Impact Explorer** | 14 | Business analysis | Watch time, engagement, revenue |

### Key Metrics Captured

**Business Metrics**:
- Total views, completion rate, watch time
- Revenue impact calculations
- Engagement by quartile (25/50/75/100%)
- Content performance comparison

**Technical Metrics**:
- Video Startup Time (P50/P95/P99 via histograms)
- Rebuffer rate, duration, and frequency
- Seek latency and performance
- Error rates by type and family
- Bitrate distribution and ABR behavior
- Dropped frames and rendering quality
- Resolution distribution (360p-8K)
- Buffer health

**Live Streaming**:
- Concurrent viewers (real-time)
- Join time (P95)
- Geographic distribution
- Viewer drop detection

### Histogram Metrics

OpenQoE uses **true histograms** (not gauges) for accurate percentile calculations:

```promql
# Accurate P95 Video Startup Time
histogram_quantile(0.95,
  sum(rate(openqoe_video_startup_seconds_bucket[5m])) by (le)
)

# Using pre-aggregated recording rule (10-50x faster)
openqoe:video_startup_seconds:p95
```

**Histogram buckets configured**:
- **VST**: [0.5, 1, 2, 3, 5, 10, 15, 30] seconds
- **Rebuffer Duration**: [0.5, 1, 2, 3, 5, 10, 30] seconds
- **Seek Latency**: [0.1, 0.25, 0.5, 1, 2, 5] seconds

---

## 🎨 Supported Players

| Player | Version | Adapter | Events | Status |
|--------|---------|---------|--------|--------|
| **HTML5 Video** | Native | `HTML5Adapter` | 11/12* | ✅ Production |
| **Video.js** | 7.0+ | `VideoJsAdapter` | 12/12 | ✅ Production |
| **HLS.js** | 1.0+ | `HlsJsAdapter` | 12/12 | ✅ Production |
| **dash.js** | 4.0+ | `DashJsAdapter` | 12/12 | ✅ Production |
| **Shaka Player** | 4.0+ | `ShakaAdapter` | 12/12 | ✅ Production |

*HTML5 doesn't support `quality_change` events (no native ABR)

### Events Tracked (12 Total)

| Event | Description | Business Value |
|-------|-------------|----------------|
| `playerready` | Player initialized | Time to interactive |
| `viewstart` | Video load started | View funnel entry |
| `playing` | Playback started | **Video Startup Time (VST)** |
| `pause` | User paused | Engagement analysis |
| `seek` | User scrubbed | Navigation behavior |
| `stall_start` | Buffering started | **Rebuffering detection** |
| `stall_end` | Buffering ended | **Rebuffer duration** |
| `ended` | Video completed | **Completion rate** |
| `error` | Playback error | **Error tracking** |
| `quartile` | 25/50/75/100% reached | **Drop-off analysis** |
| `heartbeat` | Periodic update (10s) | **Watch time tracking** |
| `quality_change` | ABR switch | Bitrate adaptation |

---

## 🛠️ Development

### Project Structure

```
openqoe/
├── sdk/                          # JavaScript SDK
│   ├── src/
│   │   ├── adapters/            # Player adapters (5 total)
│   │   ├── core/                # Core SDK modules
│   │   │   ├── EventCollector.ts
│   │   │   ├── SessionManager.ts
│   │   │   ├── BatchManager.ts
│   │   │   └── Transport.ts
│   │   ├── utils/               # Privacy, device detection
│   │   └── OpenQoE.ts           # Main SDK class
│   ├── dist/                    # Built bundles
│   └── package.json
│
├── worker/                       # Cloudflare Worker
│   ├── src/
│   │   ├── index.ts             # Main handler
│   │   ├── config.ts            # Configuration
│   │   ├── destinations.ts      # Destination manager
│   │   ├── validation.ts        # Event validation
│   │   ├── prometheus.ts        # Histogram metrics
│   │   ├── loki.ts              # Log transformation
│   │   ├── cardinality.ts       # Cardinality governance
│   │   └── auth.ts              # Authentication
│   ├── wrangler.toml            # Worker configuration
│   ├── validate.sh              # Pre-deployment validation
│   └── package.json
│
├── observability/                # Observability stack
│   ├── dashboards/              # 4 Grafana dashboards (58 panels)
│   │   ├── vod-monitoring.json
│   │   ├── live-streaming.json
│   │   ├── quality-delivery.json
│   │   └── impact-explorer.json
│   ├── prometheus/
│   │   └── rules/
│   │       ├── openqoe-recording-rules.yml  # 25 rules
│   │       ├── openqoe-alert-rules.yml      # 18 alerts
│   │       └── load-rules.sh
│   ├── mimir/
│   │   ├── mimir-config.yml
│   │   └── runtime.yml
│   ├── loki/
│   │   └── loki-config.yml
│   └── grafana/
│       └── provisioning/
│
├── examples/                     # Example/demo pages for all 5 players
├── docs/                         # Documentation
│   ├── deployment-guide.md
│   ├── deployment-checklist.md
│   ├── production-ready.md
│   ├── sdk-integration.md
│   ├── api-reference.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── technical-spec.md
│   ├── contributing.md
│   └── observability/
│       ├── README.md
│       └── dashboards.md
├── compose.yml                   # Docker Compose stack
├── LICENSE                       # Apache 2.0
└── README.md                     # This file
```

### Build SDK

```bash
cd sdk
npm install
npm run build
npm test
```

### Run Worker Locally

```bash
cd worker
npm install
npm run dev
# Available at http://localhost:8787
```

### Type Check

```bash
npm run type-check
```

### Run Examples

```bash
cd examples
npx http-server -p 8080
# Open http://localhost:8080
```

---

## 🤝 Contributing

We welcome contributions! Whether it's:

- 🐛 Bug reports
- ✨ Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions

Please read our [Contributing Guide](docs/contributing.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

```
Copyright 2024 OpenQoE Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## 💬 Support

### Community Support

- 🌐 **Website**: [https://openqoe.dev](https://openqoe.dev)
- 📖 **Documentation**: Start with [docs/deployment-guide.md](docs/deployment-guide.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/openqoe/openqoe-dev/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/openqoe/openqoe-dev/discussions)
- 💬 **Questions**: [GitHub Discussions Q&A](https://github.com/openqoe/openqoe-dev/discussions/categories/q-a)

### Getting Help

1. Check the [documentation](#documentation)
2. Search [existing issues](https://github.com/openqoe/openqoe-dev/issues)
3. Check [troubleshooting guide](docs/observability/README.md#troubleshooting)
4. Ask in [Discussions](https://github.com/openqoe/openqoe-dev/discussions)

---

## 🌟 Acknowledgments

OpenQoE is built with:

- **TypeScript** - Type-safe development
- **Cloudflare Workers** - Edge compute platform
- **Grafana Mimir** - Prometheus-compatible metrics storage
- **Grafana Loki** - Log aggregation
- **Grafana** - Visualization platform
- **Docker** - Containerization

Inspired by commercial QoE monitoring solutions for continuous improvement and industry best practices.

---

## 📈 Project Status

**Current Version**: 1.0.0
**Status**: ✅ **Production Ready**
**Last Updated**: November 2024

See [docs/production-ready.md](docs/production-ready.md) for complete production readiness report.

### What's Production Ready

- ✅ SDK for all 5 major web players
- ✅ Cloudflare Worker with histogram support
- ✅ 4 comprehensive Grafana dashboards (58 panels)
- ✅ 25 recording rules for performance
- ✅ 18 production-ready alerts
- ✅ Self-hosted Docker stack
- ✅ Grafana Cloud support
- ✅ Complete documentation

### Roadmap

**Phase 2** (Optional):
- Worker Health Dashboard (pipeline monitoring)
- Advanced cardinality analytics
- Custom metric extensions
- Load testing framework

---

## 🙏 Star Us!

If you find OpenQoE useful, please consider giving us a star ⭐ on GitHub. It helps others discover the project!

[![Star on GitHub](https://img.shields.io/github/stars/openqoe/openqoe-dev?style=social)](https://github.com/openqoe/openqoe-dev)

---

**Made with ❤️ by the OpenQoE Community**
