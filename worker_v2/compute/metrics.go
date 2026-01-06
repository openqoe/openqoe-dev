package compute

import (
	"context"
	"maps"
	"strconv"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/otelservice"
	"openqoe.dev/worker_v2/requesthandlers"
)

func NewMetricsService(config *config.Config, cardinality_service *config.CardinalityService, otelservice *otelservice.OpenTelemetryService) *MetricsService {
	meter := otelservice.Meter
	events_total, _ := meter.Int64Counter("openqoe.events_total", metric.WithDescription("Total number of events received"))
	player_startup_time, _ := meter.Float64Gauge("openqoe.player_startup_time", metric.WithDescription("Time taken by player to start"), metric.WithUnit("ms"))
	page_load_time, _ := meter.Float64Gauge("openqoe.page_load_time", metric.WithDescription("Time taken by page to load"), metric.WithUnit("ms"))
	view_started_total, _ := meter.Int64Counter("openqoe.view_started_total", metric.WithDescription("Total number of viewers who started watching the video"))
	video_startup_time, _ := meter.Float64Histogram("openqoe.video_startup_time",
		metric.WithDescription("Time taken by video to start"),
		metric.WithUnit("ms"),
		metric.WithExplicitBucketBoundaries(500, 1000, 2000, 3000, 5000, 10000, 15000, 30000),
	)
	bitrate, _ := meter.Float64Gauge("openqoe.bitrate", metric.WithDescription("Bitrate of the video"), metric.WithUnit("bps"))
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
			player_startup_time:        player_startup_time,
			page_load_time:             page_load_time,
			views_started_total:        view_started_total,
			video_startup_time:         video_startup_time,
			bitrate:                    bitrate,
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
		ms.otel_service.Logger.Debug("Processing event", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
		ms.transformEventsToMetrics(events_chunk.Ctx, event)
		ms.otel_service.Logger.Debug("Event processing success", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
	}
}

func (ms *MetricsService) transformEventsToMetrics(evnt_ctx context.Context, event requesthandlers.BaseEvent) {
	base_labels := ms.extractBaseLabels(event)
	base_attributes := mapToAttributeSet(base_labels)
	ms.metrics.events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
	switch event.EventType {
	case "playerready":
		ms.onPlayerReady(&event, evnt_ctx, &base_attributes)
	case "viewstart":
		ms.onViewStart(evnt_ctx, &base_attributes)
	case "playing":
		ms.onPlaying(&event, evnt_ctx, &base_attributes, base_labels)
	case "stallstart":
		ms.onStallStart(&event, evnt_ctx, &base_attributes)
	case "stallend":
		if val, ok := event.Data["stall_duration"]; ok && val != nil {
			ms.metrics.rebuffer_duration.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "seek":
		ms.metrics.seek_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
		if val, ok := event.Data["seek_latency"]; ok && val != nil {
			ms.metrics.seek_latency.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "ended":
		ms.metrics.views_completed_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
		if val, ok := event.Data["playing_time"]; ok && val != nil {
			ms.metrics.playing_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["completion_rate"]; ok && val != nil {
			ms.metrics.completion_rate.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["rebuffer_count"]; ok && val != nil {
			ms.metrics.rebuffer_count.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "error":
		labels := maps.Clone(base_labels)

		if val, ok := event.Data["error_family"]; ok && val != nil {
			labels["error_family"] = val.(string)
		} else {
			labels["error_family"] = "unknown"
		}

		if val, ok := event.Data["error_code"]; ok && val != nil {
			labels["error_code"] = val.(string)
		} else {
			labels["error_code"] = "unknown"
		}
		ms.metrics.errors_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
	case "heartbeat":
		if val, ok := event.Data["playing_time"]; ok && val != nil {
			ms.metrics.heart_beat_playing_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["bitrate"]; ok && val != nil {
			ms.metrics.heart_beat_bitrate.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["dropped_frames"]; ok && val != nil {
			ms.metrics.dropped_frames_total.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "quartile":
		if val, ok := event.Data["quartile"]; ok && val != nil {
			labels := maps.Clone(base_labels)
			labels["quartile"] = strconv.FormatFloat(val.(float64), 'f', -1, 64)
			ms.metrics.quartile_reached_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
		}
	case "pause":
		ms.metrics.pause_events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
		if val, ok := event.Data["playing_time"]; ok && val != nil {
			ms.metrics.pause_playing_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "qualitychange":
		labels := maps.Clone(base_labels)
		if val, ok := event.Data["trigger"]; ok && val != "" && val != nil {
			labels["trigger"] = val.(string)
		} else {
			labels["trigger"] = "unknown"
		}
		ms.metrics.quality_change_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))

		if val, ok := event.Data["new_bitrate"]; ok && val != nil {
			ms.metrics.quality_change_bitrate.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["old_bitrate"]; ok && val != nil {
			ms.metrics.quality_change_old_bitrate.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["resolution"]; ok && val != nil {
			// Resolution logic repeated for quality change
			val_map := val.(map[string]any)
			resolution_label := getResolutionLabel(&resolution{width: int64(val_map["width"].(float64)), height: int64(val_map["height"].(float64))})
			lables := maps.Clone(base_labels)
			lables["resolution"] = resolution_label
			ms.metrics.resolution_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(lables)))
		}
	}
}

func (ms *MetricsService) extractBaseLabels(event requesthandlers.BaseEvent) map[string]string {
	labels := map[string]string{
		"org_id":     event.OrgId,
		"player_id":  event.PlayerId,
		"event_type": event.EventType,
	}
	// Add optional labels
	if event.Env != "" {
		labels["env"] = event.Env
	}
	if event.AppName != "" {
		labels["app_name"] = event.AppName
	}
	if event.AppVersion != "" {
		labels["app_version"] = event.AppVersion
	}

	// Device/OS/Browser
	if event.Device.Category != "" {
		labels["device_category"] = event.Device.Category
	}
	if event.Os.Family != "" {
		labels["os_family"] = event.Os.Family
	}
	if event.Browser.Family != "" {
		labels["browser_family"] = event.Browser.Family
	}

	// Player
	if event.Player.Name != "" {
		labels["player_name"] = event.Player.Name
	}

	// Network
	if event.Network.CountryCode != "" {
		labels["network_country"] = event.Network.CountryCode
	}

	// Video (apply cardinality governance)
	if event.Video.Id != "" {
		labels["video_id"] = event.Video.Id
	}
	if event.Video.Title != "" {
		labels["video_title"] = event.Video.Title
	}

	// Apply cardinality governance
	return ms.cardinality_service.ApplyGovernanceToLabels(labels)
}

func getResolutionLabel(value *resolution) string {
	h := value.height
	switch {
	case h >= 4320:
		return "8k"
	case h >= 2160:
		return "4k"
	case h >= 1440:
		return "1440p"
	case h >= 1080:
		return "1080p"
	case h >= 720:
		return "720p"
	case h >= 480:
		return "480p"
	case h >= 360:
		return "360p"
	case h >= 240:
		return "240p"
	default:
		return "unknown"
	}
}

func mapToAttributeSet(m map[string]string) attribute.Set {
	attrs := make([]attribute.KeyValue, 0, len(m))
	for k, v := range m {
		attrs = append(attrs, attribute.String(k, v))
	}
	return attribute.NewSet(attrs...)
}
