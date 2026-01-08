package compute

import (
	"context"

	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/otelservice"
	"openqoe.dev/worker_v2/requesthandlers"
)

func NewMetricsService(config *config.Config, cardinality_service *config.CardinalityService, otelservice *otelservice.OpenTelemetryService) *MetricsService {
	meter := otelservice.Meter
	events_total, _ := meter.Int64Counter("openqoe.events_total", metric.WithDescription("Total number of events received"))
	network_bandwidth, _ := meter.Int64Gauge("openqoe.network_bandwidth", metric.WithDescription("Current network bandwidth measured for the given media"), metric.WithUnit("bps"))
	loading_delay, _ := meter.Int64Gauge("openqoe.loading_delay", metric.WithDescription("loading delay of the fragments"), metric.WithUnit("ns"))
	frag_size, _ := meter.Int64Gauge("openqoe.fragment_size", metric.WithDescription("size of the current fragment"), metric.WithUnit("bytes"))
	frag_duration, _ := meter.Int64Gauge("openqoe.fragment_duration", metric.WithDescription("duration of the current fragment"), metric.WithUnit("s"))
	buffered_duration, _ := meter.Int64Counter("openqoe.buffered_duration", metric.WithDescription("total duration of buffered content, measured by adding up downloaded fragment durations"), metric.WithUnit("s"))
	player_startup_time, _ := meter.Float64Gauge("openqoe.player_startup_time", metric.WithDescription("Time taken by player to start"), metric.WithUnit("ms"))
	page_load_time, _ := meter.Float64Gauge("openqoe.page_load_time", metric.WithDescription("Time taken by page to load"), metric.WithUnit("ms"))
	view_started_total, _ := meter.Int64Counter("openqoe.view_started_total", metric.WithDescription("Total number of viewers who started watching the video"))
	video_startup_time, _ := meter.Float64Histogram("openqoe.video_startup_time",
		metric.WithDescription("Time taken by video to start"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(100, 250, 500, 1000, 2000, 3000, 5000, 10000, 15000, 30000),
	)
	bitrate, _ := meter.Float64Gauge("openqoe.bitrate", metric.WithDescription("Bitrate of the video"), metric.WithUnit("bps"))
	framerate, _ := meter.Int64Gauge("openqoe.framerate", metric.WithDescription("frames per secons for the video"), metric.WithUnit("fps"))
	resolution_total, _ := meter.Int64Counter("openqoe.resolution_total", metric.WithDescription("Total number of viewers who started watching the video"))
	rebuffer_events_total, _ := meter.Int64Counter("openqoe.rebuffer_events_total", metric.WithDescription("Total number of rebuffer events"))
	buffer_length, _ := meter.Float64Gauge("openqoe.buffer_length", metric.WithDescription("Buffer length of the video"), metric.WithUnit("ms"))
	rebuffer_duration, _ := meter.Float64Histogram("openqoe.rebuffer_duration",
		metric.WithDescription("Duration of rebuffer events"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(500, 1000, 2000, 3000, 5000, 10000, 30000),
	)
	seek_total, _ := meter.Int64Counter("openqoe.seek_total", metric.WithDescription("Total number of seeks"))
	seek_latency, _ := meter.Float64Histogram("openqoe.seek_latency",
		metric.WithDescription("Latency of seeks"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(100, 250, 500, 1000, 2000, 5000),
	)
	views_completed_total, _ := meter.Int64Counter("openqoe.views_completed_total", metric.WithDescription("Total number of viewers who completed watching the video"))
	playing_time, _ := meter.Float64Gauge("openqoe.playing_time", metric.WithDescription("Total playing time of the video"), metric.WithUnit("ms"))
	completion_rate, _ := meter.Float64Gauge("openqoe.completion_rate", metric.WithDescription("Completion rate of the video"), metric.WithUnit("%"))
	rebuffer_count, _ := meter.Float64Gauge("openqoe.rebuffer_count", metric.WithDescription("Total number of rebuffer events"))
	errors_total, _ := meter.Int64Counter("openqoe.errors_total", metric.WithDescription("Total number of errors"))
	heart_beat_playing_time, _ := meter.Float64Gauge("openqoe.heart_beat_playing_time", metric.WithDescription("Player ping time"), metric.WithUnit("ms"))
	heart_beat_rate_bps, _ := meter.Float64Gauge("openqoe.heart_beat_rate_bps", metric.WithDescription("Player ping bitrate"), metric.WithUnit("bps"))
	dropped_frames_total, _ := meter.Float64Gauge("openqoe.dropped_frames_total", metric.WithDescription("Total number of dropped frames"))
	quartile_reached_total, _ := meter.Int64Counter("openqoe.quartile_reached_total", metric.WithDescription("Total number of quartiles reached"))
	pause_events_total, _ := meter.Int64Counter("openqoe.pause_events_total", metric.WithDescription("Total number of pause events"))
	pause_playing_time, _ := meter.Float64Gauge("openqoe.pause_playing_time", metric.WithDescription("Total time video was paused"), metric.WithUnit("ms"))
	quality_change_total, _ := meter.Int64Counter("openqoe.quality_change_total", metric.WithDescription("Total number of quality changes"))
	quality_change_bitrate, _ := meter.Float64Gauge("openqoe.quality_change_bitrate_bps", metric.WithDescription("Bitrate after quality change"), metric.WithUnit("bps"))
	quality_change_old_bitrate, _ := meter.Float64Gauge("openqoe.quality_change_old_bitrate_bps", metric.WithDescription("Bitrate before quality change"), metric.WithUnit("bps"))
	return &MetricsService{
		config:              config,
		cardinality_service: cardinality_service,
		otel_service:        otelservice,
		metrics: &computedMetrics{
			events_total:               events_total,
			network_bandwidth:          network_bandwidth,
			loading_delay:              loading_delay,
			frag_size:                  frag_size,
			frag_duration:              frag_duration,
			buffered_duration:          buffered_duration,
			player_startup_time:        player_startup_time,
			page_load_time:             page_load_time,
			views_started_total:        view_started_total,
			video_startup_time:         video_startup_time,
			bitrate:                    bitrate,
			framerate:                  framerate,
			resolution_total:           resolution_total,
			rebuffer_events_total:      rebuffer_events_total,
			buffer_length:              buffer_length,
			rebuffer_duration:          rebuffer_duration,
			seek_total:                 seek_total,
			seek_latency:               seek_latency,
			views_completed_total:      views_completed_total,
			playing_time:               playing_time,
			completion_rate:            completion_rate,
			rebuffer_count:             rebuffer_count,
			errors_total:               errors_total,
			heart_beat_playing_time:    heart_beat_playing_time,
			heart_beat_bitrate:         heart_beat_rate_bps,
			dropped_frames_total:       dropped_frames_total,
			quartile_reached_total:     quartile_reached_total,
			pause_events_total:         pause_events_total,
			pause_playing_time:         pause_playing_time,
			quality_change_total:       quality_change_total,
			quality_change_bitrate:     quality_change_bitrate,
			quality_change_old_bitrate: quality_change_old_bitrate,
		},
	}
}

func (ms *MetricsService) ComputeMetrics(events_chunk *requesthandlers.IngestRequestWithContext, logger *zap.Logger) {
	logger = logger.With(zap.String("sub-component", "metrics-compute-service"))
	for _, event := range events_chunk.Events {
		logger.Debug("Processing event", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
		ms.transformEventsToMetrics(events_chunk.Ctx, event, events_chunk.Marker)
		logger.Debug("Event processing success", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
	}
}

func (ms *MetricsService) transformEventsToMetrics(evnt_ctx context.Context, event requesthandlers.BaseEvent, marker string) {
	base_labels := ms.extractBaseLabels(event, marker)
	base_attributes := mapToAttributeSet(base_labels)
	ms.metrics.events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
	switch event.EventType {
	case "fragmentloaded":
		ms.onFragmentLoaded(&event, evnt_ctx, base_labels)
	case "manifestload":
		ms.onManifestLoad(&event, marker, evnt_ctx, &base_attributes)
	case "bitratechange":
		ms.onBitrateChange(&event, evnt_ctx, &base_attributes, base_labels)
	case "bufferlevelchange":
		ms.onBufferLevelChange(&event, evnt_ctx, &base_attributes)
	case "playerready":
		ms.onPlayerReady(&event, evnt_ctx, &base_attributes)
	case "canplay":
		ms.onCanPlay(&event, evnt_ctx, &base_attributes)
	case "playing":
		ms.onPlaying(&event, evnt_ctx, &base_attributes)
	case "stallstart":
		ms.onStallStart(&event, evnt_ctx, &base_attributes)
	case "stallend":
		ms.onStallEnd(&event, evnt_ctx, &base_attributes)
	case "seek":
		ms.onSeek(&event, evnt_ctx, &base_attributes)
	case "ended":
		ms.onEnded(&event, evnt_ctx, &base_attributes)
	case "error":
		ms.onError(&event, evnt_ctx, base_labels)
	case "heartbeat":
		ms.onHeartbeat(&event, evnt_ctx, &base_attributes)
	case "quartile":
		ms.onQuartile(&event, evnt_ctx, base_labels)
	case "pause":
		ms.onPause(&event, evnt_ctx, &base_attributes)
	case "qualitychange":
		ms.onQualityChange(&event, evnt_ctx, base_labels, &base_attributes)
	default:
		ms.otel_service.Logger.Warn("Unknown event type received for metrics computation", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
	}
}
