package compute

import (
	"context"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/otelservice"
	"openqoe.dev/worker_v2/requesthandlers"
)

func NewMetricsService(config *config.Config, cardinality_service *config.CardinalityService, otelservice *otelservice.OpenTelemetryService, parent_logger *zap.Logger) *MetricsService {
	meter := otelservice.Meter
	logger := parent_logger.With(zap.String("sub-component", "compute"))
	// Metrics defined in lexicographical order by variable name
	bitrate_change, _ := meter.Float64Counter("openqoe.bitrate_change", metric.WithDescription("Change of bitrate in the video"), metric.WithUnit("bps"))
	buffer_instability_index, _ := meter.Float64Gauge("openqoe.buffer_instability_index", metric.WithDescription("Standard deviation of the buffer length from the moving average"))
	// bucket boundaries are exponential following the curve:
	// y = (e^(0.15x)-1)*100
	buffer_length, _ := meter.Float64Histogram("openqoe.buffer_length", metric.WithDescription("Buffer length of the video"), metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(100, 350, 850, 1900, 4100, 8900, 18900))
	buffered_duration, _ := meter.Int64Counter("openqoe.buffered_duration", metric.WithDescription("total duration of buffered content, measured by adding up downloaded fragment durations"), metric.WithUnit("s"))
	completion_rate, _ := meter.Float64Gauge("openqoe.completion_rate", metric.WithDescription("Completion rate of the video"), metric.WithUnit("%"))
	dropped_frames_total, _ := meter.Float64Gauge("openqoe.dropped_frames_total", metric.WithDescription("Total number of dropped frames"))
	errors_total, _ := meter.Int64Counter("openqoe.errors_total", metric.WithDescription("Total number of errors"))
	events_total, _ := meter.Int64Counter("openqoe.events_total", metric.WithDescription("Total number of events received"))
	exit_without_play, _ := meter.Int64Counter("openqoe.exit_without_play", metric.WithDescription("Total number of user exits without playing"))
	frag_duration, _ := meter.Int64Gauge("openqoe.fragment_duration", metric.WithDescription("duration of the current fragment"), metric.WithUnit("s"))
	frag_size, _ := meter.Int64Gauge("openqoe.fragment_size", metric.WithDescription("size of the current fragment"), metric.WithUnit("bytes"))
	framerate, _ := meter.Int64Gauge("openqoe.framerate", metric.WithDescription("frames per secons for the video"), metric.WithUnit("fps"))
	heart_beat_playing_time, _ := meter.Float64Gauge("openqoe.heart_beat_playing_time", metric.WithDescription("Player ping time"), metric.WithUnit("ms"))
	heart_beat_rate_bps, _ := meter.Float64Gauge("openqoe.heart_beat_rate_bps", metric.WithDescription("Player ping bitrate"), metric.WithUnit("bps"))
	network_bandwidth, _ := meter.Int64Counter("openqoe.network.bandwidth", metric.WithDescription("Current network bandwidth measured for the given media"), metric.WithUnit("bps"))
	network_latency, _ := meter.Int64Gauge("openqoe.network.latency", metric.WithDescription("loading delay of the fragments"), metric.WithUnit("ms"))
	network_latency_deviation, _ := meter.Float64Gauge("openqoe.network.latency_deviation", metric.WithDescription("Standard deviations of fragment download time from moving average"))
	page_load_time, _ := meter.Float64Gauge("openqoe.page_load_time", metric.WithDescription("Time taken by page to load"), metric.WithUnit("ms"))
	pause_events_total, _ := meter.Int64Counter("openqoe.pause_events_total", metric.WithDescription("Total number of pause events"))
	pause_playing_time, _ := meter.Float64Gauge("openqoe.pause_playing_time", metric.WithDescription("Total time video was paused"), metric.WithUnit("ms"))
	perceived_quality_index, _ := meter.Float64Histogram("openqoe.perceived_quality_index", metric.WithDescription("Bits Per Pixel of the rendered video"), metric.WithExplicitBucketBoundaries(0.05, 0.10, 0.15, 0.25))
	player_startup_time, _ := meter.Float64Gauge("openqoe.player_startup_time", metric.WithDescription("Time taken by player to start"), metric.WithUnit("ms"))
	playing_time, _ := meter.Float64Gauge("openqoe.playing_time", metric.WithDescription("Total playing time of the video"), metric.WithUnit("ms"))
	quality_change_bitrate, _ := meter.Float64Gauge("openqoe.quality_change_bitrate_bps", metric.WithDescription("Bitrate after quality change"), metric.WithUnit("bps"))
	quality_change_latency, _ := meter.Int64Gauge("openqoe.quality_change_latency", metric.WithDescription("Time between a Quality being requestes and the Quality being visible to User"), metric.WithUnit("ms"))
	quality_change_old_bitrate, _ := meter.Float64Gauge("openqoe.quality_change_old_bitrate_bps", metric.WithDescription("Bitrate before quality change"), metric.WithUnit("bps"))
	quality_change_req_total, _ := meter.Int64Counter("openqoe.quality_change_request_total", metric.WithDescription("Total number of quality change requests"))
	quality_change_total, _ := meter.Int64Counter("openqoe.quality_change_total", metric.WithDescription("Total number of quality changes"))
	quartile_reached_total, _ := meter.Int64Counter("openqoe.quartile_reached_total", metric.WithDescription("Total number of quartiles reached"))
	rebuffer_duration, _ := meter.Int64Histogram("openqoe.rebuffer_duration",
		metric.WithDescription("Duration of rebuffer events"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(500, 1000, 2000, 3000, 5000, 10000, 30000),
	)
	rebuffer_events_count, _ := meter.Int64Counter("openqoe.rebuffer_events_count", metric.WithDescription("Count of rebuffer events"))
	resolution_total, _ := meter.Int64Counter("openqoe.resolution_total", metric.WithDescription("Total number of viewers who started watching the video"))
	resolution_to_player_ratio, _ := meter.Float64Histogram("openqoe.resolution_to_player_ratio", metric.WithDescription("Ratio of resolution to player size. Shows under sampling and over sampling of video"), metric.WithUnit("ratio"), metric.WithExplicitBucketBoundaries(0.5, 0.9, 1.1, 2.1, 3.0))
	seek_latency, _ := meter.Float64Histogram("openqoe.seek_latency",
		metric.WithDescription("Latency of seeks"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(100, 250, 500, 1000, 2000, 5000),
	)
	seek_total, _ := meter.Int64Counter("openqoe.seek_total", metric.WithDescription("Total number of seeks"))
	stall_position, _ := meter.Int64Histogram("openqoe.stall_position", metric.WithDescription("Position of stalls"), metric.WithUnit("ms"))
	stay_duration, _ := meter.Int64Histogram("openqoe.stay_duration", metric.WithDescription("Duration of user staying on the page"), metric.WithUnit("ms"))
	time_weighted_average_bitrate, _ := meter.Float64Gauge("openqoe.time_weighted_average_bitrate", metric.WithDescription("Time weighted average of the quality of the rendered video"))
	time_weighted_average_resolution, _ := meter.Float64Gauge("openqoe.time_weighted_average_resolution", metric.WithDescription("Time weighted average of the resolution of the rendered video"))
	video_startup_time, _ := meter.Float64Histogram("openqoe.video_startup_time",
		metric.WithDescription("Time taken by video to start"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(100, 250, 500, 1000, 2000, 3000, 5000, 10000, 15000, 30000),
	)
	views_completed_total, _ := meter.Int64Counter("openqoe.views_completed_total", metric.WithDescription("Total number of viewers who completed watching the video"))
	views_started_total, _ := meter.Int64Counter("openqoe.view_started_total", metric.WithDescription("Total number of viewers who started watching the video"))

	return &MetricsService{
		config:              config,
		cardinality_service: cardinality_service,
		otel_service:        otelservice,
		logger:              logger,
		metrics: &computedMetrics{
			buffer_instability_index:         buffer_instability_index,
			bitrate_change:                   bitrate_change,
			buffer_length:                    buffer_length,
			buffered_duration:                buffered_duration,
			completion_rate:                  completion_rate,
			dropped_frames_total:             dropped_frames_total,
			errors_total:                     errors_total,
			events_total:                     events_total,
			exit_without_play:                exit_without_play,
			frag_duration:                    frag_duration,
			frag_size:                        frag_size,
			framerate:                        framerate,
			heart_beat_bitrate:               heart_beat_rate_bps,
			heart_beat_playing_time:          heart_beat_playing_time,
			network_bandwidth:                network_bandwidth,
			network_latency:                  network_latency,
			network_latency_deviation:        network_latency_deviation,
			page_load_time:                   page_load_time,
			pause_events_total:               pause_events_total,
			pause_playing_time:               pause_playing_time,
			perceived_quality_index:          perceived_quality_index,
			player_startup_time:              player_startup_time,
			playing_time:                     playing_time,
			quality_change_bitrate:           quality_change_bitrate,
			quality_switch_latency:           quality_change_latency,
			quality_change_old_bitrate:       quality_change_old_bitrate,
			quality_change_request_total:     quality_change_req_total,
			quality_change_total:             quality_change_total,
			quartile_reached_total:           quartile_reached_total,
			rebuffer_duration:                rebuffer_duration,
			rebuffer_events_count:            rebuffer_events_count,
			resolution_total:                 resolution_total,
			resolution_to_player_ratio:       resolution_to_player_ratio,
			seek_latency:                     seek_latency,
			seek_total:                       seek_total,
			stall_position:                   stall_position,
			stay_duration:                    stay_duration,
			time_weighted_average_bitrate:    time_weighted_average_bitrate,
			time_weighted_average_resolution: time_weighted_average_resolution,
			video_startup_time:               video_startup_time,
			views_completed_total:            views_completed_total,
			views_started_total:              views_started_total,
		},
	}
}

func (ms *MetricsService) ComputeMetrics(events_chunk *requesthandlers.IngestRequestWithContext, tracer trace.Tracer, parent_span_ctx context.Context) {
	logger := ms.logger.With(zap.String("method", "compute-metrics"))
	for _, event := range events_chunk.Events {
		func() {
			span_ctx, span := tracer.Start(parent_span_ctx, "compute-metrics", trace.WithSpanKind(trace.SpanKindInternal), trace.WithAttributes(attribute.String("event-type", event.EventType)))
			defer span.End()
			logger.Debug("Processing event", zap.String("event-type", event.EventType), zap.String("view-id", event.ViewId))
			ms.transformEventsToMetrics(span_ctx, event, events_chunk.Marker)
			logger.Debug("Event processing success", zap.String("event-type", event.EventType), zap.String("view-id", event.ViewId))
		}()

	}
}

func (ms *MetricsService) transformEventsToMetrics(span_ctx context.Context, event requesthandlers.BaseEvent, marker string) {
	base_labels := ms.extractBaseLabels(event, marker)
	base_attributes := mapToAttributeSet(base_labels)
	ms.metrics.events_total.Add(span_ctx, 1, metric.WithAttributeSet(base_attributes))
	switch event.EventType {
	case "fragmentloaded":
		ms.onFragmentLoaded(&event, span_ctx, base_labels)
	case "manifestload":
		ms.onManifestLoad(&event, marker, span_ctx, &base_attributes)
	case "playerready":
		ms.onPlayerReady(&event, span_ctx, &base_attributes)
	case "bufferlevelchange":
		ms.onBufferLevelChange(&event, span_ctx, &base_attributes, base_labels)
	case "bandwidthchange":
		ms.onBandwidthChange(&event, span_ctx, base_labels)
	case "qualitychangerequested":
		ms.onQualityChangeRequested(&event, span_ctx, base_labels)
	case "qualitychange":
		ms.onQualityChange(&event, span_ctx, base_labels)
	case "canplay":
		ms.onCanPlay(&event, span_ctx, &base_attributes)
	case "playing":
		ms.onPlaying(&event, span_ctx, &base_attributes)
	case "stallstart":
		ms.onStallStart(&event, span_ctx, &base_attributes)
	case "stallend":
		ms.onStallEnd(&event, span_ctx, &base_attributes)
	case "seek":
		ms.onSeek(&event, span_ctx, &base_attributes)
	case "ended":
		ms.onEnded(&event, span_ctx, &base_attributes)
	case "error":
		ms.onError(&event, span_ctx, base_labels)
	case "heartbeat":
		ms.onHeartbeat(&event, span_ctx, &base_attributes)
	case "quartile":
		ms.onQuartile(&event, span_ctx, base_labels)
	case "pause":
		ms.onPause(&event, span_ctx, &base_attributes)
	case "moveaway":
		ms.onMoveAway(&event, span_ctx, &base_attributes)
	case "moveback":
		ms.onMoveBack(&event, marker, span_ctx, &base_attributes)
	default:
		ms.otel_service.Logger.Warn("Unknown event type received for metrics computation", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
	}
}
