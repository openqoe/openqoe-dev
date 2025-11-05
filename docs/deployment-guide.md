# OpenQoE Deployment Guide

Complete guide for deploying OpenQoE with different destination configurations.

## Table of Contents

- [Overview](#overview)
- [Option 1: Self-Hosted (Docker Stack)](#option-1-self-hosted-docker-stack)
- [Option 2: Self-Hosted (Existing Prometheus/Grafana)](#option-2-self-hosted-existing-prometheusgrafana)
- [Option 3: Grafana Cloud](#option-3-grafana-cloud)
- [Worker Configuration](#worker-configuration)
- [Testing](#testing)

---

## Overview

OpenQoE supports three deployment models:

1. **Self-Hosted Docker Stack** - Complete stack in Docker (Mimir + Loki + Grafana)
2. **Existing On-Prem** - Integrate with your existing Mimir/Prometheus and Grafana
3. **Grafana Cloud** - Use Grafana Cloud Metrics (Mimir) and Logs (Loki)

**Note:** We use **Grafana Mimir** for metrics storage (both self-hosted and cloud). Mimir is Prometheus-compatible and provides better scalability. It's the same backend that powers Grafana Cloud Metrics.

---

## Network Connectivity for Self-Hosted Deployments

### Important: Localhost Limitation

**Cloudflare Workers cannot access `localhost` or `127.0.0.1` URLs** because they run in Cloudflare's edge network, not on your local machine. If you're deploying the worker to Cloudflare and using self-hosted Mimir/Loki, you have three options:

### Option A: Use Public Endpoints (Recommended for Production)

Deploy your Mimir and Loki instances with public URLs or behind a reverse proxy:

```bash
# Example with public endpoints
wrangler secret put MIMIR_URL
# Enter: https://mimir.yourdomain.com/api/v1/push

wrangler secret put LOKI_URL
# Enter: https://loki.yourdomain.com/loki/api/v1/push
```

**Security:** Use authentication (Basic Auth or API keys) to secure your endpoints.

### Option B: Use Cloudflare Tunnel (cloudflared)

Expose your local Docker services to the internet via Cloudflare Tunnel:

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared  # macOS
# or download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

# Create a tunnel for Mimir
cloudflared tunnel --url http://localhost:9009

# Create a tunnel for Loki
cloudflared tunnel --url http://localhost:3100
```

This generates public URLs (e.g., `https://abc-123.trycloudflare.com`) that you can use in your worker configuration.

**Note:** These are temporary tunnels. For persistent tunnels, use [Cloudflare Tunnel with Named Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/).

### Option C: Local Development with `wrangler dev`

For local development and testing, use `wrangler dev` which runs the worker on your machine:

```bash
cd worker

# Create .dev.vars with localhost URLs
cat > .dev.vars << 'EOF'
MIMIR_URL=http://localhost:9009/api/v1/push
LOKI_URL=http://localhost:3100/loki/api/v1/push
EOF

# Run worker locally (can access localhost)
npm run dev
```

The worker runs at `http://localhost:8787` and can access your local Docker services.

### Which Option to Choose?

| Scenario | Recommended Option |
|----------|-------------------|
| Local development/testing | **Option C** - Use `wrangler dev` with localhost URLs |
| Self-hosted production | **Option A** - Deploy behind reverse proxy with proper auth |
| Quick testing with deployed worker | **Option B** - Use cloudflared tunnels temporarily |
| Production deployment | **Use Grafana Cloud** - No network setup required |

---

## Option 1: Self-Hosted (Docker Stack)

**Use Case:** You want a complete observability stack deployed via Docker.

### Prerequisites

- Docker 20.10+
- Docker Compose v2 (comes with Docker Desktop, or install separately)
- 4GB RAM minimum
- 50GB disk space (for 30 days retention)

### Step 1: Start the Stack

```bash
# Start complete stack (Mimir + Loki + Grafana)
docker compose up -d

# Verify all services are healthy
docker compose ps
```

Expected output:
```
NAME                    STATUS              PORTS
openqoe-mimir           Up (healthy)        0.0.0.0:9009->9009/tcp
openqoe-loki            Up (healthy)        0.0.0.0:3100->3100/tcp
openqoe-grafana         Up (healthy)        0.0.0.0:3000->3000/tcp
```

### Step 2: Configure Worker

```bash
cd worker

# Create .dev.vars for local development
cat > .dev.vars << 'EOF'
MIMIR_URL=http://localhost:9009/api/v1/push
LOKI_URL=http://localhost:3100/loki/api/v1/push
EOF

# Or set secrets for production deployment
wrangler secret put MIMIR_URL
# Enter: http://your-mimir-server:9009/api/v1/push

wrangler secret put LOKI_URL
# Enter: http://your-loki-server:3100/loki/api/v1/push

# Note: PROMETHEUS_URL still works for backward compatibility
```

### Step 3: Deploy Worker

```bash
# Deploy to Cloudflare
wrangler deploy

# Or run locally
npm run dev
```

### Step 4: Access Services

- **Mimir**: http://localhost:9009
- **Loki**: http://localhost:3100
- **Grafana**: http://localhost:3000 (admin/admin)

### Step 5: Import Dashboards

1. Login to Grafana (http://localhost:3000)
2. Go to **Dashboards** → **Import**
3. Upload `observability/dashboards/vod-monitoring.json`
4. Select Mimir (or Prometheus) and Loki data sources
5. Click **Import**

---

## Option 2: Self-Hosted (Existing Mimir/Prometheus/Grafana)

**Use Case:** You already have Mimir or Prometheus and Grafana running on-prem.

### Prerequisites

**Option A - Mimir (Recommended):**
- Grafana Mimir 2.0+
- Loki 2.8+
- Grafana 9.0+

**Option B - Prometheus (Backward Compatible):**
- Prometheus 2.40+ with remote write receiver enabled
- Loki 2.8+
- Grafana 9.0+

### Step 1: Configure Metrics Backend

**If using Mimir (Recommended):**

Mimir is already configured to accept remote write. No additional configuration needed.
Default endpoint: `http://mimir:9009/api/v1/push`

**If using Prometheus:**

Your Prometheus must have remote write receiver enabled:

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

# Enable remote write receiver
remote_write:
  - url: http://localhost:9090/api/v1/write
```

Start Prometheus with:
```bash
prometheus --config.file=prometheus.yml \
  --web.enable-remote-write-receiver \
  --storage.tsdb.path=/var/lib/prometheus
```

### Step 2: Configure Loki

Ensure Loki is configured to accept push requests:

```yaml
# loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3100

# ... rest of config
```

### Step 3: Add Recording Rules (Optional but Recommended)

Copy recording rules to your Prometheus:

```bash
# Copy rules
cp observability/prometheus/rules/* /etc/prometheus/rules/

# Update prometheus.yml
rule_files:
  - '/etc/prometheus/rules/*.yml'

# Reload Prometheus
curl -X POST http://localhost:9090/-/reload
```

### Step 4: Configure Worker

```bash
cd worker

# For production deployment with Mimir
wrangler secret put MIMIR_URL
# Enter: http://your-mimir:9009/api/v1/push

# Or for Prometheus (backward compat)
wrangler secret put PROMETHEUS_URL
# Enter: http://your-prometheus:9090/api/v1/write

wrangler secret put LOKI_URL
# Enter: http://your-loki:3100/loki/api/v1/push

# Optional: Add authentication
wrangler secret put MIMIR_USERNAME
wrangler secret put MIMIR_PASSWORD
# Or use PROMETHEUS_USERNAME/PROMETHEUS_PASSWORD for backward compat

# Deploy
wrangler deploy
```

### Step 5: Configure Grafana Data Sources

Add OpenQoE data to your existing Grafana:

1. **Add Mimir/Prometheus Data Source**
   - Type: Prometheus (Mimir is Prometheus-compatible)
   - URL: http://your-mimir:9009 (or http://your-prometheus:9090)
   - Access: Server (default)

2. **Add Loki Data Source**
   - URL: http://your-loki:3100
   - Access: Server (default)

3. **Import Dashboards**
   - Import all JSON files from `observability/dashboards/`

---

## Option 3: Grafana Cloud

**Use Case:** You want to use Grafana Cloud Metrics (powered by Mimir) for metrics.

### Prerequisites

- Grafana Cloud account (free tier available)
- Grafana Cloud API key with MetricsPublisher and LogsPublisher permissions

### Step 1: Get Grafana Cloud Credentials

1. Login to [Grafana Cloud](https://grafana.com)
2. Go to **My Account** → **Cloud Portal**
3. Click on your stack
4. Navigate to **Details**

**Get Metrics Details (Mimir):**
- Go to **Prometheus** section
- Copy **Remote Write Endpoint** (e.g., `https://prometheus-prod-01-eu-west-0.grafana.net/api/prom/push`)
- Copy **Instance ID** (e.g., `123456`)
- Generate **API Key** with MetricsPublisher permission

**Get Logs Details (Loki):**
- Go to **Loki** section
- Copy **Loki URL** (e.g., `https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push`)
- Use same **Instance ID** and **API Key**

### Step 2: Configure Worker for Grafana Cloud

```bash
cd worker

# Set Grafana Cloud credentials
wrangler secret put GRAFANA_CLOUD_INSTANCE_ID
# Enter: 123456 (your instance ID)

wrangler secret put GRAFANA_CLOUD_API_KEY
# Enter: glc_eyJv... (your API key)

wrangler secret put GRAFANA_CLOUD_REGION
# Enter: eu-west-0 (or your region)

# Optional: Override URLs if needed
wrangler secret put GRAFANA_CLOUD_METRICS_URL
# Enter: https://prometheus-prod-01-eu-west-0.grafana.net/api/prom/push

wrangler secret put GRAFANA_CLOUD_LOGS_URL
# Enter: https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push

# Deploy
wrangler deploy
```

### Step 3: Verify Configuration

Test the worker configuration:

```bash
# Check worker health
curl https://your-worker.workers.dev/health

# Expected response:
{
  "status": "healthy",
  "timestamp": 1699564800000,
  "service": "openqoe-worker",
  "version": "1.0.0"
}
```

### Step 4: Send Test Event

```bash
# Send test event
curl -X POST https://your-worker.workers.dev/events \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "event_type": "test",
      "event_time": '$(date +%s%3N)',
      "viewer_time": '$(date +%s%3N)',
      "org_id": "test-org",
      "player_id": "test-player",
      "view_id": "test-view-'$(uuidgen)'",
      "session_id": "test-session-'$(uuidgen)'",
      "viewer_id": "test-viewer-'$(uuidgen)'"
    }]
  }'
```

### Step 5: Verify in Grafana Cloud

1. Login to your Grafana Cloud instance
2. Go to **Explore**
3. Select **Prometheus** data source
4. Query: `openqoe_events_total`
5. You should see your test event!

### Step 6: Import Dashboards

1. In Grafana Cloud, go to **Dashboards** → **Import**
2. Upload `observability/dashboards/vod-monitoring.json`
3. Select your Prometheus and Loki data sources
4. Click **Import**

---

## Worker Configuration

### Environment Variables Reference

#### Self-Hosted Configuration

```bash
# Required - Mimir (Recommended)
MIMIR_URL=http://mimir:9009/api/v1/push
LOKI_URL=http://loki:3100/loki/api/v1/push

# OR - Prometheus (Backward Compatible)
PROMETHEUS_URL=http://prometheus:9090/api/v1/write
LOKI_URL=http://loki:3100/loki/api/v1/push

# Optional - Authentication
MIMIR_USERNAME=user
MIMIR_PASSWORD=pass
# Or use PROMETHEUS_USERNAME/PROMETHEUS_PASSWORD for backward compat
LOKI_USERNAME=user
LOKI_PASSWORD=pass

# Optional - API Key for worker endpoint
API_KEY=your-secret-key
```

#### Grafana Cloud Configuration

```bash
# Required
GRAFANA_CLOUD_INSTANCE_ID=123456
GRAFANA_CLOUD_API_KEY=glc_eyJv...

# Optional
GRAFANA_CLOUD_REGION=eu-west-0
GRAFANA_CLOUD_METRICS_URL=https://prometheus-prod-01-eu-west-0.grafana.net/api/prom/push
GRAFANA_CLOUD_LOGS_URL=https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push
```

### Setting Secrets

**For Cloudflare Workers:**
```bash
wrangler secret put SECRET_NAME
```

**For Local Development:**
Create `.dev.vars` file:
```bash
SECRET_NAME=secret_value
```

---

## Testing

### Test End-to-End Flow

1. **Start your chosen destination**
   ```bash
   # For Docker:
   docker compose up -d

   # For Grafana Cloud: Already running
   ```

2. **Deploy Worker**
   ```bash
   cd worker
   npm run dev  # Local testing
   # OR
   wrangler deploy  # Production
   ```

3. **Run Demo Application**
   ```bash
   cd examples/html5-demo
   npx http-server -p 8080
   ```

4. **Open Demo**
   - Navigate to http://localhost:8080
   - Click play on the video
   - Watch events in the console

5. **Verify Metrics**

   **Self-Hosted:**
   ```bash
   # Check Mimir (query via Prometheus API)
   curl 'http://localhost:9009/prometheus/api/v1/query?query=openqoe_events_total'

   # Check Loki
   curl 'http://localhost:3100/loki/api/v1/query_range?query={org_id="demo-org"}&limit=10'
   ```

   **Grafana Cloud:**
   - Go to Explore in Grafana Cloud
   - Query: `openqoe_events_total`

---

## Troubleshooting

### Worker Not Sending to Mimir/Prometheus

**Check worker logs:**
```bash
wrangler tail
```

**Test Mimir endpoint:**
```bash
# Self-hosted Mimir
curl -X POST http://mimir:9009/api/v1/push

# Self-hosted Prometheus (backward compat)
curl -X POST http://prometheus:9090/api/v1/write

# Grafana Cloud
curl -X POST https://prometheus-prod-01-eu-west-0.grafana.net/api/prom/push \
  -u "123456:your-api-key"
```

### No Data in Grafana

**Verify data sources:**
- Go to Configuration → Data Sources
- Click Test on each data source
- Should see "Data source is working"

**Check time range:**
- Grafana defaults to last 6 hours
- Your test data might be outside this range
- Adjust time range to "Last 15 minutes"

### Authentication Errors (Grafana Cloud)

**Verify credentials:**
```bash
# Test with curl
curl -X POST https://prometheus-prod-01-eu-west-0.grafana.net/api/prom/push \
  -u "123456:glc_YOUR_API_KEY" \
  -H "Content-Type: application/x-protobuf"
```

Expected: Empty response or 204 No Content
Error: 401 Unauthorized (check credentials)

---

## Production Recommendations

### Self-Hosted

1. **Use persistent volumes** for Mimir and Loki data
2. **Configure retention** based on storage capacity (default: 30 days)
3. **Set up backup** for Mimir and Loki data
4. **Enable authentication** on all services (Mimir supports multi-tenancy)
5. **Use reverse proxy** (nginx/Traefik) for SSL termination
6. **Monitor resource usage** (RAM, disk, CPU)
7. **Consider Mimir's microservices mode** for production scale (vs monolithic)

### Grafana Cloud

1. **Use least privilege** API keys (MetricsPublisher only)
2. **Rotate API keys** regularly
3. **Monitor usage** (Grafana Cloud has usage limits)
4. **Set up alerts** for usage thresholds
5. **Use labels efficiently** (avoid high cardinality)

---

## Cost Estimates

### Self-Hosted

**Infrastructure:**
- Server: $20-100/month (depending on size)
- Storage: $0.10/GB/month
- Bandwidth: $0.05/GB

**Estimated for 1M events/day:**
- Storage: ~15GB/month → $1.50/month
- Server: Small instance → $20-40/month
- **Total: ~$25-45/month**

### Grafana Cloud

**Free Tier:**
- 10K series metrics
- 50GB logs
- 14-day retention

**Paid (Pro):**
- $8/month base
- $0.30/hour for metrics (10K active series)
- $0.50/GB for logs

**Estimated for 1M events/day:**
- Metrics: ~5K series → $36/month
- Logs: ~15GB/month → $7.50/month
- **Total: ~$50-60/month**

---

## Next Steps

- Review [Metrics Reference](./API_REFERENCE.md#metrics)
- Set up [Alerting Rules](./observability/PROMETHEUS_SETUP.md#alerting-rules)
- Create [Custom Dashboards](./observability/GRAFANA_DASHBOARDS.md)
- Configure [Cardinality Limits](./worker/README.md#cardinality-governance)
