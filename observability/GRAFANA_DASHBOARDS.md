# Grafana Dashboards for OpenQoE

Comprehensive dashboards for monitoring video QoE/QoS metrics.

## Table of Contents

- [Dashboard Overview](#dashboard-overview)
- [Installation](#installation)
- [Available Dashboards](#available-dashboards)
- [Panel Descriptions](#panel-descriptions)
- [Variables](#variables)
- [Alerts](#alerts)

---

## Dashboard Overview

OpenQoE provides pre-built Grafana dashboards for different use cases:

1. **VOD Monitoring** - Real-time video quality metrics
2. **Live Streaming** - Live event monitoring
3. **Quality & Delivery** - Technical performance metrics
4. **Impact Explorer** - Business impact analysis
5. **Worker Health** - Ingest pipeline monitoring

---

## Installation

### Method 1: Import JSON Files

1. Download dashboard JSON from `./dashboards/` directory
2. In Grafana, go to **Dashboards** → **Import**
3. Upload JSON file or paste JSON content
4. Select Prometheus and Loki data sources
5. Click **Import**

### Method 2: Provisioning (Recommended)

Create `grafana-dashboards.yml`:

```yaml
apiVersion: 1

providers:
  - name: 'OpenQoE Dashboards'
    orgId: 1
    folder: 'OpenQoE'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards/openqoe
```

Place dashboard JSON files in `/var/lib/grafana/dashboards/openqoe/`.

### Method 3: Terraform

```hcl
resource "grafana_dashboard" "openqoe_vod" {
  config_json = file("${path.module}/dashboards/vod-monitoring.json")
  folder      = grafana_folder.openqoe.id
}

resource "grafana_folder" "openqoe" {
  title = "OpenQoE"
}
```

---

## Available Dashboards

### 1. VOD Monitoring Dashboard

**Purpose**: Real-time monitoring of VOD playback quality

**Key Metrics**:
- Video Startup Time (VST)
- Rebuffer Rate & Duration
- Error Rate
- Completion Rate
- Concurrent Views
- Bitrate Distribution

**Variables**:
- `org_id` - Organization
- `player_id` - Player/Site
- `video_id` - Video filter
- `device_category` - Device type
- `interval` - Time interval (5m, 15m, 1h)

**Panels**:

1. **Overview Row**
   - Total Views (Stat)
   - Completion Rate (Gauge)
   - Avg VST (Stat)
   - Error Rate (Stat)

2. **Video Startup Time Row**
   - VST Percentiles (Time Series)
   - VST Distribution (Heatmap)
   - VST by Device (Bar Chart)

3. **Buffering Row**
   - Rebuffer Rate (Time Series)
   - Rebuffer Duration (Time Series)
   - Rebuffering Events (Counter)

4. **Errors Row**
   - Error Rate (Time Series)
   - Errors by Type (Pie Chart)
   - Error Timeline (Logs)

5. **Quality Metrics Row**
   - Bitrate Over Time (Time Series)
   - Resolution Distribution (Bar Chart)
   - Dropped Frames (Time Series)

**File**: `dashboards/vod-monitoring.json`

---

### 2. Live Streaming Dashboard

**Purpose**: Monitoring live streaming events

**Key Metrics**:
- Concurrent Viewers
- Join Time
- Live Latency
- Rebuffer Rate (Real-time)
- Geographic Distribution

**Variables**:
- `org_id` - Organization
- `stream_id` - Live stream
- `interval` - Time interval

**Panels**:

1. **Live Overview**
   - Current Viewers (Stat)
   - Peak Viewers (Stat)
   - Avg Join Time (Stat)
   - Live Error Rate (Stat)

2. **Viewership**
   - Concurrent Viewers (Time Series)
   - Viewers by Device (Pie Chart)
   - Geographic Map (Geomap)

3. **Performance**
   - Join Time P95 (Time Series)
   - Rebuffer Rate (Time Series)
   - Bitrate Ladder (Heatmap)

**File**: `dashboards/live-streaming.json`

---

### 3. Quality & Delivery Dashboard

**Purpose**: Technical performance deep-dive

**Key Metrics**:
- Player Performance
- Network Metrics
- CDN Performance
- Adaptive Bitrate Behavior

**Panels**:

1. **Player Metrics**
   - Player Startup Time
   - Seeking Performance
   - Dropped Frames
   - Buffer Health

2. **Network**
   - Throughput
   - CDN Response Time
   - Geographic Performance

3. **ABR Analysis**
   - Bitrate Switching Events
   - Quality Levels Distribution
   - Upshift/Downshift Ratio

**File**: `dashboards/quality-delivery.json`

---

### 4. Impact Explorer Dashboard

**Purpose**: Business impact analysis

**Key Metrics**:
- Viewer Engagement
- Watch Time
- Completion Rates
- Revenue Impact (calculated)

**Variables**:
- `org_id`
- `video_id`
- `content_type`
- `time_range`

**Panels**:

1. **Engagement Metrics**
   - Total Watch Time
   - Avg Session Duration
   - Completion Rate by Content
   - Quartile Completion

2. **Quality Impact**
   - Correlation: VST vs Completion
   - Correlation: Rebuffering vs Engagement
   - Quality Score

3. **Content Performance**
   - Top Videos by Views
   - Top Videos by Completion
   - Worst Performing Content

**File**: `dashboards/impact-explorer.json`

---

### 5. Worker Health Dashboard

**Purpose**: Monitor OpenQoE ingestion pipeline

**Key Metrics**:
- Events Ingested
- Processing Latency
- Error Rates
- Cardinality Stats

**Panels**:

1. **Ingestion**
   - Events/sec (Time Series)
   - Processing Latency (Heatmap)
   - Batch Sizes (Histogram)

2. **Health**
   - Worker Uptime
   - HTTP Status Codes
   - Prometheus Write Success Rate
   - Loki Push Success Rate

3. **Cardinality**
   - Unique Dimensions (Table)
   - Cardinality Growth (Time Series)
   - Governance Actions (Counter)

**File**: `dashboards/worker-health.json`

---

## Panel Descriptions

### Common Panel Queries

#### Video Startup Time (P95)

**Prometheus:**
```promql
histogram_quantile(0.95,
  sum(rate(openqoe_video_startup_seconds_bucket{
    org_id=~"$org_id",
    player_id=~"$player_id"
  }[$interval])) by (le)
)
```

#### Rebuffer Rate

**Prometheus:**
```promql
sum(rate(openqoe_rebuffer_events_total{
  org_id=~"$org_id"
}[$interval]))
/
sum(rate(openqoe_views_started_total{
  org_id=~"$org_id"
}[$interval]))
```

#### Error Rate

**Prometheus:**
```promql
sum(rate(openqoe_errors_total{
  org_id=~"$org_id"
}[$interval]))
/
sum(rate(openqoe_events_total{
  org_id=~"$org_id"
}[$interval]))
```

#### Recent Errors

**Loki:**
```logql
{org_id=~"$org_id", event_type="error"}
| json
| line_format "{{.data_error_family}}: {{.data_error_message}} (video={{.video_id}})"
```

#### Completion Rate by Video

**Prometheus:**
```promql
avg by (video_id) (
  openqoe_completion_rate{
    org_id=~"$org_id"
  }
)
```

---

## Variables

### Common Variables

Create these variables in all dashboards:

**org_id** (Query):
```promql
label_values(openqoe_events_total, org_id)
```
- Multi-value: Yes
- Include All: Yes

**player_id** (Query):
```promql
label_values(openqoe_events_total{org_id=~"$org_id"}, player_id)
```
- Multi-value: Yes
- Include All: Yes

**video_id** (Query):
```promql
label_values(openqoe_events_total{org_id=~"$org_id"}, video_id)
```
- Multi-value: Yes
- Include All: Yes

**device_category** (Custom):
```
desktop, mobile, tablet, tv
```
- Multi-value: Yes
- Include All: Yes

**interval** (Interval):
```
1m,5m,15m,30m,1h,6h,12h,1d
```
- Auto: Yes

---

## Alerts

### Configure Alert Rules in Grafana

#### High Video Startup Time

**Condition:**
```promql
histogram_quantile(0.95,
  sum(rate(openqoe_video_startup_seconds_bucket[5m])) by (le, org_id)
) > 3
```

**Alert**: P95 video startup time > 3 seconds for 5 minutes

#### High Rebuffer Rate

**Condition:**
```promql
sum(rate(openqoe_rebuffer_events_total[5m])) by (org_id)
/
sum(rate(openqoe_views_started_total[5m])) by (org_id)
> 0.1
```

**Alert**: Rebuffer rate > 10% for 5 minutes

#### High Error Rate

**Condition:**
```promql
sum(rate(openqoe_errors_total[5m])) by (org_id)
/
sum(rate(openqoe_events_total[5m])) by (org_id)
> 0.05
```

**Alert**: Error rate > 5% for 5 minutes

#### Low Completion Rate

**Condition:**
```promql
avg(openqoe_completion_rate) by (org_id, video_id) < 0.5
```

**Alert**: Completion rate < 50% for 10 minutes

---

## Dashboard Best Practices

### 1. Use Template Variables

- Allow filtering by org, player, video
- Enable drill-down analysis
- Reduce dashboard count

### 2. Set Appropriate Time Ranges

- Live: Last 15 minutes
- Operational: Last 6 hours
- Analysis: Last 7 days

### 3. Use Annotations

Mark key events:
- Deployments
- Incidents
- Configuration changes

### 4. Row Repeating

For multi-org dashboards, repeat rows by `$org_id`:

```json
{
  "repeat": "org_id",
  "repeatDirection": "v"
}
```

### 5. Panel Links

Add drill-down links:
- VOD Dashboard → Quality Dashboard
- Quality Dashboard → Loki logs
- Error panel → Error investigation dashboard

---

## Customization

### Custom Metrics

Add custom metrics panels:

```json
{
  "targets": [
    {
      "expr": "your_custom_metric{org_id=~\"$org_id\"}",
      "refId": "A"
    }
  ],
  "title": "Custom Metric",
  "type": "timeseries"
}
```

### Custom Thresholds

Set quality thresholds:

```json
{
  "thresholds": {
    "mode": "absolute",
    "steps": [
      { "color": "green", "value": null },
      { "color": "yellow", "value": 2 },
      { "color": "red", "value": 3 }
    ]
  }
}
```

### Custom Colors

Use consistent color scheme:

```json
{
  "fieldConfig": {
    "overrides": [
      {
        "matcher": { "id": "byName", "options": "desktop" },
        "properties": [{ "id": "color", "value": { "fixedColor": "blue" }}]
      },
      {
        "matcher": { "id": "byName", "options": "mobile" },
        "properties": [{ "id": "color", "value": { "fixedColor": "green" }}]
      }
    ]
  }
}
```

---

## Troubleshooting

### No Data Showing

1. Check data source connection
2. Verify time range
3. Check template variables
4. Verify metric names match

### Query Performance Issues

1. Reduce time range
2. Use recording rules for expensive queries
3. Add more specific label matchers
4. Increase query timeout

### Dashboard Load Times

1. Limit panel count (< 30 per dashboard)
2. Use shorter refresh intervals
3. Optimize queries
4. Enable query caching

---

## Export/Backup

### Export Dashboard

```bash
# Export single dashboard
curl -H "Authorization: Bearer ${API_KEY}" \
  "https://grafana.example.com/api/dashboards/uid/${DASHBOARD_UID}" \
  > dashboard-backup.json

# Export all dashboards in folder
grafana-backup export --folder "OpenQoE"
```

### Version Control

Store dashboards in Git:

```bash
dashboards/
├── vod-monitoring.json
├── live-streaming.json
├── quality-delivery.json
├── impact-explorer.json
└── worker-health.json
```

---

## Next Steps

- Review [Prometheus Setup](./PROMETHEUS_SETUP.md)
- Review [Loki Setup](./LOKI_SETUP.md)
- Configure alerting rules
- Create custom dashboards for your use case
