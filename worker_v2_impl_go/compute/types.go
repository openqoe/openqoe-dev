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
	events_total               metric.Int64Counter
	player_startup_time        metric.Float64Gauge
	page_load_time             metric.Float64Gauge
	views_started_total        metric.Int64Counter
	video_startup_time         metric.Float64Histogram
	bitrate                    metric.Float64Gauge
	resolution_total           metric.Int64Counter
	rebuffer_events_total      metric.Int64Counter
	buffer_length              metric.Float64Gauge
	rebuffer_duration          metric.Float64Histogram
	seek_total                 metric.Int64Counter
	seek_latency               metric.Float64Histogram
	views_completed_total      metric.Int64Counter
	playing_time               metric.Float64Gauge
	completion_rate            metric.Float64Gauge
	rebuffer_count             metric.Float64Gauge
	errors_total               metric.Int64Counter
	heart_beat_playing_time    metric.Float64Gauge
	heart_beat_bitrate         metric.Float64Gauge
	dropped_frames_total       metric.Float64Gauge
	quartile_reached_total     metric.Int64Counter
	pause_events_total         metric.Int64Counter
	pause_playing_time         metric.Float64Gauge
	quality_change_total       metric.Int64Counter
	quality_change_bitrate     metric.Float64Gauge
	quality_change_old_bitrate metric.Float64Gauge
}
type MetricsService struct {
	config              *config.Config
	cardinality_service *config.CardinalityService
	otel_service        *otelservice.OpenTelemetryService
	metrics             *computedMetrics
}
