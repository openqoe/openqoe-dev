# OpenQoE Observability Stack

Complete monitoring solution for video Quality of Experience (QoE) metrics using Grafana Mimir (metrics) and Loki (logs).

## Quick Start

```bash
# Start the complete observability stack
docker compose up -d

# Verify all services are healthy
docker compose ps

# Access Grafana
open http://localhost:3000
# Login: admin / admin
```

## Components

| Component | Port | Purpose |
|-----------|------|---------|
| **Grafana** | 3000 | Visualization and dashboards |
| **Mimir** | 9009 | Metrics storage (Prometheus-compatible) |
| **Loki** | 3100 | Log aggregation |

##What's Included

### 📊 **4 Production Dashboards**

1. **VOD Monitoring** (`dashboards/vod-monitoring.json`)
   - 21 panels covering video-on-demand quality metrics
   - VST, rebuffering, errors, engagement, quartile funnel
   - Resolution distribution and device breakdown

2. **Live Streaming** (`dashboards/live-streaming.json`)
   - 11 panels for live event monitoring
   - Concurrent viewers, join time, geographic distribution
   - Real-time rebuffering and error tracking

3. **Quality & Delivery** (`dashboards/quality-delivery.json`)
   - 12 panels for technical performance deep-dive
   - Player performance, network metrics, ABR behavior
   - Seek latency, dropped frames, buffer health

4. **Impact Explorer** (`dashboards/impact-explorer.json`)
   - 14 panels connecting quality to business outcomes
   - Watch time aggregates, completion rates, revenue impact
   - Quality-to-engagement correlation analysis

### 📈 **Recording Rules** (`prometheus/rules/openqoe-recording-rules.yml`)

25 pre-aggregated metrics for dashboard performance:
- Video Startup Time percentiles (P50/P95/P99)
- Rebuffer rate and duration
- Completion rates by device/video
- Error rates by type
- Watch time aggregates
- Concurrent viewer counts

### 🚨 **Alert Rules** (`prometheus/rules/openqoe-alert-rules.yml`)

18 production-ready alerts across 6 categories:
- **Critical Quality**: High VST, rebuffer rate, error rate
- **Business Impact**: Low completion rate, dropping watch time
- **Performance**: High seek latency, dropped frames
- **Live Streaming**: No viewers, viewership drops
- **Data Pipeline**: No events, ingestion drops

### 🎯 **Histogram Metrics**

Worker exports accurate histogram metrics for percentile calculations:
- `openqoe_video_startup_seconds` - Buckets: [0.5, 1, 2, 3, 5, 10, 15, 30]
- `openqoe_rebuffer_duration_seconds` - Buckets: [0.5, 1, 2, 3, 5, 10, 30]
- `openqoe_seek_latency_seconds` - Buckets: [0.1, 0.25, 0.5, 1, 2, 5]

Enables accurate P50/P95/P99 calculations via `histogram_quantile()`.

## Installation

### Method 1: Docker Compose (Recommended)

```bash
# Start everything
docker compose up -d

# Load recording rules into Mimir
cd prometheus/rules
./load-rules.sh http://localhost:9009

# Load alert rules
curl -X POST \
  "http://localhost:9009/prometheus/config/v1/rules/anonymous" \
  -H "Content-Type: application/yaml" \
  --data-binary "@openqoe-alert-rules.yml"

# Dashboards auto-load via provisioning
```

### Method 2: Manual Dashboard Import

1. Login to Grafana (http://localhost:3000)
2. Go to **Dashboards** → **Import**
3. Upload JSON files from `dashboards/` directory
4. Select **Mimir** and **Loki** data sources
5. Click **Import**

## Configuration

### Mimir Configuration

**File**: `mimir/mimir-config.yml`

- Multi-tenancy: Disabled (single tenant)
- Retention: 30 days
- Storage: Filesystem (`/data/blocks`)
- Limits:
  - Ingestion rate: 100,000 samples/sec
  - Max series per user: 1,000,000
  - Query parallelism: 32

### Loki Configuration

**File**: `loki/loki-config.yml`

- Retention: 744h (31 days)
- Storage: Filesystem (`/loki`)
- Ingestion: 5MB/sec
- Query limit: 5000 lines

### Grafana Provisioning

**Datasources**: `grafana/provisioning/datasources/datasources.yml`
- Mimir (default datasource)
- Loki

**Dashboards**: Auto-loaded from `dashboards/` directory

## Metrics Reference

### Core Business Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `openqoe_views_started_total` | Counter | Total view starts |
| `openqoe_views_completed_total` | Counter | Total completions |
| `openqoe_completion_rate` | Gauge | Completion percentage |
| `openqoe_playing_time_seconds` | Counter | Watch time per session |
| `openqoe_quartile_reached_total` | Counter | Quartile tracking (25/50/75/100%) |

### Technical Quality Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `openqoe_video_startup_seconds` | Histogram | Video startup time |
| `openqoe_rebuffer_events_total` | Counter | Rebuffering events |
| `openqoe_rebuffer_duration_seconds` | Histogram | Rebuffer duration |
| `openqoe_seek_latency_seconds` | Histogram | Seek performance |
| `openqoe_dropped_frames_total` | Counter | Dropped frames |
| `openqoe_errors_total` | Counter | Error events |
| `openqoe_bitrate_bps` | Gauge | Current bitrate |
| `openqoe_buffer_length_seconds` | Gauge | Buffer health |
| `openqoe_resolution_total` | Counter | Resolution distribution |
| `openqoe_quality_changes_total` | Counter | ABR switches |

### Labels

All metrics include:
- `org_id` - Organization identifier
- `player_id` - Player/site identifier
- `video_id` - Video identifier (governed for cardinality)
- `device_category` - Device type (desktop, mobile, tablet, tv)
- `os_family` - Operating system
- `browser_family` - Browser type

## Query Examples

### Video Startup Time P95

```promql
# Using recording rule (fast)
openqoe:video_startup_seconds:p95{org_id="my-org"}

# Using histogram (accurate)
histogram_quantile(0.95,
  sum(rate(openqoe_video_startup_seconds_bucket{org_id="my-org"}[5m])) by (le)
)
```

### Rebuffer Rate

```promql
# Using recording rule
openqoe:rebuffer_rate:per_view{org_id="my-org"}

# Direct calculation
sum(rate(openqoe_rebuffer_events_total{org_id="my-org"}[5m]))
/
sum(rate(openqoe_views_started_total{org_id="my-org"}[5m]))
```

### Completion Rate by Video

```promql
# Using recording rule
openqoe:completion_rate:by_video{org_id="my-org"}

# Direct calculation
sum(rate(openqoe_views_completed_total[5m])) by (video_id)
/
sum(rate(openqoe_views_started_total[5m])) by (video_id)
```

### Recent Errors (Loki)

```logql
{org_id="my-org", event_type="error"}
| json
| line_format "{{.error_family}}: {{.error_message}} (video={{.video_id}})"
```

## Troubleshooting

### Dashboards show "No Data"

1. Verify worker is sending metrics:
   ```bash
   curl http://localhost:9009/prometheus/api/v1/query?query=openqoe_events_total
   ```

2. Check Mimir ingestion:
   ```bash
   docker compose logs mimir | grep "request completed"
   ```

3. Verify datasources in Grafana:
   - Settings → Data Sources → Test

### Recording rules not loading

1. Check Mimir ruler API:
   ```bash
   curl http://localhost:9009/prometheus/config/v1/rules/anonymous
   ```

2. Reload rules:
   ```bash
   cd prometheus/rules
   ./load-rules.sh
   ```

### Histogram percentiles showing incorrect values

- Ensure worker is using histogram format (not gauges)
- Verify buckets are configured correctly
- Check that `histogram_quantile()` queries use `_bucket` suffix

## Performance Tuning

### For High Volume (>10,000 events/sec)

**Mimir limits** (`mimir/mimir-config.yml`):
```yaml
limits:
  ingestion_rate: 500000  # Increase from 100000
  ingestion_burst_size: 1000000  # Increase from 200000
  max_global_series_per_user: 5000000  # Increase from 1000000
```

**Recording rules interval** (`prometheus/rules/openqoe-recording-rules.yml`):
```yaml
interval: 60s  # Increase from 30s for less frequent aggregation
```

### For Low Resource Environments

**Mimir compaction** (`mimir/mimir-config.yml`):
```yaml
compactor:
  compaction_interval: 1h  # Increase from 30m
  max_closing_blocks_concurrency: 1  # Decrease from 2
```

**Dashboard refresh rates**:
- VOD: 1m (default: 30s)
- Live: 30s (default: 10s)

## Maintenance

### Data Retention

Mimir: 30 days (configurable in `mimir-config.yml`)
```yaml
blocks_storage:
  tsdb:
    retention_period: 30d
```

Loki: 31 days (configurable in `loki-config.yml`)
```yaml
limits_config:
  retention_period: 744h
```

### Backup

```bash
# Backup Mimir data
docker run --rm -v openqoe_mimir_data:/data -v $(pwd):/backup alpine tar czf /backup/mimir-backup.tar.gz /data

# Backup Loki data
docker run --rm -v openqoe_loki_data:/loki -v $(pwd):/backup alpine tar czf /backup/loki-backup.tar.gz /loki

# Backup Grafana dashboards and settings
docker run --rm -v openqoe_grafana_data:/var/lib/grafana -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz /var/lib/grafana
```

### Upgrade

```bash
# Pull latest images
docker compose pull

# Restart services
docker compose up -d

# Reload rules after upgrade
cd prometheus/rules
./load-rules.sh
```

## Documentation

- [Deployment Guide](../DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Dashboard Documentation](GRAFANA_DASHBOARDS.md) - Dashboard specifications and queries
- [API Reference](../API_REFERENCE.md) - Worker API and event schema
- [SDK Integration](../SDK_INTEGRATION.md) - SDK setup and player adapters

## Support

- Website: https://openqoe.dev
- GitHub Issues: https://github.com/openqoe/openqoe-dev/issues
- GitHub Discussions: https://github.com/openqoe/openqoe-dev/discussions
