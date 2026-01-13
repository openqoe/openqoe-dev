# OpenQoE Production Deployment Checklist

Complete validation checklist for deploying OpenQoE to production.

## Pre-Deployment Validation

- [ ] **Go code builds successfully**
  ```bash
  cd worker
  go build -o openqoe-worker
  ```

- [ ] **Environment variables configured** (.env or shell)
  - [ ] `OTEL_URL` (Alloy endpoint)
  - [ ] `API_KEY` (Ingest authentication)
  - [ ] `DESTINATION_TYPE` (SelfHosted or GrafanaCloud)
  - [ ] `LOG_LEVEL` (info/debug)

### 2. SDK Validation

- [ ] **All 5 player adapters tested**
  - [ ] HTML5 adapter
  - [ ] Video.js adapter
  - [ ] HLS.js adapter
  - [ ] dash.js adapter
  - [ ] Shaka Player adapter

- [ ] **Demo pages work correctly**
  ```bash
  # Test each demo
  cd demo
  npx http-server -p 8080
  # Visit http://localhost:8080 and test each player
  ```

- [ ] **All 24+ event types captured**
  - [ ] playerready
  - [ ] viewstart
  - [ ] playing
  - [ ] ... (see API Reference for full list)

### 3. Observability Stack Validation

- [ ] **Docker services healthy**
  ```bash
  docker compose ps
  # All services should show "Up (healthy)"
  ```

- [ ] **Mimir accessible**
  ```bash
  curl http://localhost:9009/ready
  # Should return "ready"
  ```

- [ ] **Loki accessible**
  ```bash
  curl http://localhost:3100/ready
  # Should return "ready"
  ```

- [ ] **Grafana accessible**
  ```bash
  curl http://localhost:3000/api/health
  # Should return {"database":"ok"}
  ```

### 4. Recording Rules Validation

- [ ] **Recording rules loaded**
  ```bash
  cd observability/prometheus/rules
  ./load-rules.sh http://localhost:9009
  ```

- [ ] **Verify rules are active**
  ```bash
  curl -s http://localhost:9009/prometheus/config/v1/rules/anonymous | jq '.data'
  # Should show recording rules configuration
  ```

- [ ] **Check recording rule metrics**
  ```bash
  curl -s 'http://localhost:9009/prometheus/api/v1/query?query=openqoe:video_startup_seconds:p95' | jq '.data.result'
  # Should return data after events are ingested
  ```

### 5. Alert Rules Validation

- [ ] **Alert rules loaded**
  ```bash
  curl -X POST \
    "http://localhost:9009/prometheus/config/v1/rules/anonymous" \
    -H "Content-Type: application/yaml" \
    --data-binary "@observability/prometheus/rules/openqoe-alert-rules.yml"
  ```

- [ ] **Verify alert rules are active**
  ```bash
  curl -s http://localhost:9009/prometheus/api/v1/rules | jq '.data.groups[].name'
  # Should show: quality_critical, business_impact, performance, live_streaming, pipeline_health
  ```

- [ ] **Test alert notification** (optional but recommended)
  - Temporarily trigger an alert condition
  - Verify alert fires and notifications work

### 6. Dashboard Validation

- [ ] **All 4 dashboards visible** in Grafana
  - [ ] VOD Monitoring
  - [ ] Live Streaming
  - [ ] Quality & Delivery
  - [ ] Impact Explorer

- [ ] **Datasources configured correctly**
  - [ ] Mimir (default)
  - [ ] Loki

- [ ] **Template variables populate**
  - Open any dashboard
  - Check that `org_id`, `player_id`, `video_id` dropdowns show values

- [ ] **Panels show data**
  - Generate test events
  - Verify panels display metrics within 1-2 minutes

## Deployment Steps

### Option A: Self-Hosted with Docker

1. [ ] **Start observability stack**
   ```bash
   docker compose up -d
   docker compose ps  # Verify all healthy
   ```

2. [ ] **Load rules**
   ```bash
   cd observability/prometheus/rules
   ./load-rules.sh http://localhost:9009

   curl -X POST \
     "http://localhost:9009/prometheus/config/v1/rules/anonymous" \
     -H "Content-Type: application/yaml" \
     --data-binary "@openqoe-alert-rules.yml"
   ```

3. [ ] **Configure worker for local dev**
   ```bash
   cd worker
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars with localhost URLs
   ```

4. [ ] **Run worker locally**
   ```bash
   npm run dev
   # Worker runs at http://localhost:8787
   ```

5. [ ] **Test end-to-end**
   - Open demo page
   - Play video
   - Check Grafana dashboards for data

1. [ ] **Configure environment variables** (see Step 1)

2. [ ] **Build and start worker**
   ```bash
   cd worker
   go build -o openqoe-worker
   ./openqoe-worker
   ```

5. [ ] **Test production deployment**
   - Deploy SDK to staging environment
   - Generate test events
   - Verify metrics appear in Grafana

## Post-Deployment Validation

### 1. Data Flow Validation

- [ ] **Events being received**
  ```bash
  # Check event ingestion rate
  curl -s 'http://localhost:9009/prometheus/api/v1/query?query=rate(openqoe_events_total[5m])'
  ```

- [ ] **Histogram buckets populated**
  ```bash
  # Check VST histogram
  curl -s 'http://localhost:9009/prometheus/api/v1/query?query=openqoe_video_startup_seconds_bucket'
  ```

- [ ] **Recording rules calculating**
  ```bash
  # Check P95 VST
  curl -s 'http://localhost:9009/prometheus/api/v1/query?query=openqoe:video_startup_seconds:p95'
  ```

- [ ] **Logs flowing to Loki**
  ```bash
  # Check error logs
  curl -s 'http://localhost:3100/loki/api/v1/query?query={event_type="error"}&limit=10'
  ```

### 2. Dashboard Validation

- [ ] **VOD Monitoring Dashboard**
  - [ ] Total Views shows count
  - [ ] VST Percentiles graph shows P50/P95/P99
  - [ ] VST Heatmap shows distribution
  - [ ] Quartile funnel shows 25/50/75/100% markers
  - [ ] Resolution distribution shows breakdown
  - [ ] Error logs panel shows recent errors

- [ ] **Live Streaming Dashboard**
  - [ ] Current Viewers shows count (if live stream active)
  - [ ] Join Time shows P95
  - [ ] Geographic map shows viewer locations

- [ ] **Quality & Delivery Dashboard**
  - [ ] Seek latency shows P50/P95
  - [ ] Dropped frames graph shows data
  - [ ] ABR switches tracked

- [ ] **Impact Explorer Dashboard**
  - [ ] Watch time shows total hours
  - [ ] Completion rate by video populated
  - [ ] Revenue impact calculated

### 3. Alert Validation

- [ ] **Alert rules evaluating**
  ```bash
  # Check alert status
  curl -s http://localhost:9009/prometheus/api/v1/rules | jq '.data.groups[].rules[] | select(.type=="alerting") | {alert:.name, state:.state}'
  ```

- [ ] **No unexpected firing alerts** in fresh deployment

- [ ] **Alert notification channels configured** (if using Alertmanager)

### 4. Performance Validation

- [ ] **Dashboard load times acceptable** (<3 seconds)

- [ ] **Recording rules reducing query time**
  - Compare query time for raw histogram_quantile vs recording rule
  - Recording rule should be 10-50x faster

- [ ] **Mimir ingestion keeping up**
  ```bash
  # Check ingestion lag
  docker compose logs mimir | grep "lag"
  ```

- [ ] **No memory/CPU issues**
  ```bash
  docker stats
  # Mimir should use <2GB RAM for moderate load
  # Grafana should use <500MB RAM
  ```

### 5. Cardinality Validation

- [ ] **Check cardinality per dimension**
  ```bash
  # Via worker /stats endpoint
  curl 'http://localhost:8787/stats?dimension=video_id' \
    -H 'X-API-Key: your-api-key'
  ```

- [ ] **Verify cardinality governance working**
  - High-cardinality dimensions (session_id, view_id) should be hashed
  - Medium-cardinality dimensions (video_id) should be bucketed if >10k
  - Low-cardinality dimensions should pass through

- [ ] **No cardinality explosions**
  ```bash
  # Check total series count
  curl -s 'http://localhost:9009/prometheus/api/v1/query?query=count(openqoe_events_total)'
  # Should be reasonable for your traffic (<100k series for moderate load)
  ```

## Production Monitoring

### Key Metrics to Monitor

- [ ] **Event ingestion rate**
  - Query: `rate(openqoe_events_total[5m])`
  - Alert if drops to 0 for >5 minutes

- [ ] **P95 Video Startup Time**
  - Query: `openqoe:video_startup_seconds:p95`
  - Alert if >3 seconds for >5 minutes

- [ ] **Rebuffer Rate**
  - Query: `openqoe:rebuffer_rate:per_view`
  - Alert if >10% for >5 minutes

- [ ] **Error Rate**
  - Query: `openqoe:error_rate:per_view`
  - Alert if >5% for >5 minutes

- [ ] **Completion Rate**
  - Query: `openqoe:completion_rate`
  - Alert if <50% for >10 minutes

### Health Checks

- [ ] **Worker /health endpoint** returns 200
  ```bash
  curl -f http://localhost:8787/health
  ```

- [ ] **Mimir /ready endpoint** returns "ready"
  ```bash
  curl http://localhost:9009/ready
  ```

- [ ] **Loki /ready endpoint** returns "ready"
  ```bash
  curl http://localhost:3100/ready
  ```

- [ ] **Grafana /api/health** returns ok
  ```bash
  curl http://localhost:3000/api/health
  ```

## Troubleshooting

### Issue: Dashboards show "No Data"

**Diagnosis**:
```bash
# 1. Check if worker is receiving events
curl 'http://localhost:8787/stats' -H 'X-API-Key: your-api-key'

# 2. Check if Mimir is receiving metrics
curl 'http://localhost:9009/prometheus/api/v1/query?query=openqoe_events_total'

# 3. Check Mimir logs
docker compose logs mimir | tail -50
```

**Common Causes**:
- Worker not deployed or wrong URL in SDK
- Network connectivity (worker can't reach Mimir)
- Authentication failing
- KV namespace not bound

### Issue: P95/P99 showing incorrect values

**Diagnosis**:
```bash
# Check if histogram buckets exist
curl 'http://localhost:9009/prometheus/api/v1/query?query=openqoe_video_startup_seconds_bucket'
```

**Common Causes**:
- Worker not using histogram format (old gauge-based metrics)
- Recording rules not loaded
- Incorrect histogram_quantile() query

### Issue: Alerts not firing

**Diagnosis**:
```bash
# Check if alert rules are loaded
curl 'http://localhost:9009/prometheus/api/v1/rules'

# Check alert evaluation
docker compose logs mimir | grep "alert"
```

**Common Causes**:
- Alert rules not loaded via API
- Alert thresholds too strict for current traffic
- Alertmanager not configured

### Issue: High memory usage

**Diagnosis**:
```bash
docker stats

# Check series count
curl 'http://localhost:9009/prometheus/api/v1/query?query=count(openqoe_events_total)'
```

**Common Causes**:
- Cardinality explosion (too many unique label combinations)
- Cardinality governance not working
- Retention period too long for available memory

## Rollback Plan

If deployment fails:

1. [ ] **Rollback worker**
   ```bash
   # Revert to previous stable container/binary version
   ```

2. [ ] **Revert SDK changes** in your application

3. [ ] **Stop Docker services** if needed
   ```bash
   docker compose down
   ```

4. [ ] **Restore from backup** if data corruption
   ```bash
   # Restore Mimir
   tar xzf mimir-backup.tar.gz -C /

   # Restart services
   docker compose up -d
   ```

## Sign-Off

### Development Team

- [ ] Code reviewed and approved
- [ ] Tests passing
- [ ] Documentation updated

### Operations Team

- [ ] Infrastructure provisioned
- [ ] Secrets configured securely
- [ ] Monitoring configured
- [ ] Runbooks documented

### Business Team

- [ ] Dashboards validated
- [ ] Alerts configured
- [ ] SLAs defined

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Approved By**: _______________

**Production URL**: _______________

**Monitoring URL**: _______________
