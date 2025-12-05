# OpenQoE Cloudflare Worker

Cloudflare Worker for ingesting OpenQoE events and forwarding to Prometheus and Loki.

## Features

- **Event Ingestion**: Accepts batches of events from OpenQoE SDK
- **Authentication**: API key-based authentication
- **Validation**: Comprehensive event validation
- **Cardinality Governance**: Automatic cardinality management with configurable policies
- **Dual Destination Support**:
  - Self-Hosted: Standard Prometheus + Loki
  - Grafana Cloud: Grafana Cloud Metrics (Mimir) + Grafana Cloud Logs (Loki)
- **CORS Support**: Built-in CORS handling for browser requests
- **Health Checks**: `/health` endpoint for monitoring

## Destination Configuration

OpenQoE Worker supports two destination types. The worker **automatically detects** which destination to use based on environment variables.

### Option 1: Self-Hosted (Mimir + Loki)

Use this for your own Mimir or Prometheus installations. **Mimir is recommended** as it's the same backend used by Grafana Cloud Metrics and provides better scalability.

**Environment Variables:**

```bash
# Mimir (Recommended)
MIMIR_URL=http://mimir:9009/api/v1/push
LOKI_URL=http://loki:3100/loki/api/v1/push

# Or Prometheus (Backward Compatible)
PROMETHEUS_URL=http://prometheus:9090/api/v1/write
LOKI_URL=http://loki:3100/loki/api/v1/push

# Optional: Basic auth
MIMIR_USERNAME=admin
MIMIR_PASSWORD=secret
# Or use PROMETHEUS_USERNAME/PROMETHEUS_PASSWORD
LOKI_USERNAME=admin
LOKI_PASSWORD=secret
```

**Use Cases:**
- Running observability stack in Docker (we provide `compose.yml`)
- Existing on-prem Mimir/Prometheus/Grafana setup
- Full control over data retention and storage
- No external dependencies
- Same backend as Grafana Cloud (Mimir)

**See:** [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for complete setup instructions

### Option 2: Grafana Cloud (Mimir + Loki)

Use this for Grafana Cloud Metrics (powered by Mimir).

**Environment Variables:**

```bash
GRAFANA_CLOUD_INSTANCE_ID=123456
GRAFANA_CLOUD_API_KEY=glc_eyJvIjoiMTIzNDU2...
GRAFANA_CLOUD_REGION=us-central1

# Optional: Override URLs (auto-detected from region)
GRAFANA_CLOUD_METRICS_URL=https://prometheus-prod-01-us-central-0.grafana.net/api/prom/push
GRAFANA_CLOUD_LOGS_URL=https://logs-prod-us-central-0.grafana.net/loki/api/v1/push
```

**Use Cases:**
- Managed service with no infrastructure to maintain
- Built-in high availability and scalability
- Grafana Cloud integration
- Pay-as-you-go pricing

**Getting Credentials:**
1. Login to [Grafana Cloud](https://grafana.com)
2. Go to your stack → Details
3. Copy Instance ID and generate API Key with MetricsPublisher permission
4. Copy your region from the Prometheus endpoint URL

**See:** [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md#option-3-grafana-cloud) for complete setup instructions

### Configuration Examples

**Local Development (.dev.vars):**

```bash
# Copy example file
cp .dev.vars.selfhosted.example .dev.vars
# OR
cp .dev.vars.grafanacloud.example .dev.vars

# Edit with your values
vim .dev.vars
```

**Production Deployment:**

```bash
# Self-hosted with Mimir (recommended)
wrangler secret put MIMIR_URL
wrangler secret put LOKI_URL

# Or self-hosted with Prometheus (backward compat)
wrangler secret put PROMETHEUS_URL
wrangler secret put LOKI_URL

# Grafana Cloud
wrangler secret put GRAFANA_CLOUD_INSTANCE_ID
wrangler secret put GRAFANA_CLOUD_API_KEY
wrangler secret put GRAFANA_CLOUD_REGION
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Destination

Choose your destination type and configure accordingly.

**See the [Destination Configuration](#destination-configuration) section above** for complete instructions.

Quick setup:

```bash
# For local development
cp .dev.vars.selfhosted.example .dev.vars
# Edit .dev.vars with your configuration

# For production
# Self-hosted:
wrangler secret put PROMETHEUS_URL
wrangler secret put LOKI_URL

# Grafana Cloud:
wrangler secret put GRAFANA_CLOUD_INSTANCE_ID
wrangler secret put GRAFANA_CLOUD_API_KEY
wrangler secret put GRAFANA_CLOUD_REGION

# Optional: API key for endpoint security
wrangler secret put API_KEY
```

### 3. Create KV Namespace

Create a KV namespace for cardinality tracking:

```bash
wrangler kv:namespace create "CARDINALITY_KV"
wrangler kv:namespace create "CARDINALITY_KV" --preview
```

Update `wrangler.toml` with the namespace IDs.

### 4. Configure Cardinality Limits (Optional)

Set custom cardinality limits:

```bash
wrangler secret put CARDINALITY_LIMITS
```

Example JSON:

```json
{
  "limits": {
    "org_id": { "max_cardinality": 1000, "action": "allow" },
    "video_id": { "max_cardinality": 100000, "action": "bucket", "bucket_size": 10000 },
    "session_id": { "max_cardinality": 999999999, "action": "hash" },
    "video_source_url": { "max_cardinality": 0, "action": "drop" }
  }
}
```

### 5. Deploy

```bash
# Deploy to production
npm run deploy

# Or deploy to staging
wrangler deploy --env staging
```

## Development

```bash
# Run locally
npm run dev

# Type check
npm run type-check

# Run tests
npm test

# Tail logs
npm run tail
```

## API Endpoints

### POST /events

Ingest events from SDK.

**Request:**

```json
{
  "events": [
    {
      "event_type": "playing",
      "event_time": 1699564800000,
      "viewer_time": 1699564800000,
      "org_id": "org-123",
      "player_id": "player-456",
      "view_id": "view-789",
      "session_id": "session-abc",
      "viewer_id": "viewer-def",
      "data": {
        "video_startup_time": 1234,
        "bitrate": 5000000
      }
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Events accepted",
  "events_received": 1,
  "processing_time_ms": 45
}
```

**Authentication:**

```bash
# Using Authorization header
curl -X POST https://ingest.example.com/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @events.json

# Using X-API-Key header
curl -X POST https://ingest.example.com/events \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @events.json
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": 1699564800000,
  "service": "openqoe-worker",
  "version": "1.0.0"
}
```

### GET /stats

Get cardinality statistics (requires authentication).

**Query Parameters:**
- `dimension` (optional): Get stats for specific dimension

**Response:**

```json
{
  "dimension": "video_id",
  "cardinality": 1543,
  "values": ["video-1", "video-2", "..."]
}
```

## Cardinality Governance

The worker implements automatic cardinality governance to prevent metrics explosion:

### Actions

- **allow**: Allow values up to max_cardinality, then fall back to hash
- **bucket**: Bucket values into ranges (numeric) or hash buckets (strings)
- **hash**: Always hash the value
- **drop**: Drop the dimension entirely

### Default Limits

```javascript
{
  // Low cardinality - allow
  'org_id': { max_cardinality: 1000, action: 'allow' },
  'player_id': { max_cardinality: 10000, action: 'allow' },
  'event_type': { max_cardinality: 20, action: 'allow' },

  // Medium cardinality - bucket
  'video_id': { max_cardinality: 100000, action: 'bucket', bucket_size: 10000 },

  // High cardinality - hash
  'session_id': { max_cardinality: Infinity, action: 'hash' },
  'view_id': { max_cardinality: Infinity, action: 'hash' },

  // Very high cardinality - drop
  'video_source_url': { max_cardinality: 0, action: 'drop' }
}
```

## Prometheus Metrics

The worker generates the following metrics:

- `openqoe_events_total` - Total event count
- `openqoe_player_startup_seconds` - Player startup time
- `openqoe_video_startup_seconds` - Video startup time
- `openqoe_views_started_total` - Views started
- `openqoe_views_completed_total` - Views completed
- `openqoe_rebuffer_events_total` - Rebuffer events
- `openqoe_rebuffer_duration_seconds` - Rebuffer duration
- `openqoe_seeks_total` - Seek events
- `openqoe_errors_total` - Error events
- `openqoe_completion_rate` - Video completion rate
- `openqoe_bitrate_bps` - Current bitrate
- `openqoe_dropped_frames_total` - Dropped frames

## Loki Logs

Events are sent to Loki as structured JSON logs with labels:

```
{org_id="org-123", player_id="player-456", event_type="playing"}
```

Log line contains full event data:

```json
{
  "event_type": "playing",
  "event_time": 1699564800000,
  "view_id": "view-789",
  "session_id": "session-abc",
  "data": {
    "video_startup_time": 1234,
    "bitrate": 5000000
  }
}
```

## Error Handling

The worker uses a fail-open approach:

- Events are accepted immediately (202 Accepted)
- Processing happens in background via `ctx.waitUntil()`
- Errors in Prometheus/Loki forwarding are logged but don't block ingestion
- Individual dimension governance failures fall back to safe defaults

## Performance

- **Latency**: < 50ms response time (events processed in background)
- **Throughput**: 1000+ events per request
- **Scalability**: Automatically scales with Cloudflare Workers
- **Cold Start**: < 100ms

## Monitoring

Monitor the worker using:

1. **Cloudflare Dashboard**: Analytics, errors, CPU time
2. **Wrangler Tail**: Real-time logs (`npm run tail`)
3. **Health Endpoint**: `/health` for uptime monitoring
4. **Stats Endpoint**: `/stats` for cardinality tracking

## License

MIT
