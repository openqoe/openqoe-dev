package compute

import (
	"time"

	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
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
	bitrate_change                   metric.Float64Counter
	buffer_instability_index         metric.Float64Gauge
	buffer_length                    metric.Float64Histogram
	buffered_duration                metric.Int64Counter
	completion_rate                  metric.Float64Gauge
	dropped_frames_total             metric.Float64Gauge
	errors_total                     metric.Int64Counter
	events_total                     metric.Int64Counter
	exit_without_play                metric.Int64Counter
	frag_duration                    metric.Int64Gauge
	frag_size                        metric.Int64Gauge
	framerate                        metric.Int64Gauge
	heart_beat_bitrate               metric.Float64Gauge
	heart_beat_playing_time          metric.Float64Gauge
	network_bandwidth                metric.Int64Counter
	network_latency                  metric.Int64Gauge
	network_latency_deviation        metric.Float64Gauge
	page_load_time                   metric.Float64Gauge
	pause_events_total               metric.Int64Counter
	pause_playing_time               metric.Float64Gauge
	perceived_quality_index          metric.Float64Histogram
	player_startup_time              metric.Float64Gauge
	playing_time                     metric.Float64Gauge
	quality_change_bitrate           metric.Float64Gauge
	quality_change_old_bitrate       metric.Float64Gauge
	quality_change_request_total     metric.Int64Counter
	quality_change_total             metric.Int64Counter
	quality_switch_latency           metric.Int64Gauge
	quartile_reached_total           metric.Int64Counter
	rebuffer_duration                metric.Int64Histogram
	rebuffer_events_count            metric.Int64Counter
	resolution_total                 metric.Int64Counter
	resolution_to_player_ratio       metric.Float64Histogram
	seek_latency                     metric.Float64Histogram
	seek_total                       metric.Int64Counter
	stall_position                   metric.Int64Histogram
	stay_duration                    metric.Int64Histogram
	time_weighted_average_bitrate    metric.Float64Gauge
	time_weighted_average_resolution metric.Float64Gauge
	video_startup_time               metric.Float64Histogram
	views_completed_total            metric.Int64Counter
	views_started_total              metric.Int64Counter
}
type MetricsService struct {
	config              *config.Config
	cardinality_service *config.CardinalityService
	otel_service        *otelservice.OpenTelemetryService
	logger              *zap.Logger
	metrics             *computedMetrics
}
