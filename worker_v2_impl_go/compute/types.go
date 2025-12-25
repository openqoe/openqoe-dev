package compute

import (
	"time"

	"go.opentelemetry.io/otel/metric"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/otelservice"
)

type Label struct {
	Name  string
	Value string
}

type Sample struct {
	Value     float64
	Timestamp time.Time
}
type TimeSeries struct {
	Labels  []Label
	Samples []Sample
}

type resolution struct {
	width  int64
	height int64
}
type computedMetrics struct {
	events_total          metric.Int64Counter
	player_startup_time   metric.Float64Gauge
	page_load_time        metric.Float64Gauge
	views_started_total   metric.Int64Counter
	video_startup_time    metric.Float64Histogram
	bitrate               metric.Float64Gauge
	resolution_total      metric.Int64Counter
	rebuffer_events_total metric.Int64Counter
	buffer_length         metric.Float64Gauge
	rebuffer_duration     metric.Float64Histogram
	seek_total            metric.Int64Counter
	seek_latency          metric.Float64Histogram
	views_completed_total metric.Int64Counter
}
type MetricsService struct {
	config              *config.Config
	cardinality_service *config.CardinalityService
	otel_service        *otelservice.OpenTelemetryService
	metrics             *computedMetrics
}
