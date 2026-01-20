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

OpenQoE v2 uses a Go-based worker and an OTLP-based observability pipeline. It supports three deployment models:

1. **Self-Hosted Docker Stack** - Complete stack in Docker (Mimir + Loki + Tempo + Alloy + Grafana)
2. **Existing On-Prem** - Integrate with your existing OTLP-compatible backend
3. **Grafana Cloud** - Use Grafana Cloud's managed OTel backends

**Note:** We use **Grafana Alloy** as our telemetry collector. It receives OTLP from the Go Worker and routes it to the appropriate backends.

---

---

## Deployment Strategy

OpenQoE v2 is designed to run anywhere Go can be compiled. For self-hosted environments, we recommend using Docker Compose as it orchestrates both the Go Worker and the full observability stack (Alloy, Mimir, Loki, Tempo, Grafana) in a unified virtual network.

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
NAME                STATUS              PORTS
openqoe-mimir       Up (healthy)        0.0.0.0:9009->9009/tcp
openqoe-loki        Up (healthy)        0.0.0.0:3100->3100/tcp
openqoe-tempo       Up (healthy)        0.0.0.0:3200->3200/tcp
openqoe-alloy       Up (healthy)        0.0.0.0:4317->4317/tcp
openqoe-grafana     Up (healthy)        0.0.0.0:3000->3000/tcp
```

### Step 2: Build & Start Go Worker

```bash
cd worker

# Install dependencies
go mod download

# Create .env from example
cp .env.example .env

# Set OTEL_URL to Alloy's endpoint
# OTEL_URL=http://localhost:4317

# Build and run
go build -o openqoe-worker
./openqoe-worker
```

### Step 3: Deploy Worker

```bash
# Deploy to Production
# Build the worker
go build -o openqoe-worker

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

The Go worker reads configuration from environment variables or a `.env` file within the `worker/` directory.

```bash
cd worker
cp .env.example .env

# Configure your endpoints
# OTEL_URL=http://your-mimir:9009
# API_KEY=your-secret-key
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

Configure the Go worker with your Grafana Cloud credentials in `.env`:

```bash
# In worker/.env
DESTINATION_TYPE=GrafanaCloud
GRAFANA_CLOUD_INSTANCE_ID=123456
GRAFANA_CLOUD_API_KEY=your-api-key
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
# Send test event to local Go worker
curl -X POST http://localhost:8788/v2/events \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "event_type": "playerready",
      "event_time": '$(date +%s%3N)',
      "viewer_time": 100,
      "org_id": "test-org",
      "player_id": "test-player",
      "view_id": "test-view-123",
      "session_id": "test-session-123",
      "viewer_id": "test-viewer-123"
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

| Variable    | Description                     | Example                  |
| ----------- | ------------------------------- | ------------------------ |
| `OTEL_URL`  | OTLP Exporter endpoint (Alloy)  | `http://localhost:4317`  |
| `API_KEY`   | Optional API key for /v2/events | `your-secret-key`        |
| `LOG_LEVEL` | Logging verbosity               | `info`, `debug`, `error` |
| `GIN_MODE`  | Web framework mode              | `release` or `debug`     |

#### Grafana Cloud Details

If sending directly to Grafana Cloud without local Alloy:

| Variable                    | Description           |
| --------------------------- | --------------------- |
| `DESTINATION_TYPE`          | Set to `GrafanaCloud` |
| `GRAFANA_CLOUD_INSTANCE_ID` | Your Instance ID      |
| `GRAFANA_CLOUD_API_KEY`     | Your Cloud API Key    |

### Setting Secrets

The Go worker reads secrets from environment variables or a `.env` file in the root of the `worker/` directory.

**Environment Variable:**

```bash
export API_KEY=your-secret-key
```

**Local `.env` file:**

```bash
API_KEY=your-secret-key
```

---

## Testing

### Test End-to-End Flow

1. **Start Go Worker**

   ```bash
   cd worker
   ./openqoe-worker
   ```

2. **Send Test Event**

   ```bash
   curl -X POST http://localhost:8788/v2/events \
     -H "Content-Type: application/json" \
     -d '{
       "events": [{
         "event_type": "playerready",
         "event_time": '$(date +%s%3N)',
         "viewer_time": 100,
         "org_id": "test-org",
         "player_id": "test-player",
         "view_id": "test-view-123",
         "session_id": "test-session-123",
         "viewer_id": "test-viewer-123"
       }]
     }'
   ```

3. **Verify in Grafana**
   - Open [localhost:3000](http://localhost:3000)
   - Go to **Explore**
   - Select **Mimir** and query `openqoe_events_received_total`
   - Select **Tempo** to see traces

4. **Verify Metrics**

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
The worker logs to standard output. You can pipe this to a file or use a logging aggregator.

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
