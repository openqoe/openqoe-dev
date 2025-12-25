package compute

import (
	"context"
	"maps"
	"strconv"
	"time"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/otelservice"
	"openqoe.dev/worker_v2/requesthandlers"
)

func NewMetricsService(config *config.Config, cardinality_service *config.CardinalityService, otelservice *otelservice.OpenTelemetryService) *MetricsService {

	logger := otelservice.Logger.With(zap.String("sub-component", "metrics-compute-service"))
	otelservice.Logger = logger
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
	return &MetricsService{
		config:              config,
		cardinality_service: cardinality_service,
		otel_service:        otelservice,
		metrics: &computedMetrics{
			events_total:          events_total,
			player_startup_time:   player_startup_time,
			page_load_time:        page_load_time,
			views_started_total:   view_started_total,
			video_startup_time:    video_startup_time,
			bitrate:               bitrate,
			resolution_total:      resolution_total,
			rebuffer_events_total: rebuffer_events_total,
			buffer_length:         buffer_length,
			rebuffer_duration:     rebuffer_duration,
			seek_total:            seek_total,
			seek_latency:          seek_latency,
			views_completed_total: views_completed_total,
		},
	}
}

func (ms *MetricsService) ComputeMetrics(events_chunk requesthandlers.IngestRequestWithContext) {
	for _, event := range events_chunk.Events {
		ms.otel_service.Logger.Info("Processing event", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
		ms.transformEventsToMetrics(events_chunk.Ctx, event)
		ms.otel_service.Logger.Info("Event processing success", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
	}
}

func (ms *MetricsService) transformEventsToMetrics(evnt_ctx context.Context, event requesthandlers.BaseEvent) {
	base_labels := ms.extractBaseLabels(event)
	base_attributes := mapToAttributeSet(base_labels)
	timestamp := time.UnixMilli(event.EventTime)
	ms.metrics.events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
	switch event.EventType {
	case "playerready":
		if val, ok := event.Data["player_startup_time"]; ok && val != nil {
			ms.metrics.player_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["page_load_time"]; ok && val != nil {
			ms.metrics.page_load_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "viewstart":
		ms.metrics.views_started_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
	case "playing":
		if val, ok := event.Data["video_startup_time"]; ok && val != nil {
			ms.metrics.video_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["bitrate"]; ok && val != nil {
			ms.metrics.bitrate.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
		if val, ok := event.Data["resolution"]; ok && val != nil {
			val_map := val.(map[string]any)
			res := &resolution{width: int64(val_map["width"].(float64)), height: int64(val_map["height"].(float64))}
			resolution_label := getResolutionLabel(res)

			labels := maps.Clone(base_labels)
			labels["resolution"] = resolution_label
			ms.metrics.resolution_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(labels)))
		}
	case "stall_start":
		ms.metrics.rebuffer_events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(base_attributes))
		if val, ok := event.Data["buffer_length"]; ok && val != nil {
			ms.metrics.buffer_length.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(base_attributes))
		}
	case "stall_end":
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
			timeserieses = createMetric("openqoe_playing_time_seconds", base_labels, val.(float64)/1000.00, timestamp, timeserieses)
		}
		if val, ok := event.Data["completion_rate"]; ok && val != nil {
			timeserieses = createMetric("openqoe_completion_rate", base_labels, val.(float64), timestamp, timeserieses)
		}
		if val, ok := event.Data["rebuffer_count"]; ok && val != nil {
			timeserieses = createMetric("openqoe_rebuffer_count", base_labels, val.(float64), timestamp, timeserieses)
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
		timeserieses = createMetric("openqoe_errors_total", ms.cardinality_service.ApplyGovernanceToLabels(labels), 1, timestamp, timeserieses)
	case "heartbeat":
		if val, ok := event.Data["playing_time"]; ok && val != nil {
			timeserieses = createMetric("openqoe_heartbeat_playing_time_seconds", base_labels, val.(float64)/1000.00, timestamp, timeserieses)
		}
		if val, ok := event.Data["bitrate"]; ok && val != nil {
			timeserieses = createMetric("openqoe_heartbeat_bitrate_bps", base_labels, val.(float64), timestamp, timeserieses)
		}
		if val, ok := event.Data["dropped_frames"]; ok && val != nil {
			timeserieses = createMetric("openqoe_dropped_frames_total", base_labels, val.(float64), timestamp, timeserieses)
		}
	case "quartile":
		if val, ok := event.Data["quartile"]; ok && val != nil {
			labels := maps.Clone(base_labels)
			labels["quartile"] = strconv.FormatFloat(val.(float64), 'f', -1, 64)
			timeserieses = createMetric("openqoe_quartile_reached_total", ms.cardinality_service.ApplyGovernanceToLabels(labels), 1, timestamp, timeserieses)
		}
	case "pause":
		timeserieses = createMetric("openqoe_pause_events_total", base_labels, 1, timestamp, timeserieses)
		if val, ok := event.Data["playing_time"]; ok && val != nil {
			timeserieses = createMetric("openqoe_pause_playing_time_seconds", base_labels, val.(float64)/1000.00, timestamp, timeserieses)
		}
	case "quality_change":
		labels := maps.Clone(base_labels)
		if val, ok := event.Data["trigger"]; ok && val != "" && val != nil {
			labels["trigger"] = val.(string)
		} else {
			labels["trigger"] = "unknown"
		}

		timeserieses = createMetric("openqoe_quality_changes_total", ms.cardinality_service.ApplyGovernanceToLabels(labels), 1, timestamp, timeserieses)

		if val, ok := event.Data["new_bitrate"]; ok && val != nil {

			timeserieses = createMetric("openqoe_quality_change_bitrate_bps", base_labels, val.(float64), timestamp, timeserieses)
		}
		if val, ok := event.Data["old_bitrate"]; ok && val != nil {
			timeserieses = createMetric("openqoe_quality_change_old_bitrate_bps", base_labels, val.(float64), timestamp, timeserieses)

		}
		if val, ok := event.Data["resolution"]; ok && val != nil {
			// Resolution logic repeated for quality change
			val_map := val.(map[string]any)

			resolution_label := getResolutionLabel(&resolution{width: int64(val_map["width"].(float64)), height: int64(val_map["height"].(float64))})
			resLabels := maps.Clone(base_labels)
			resLabels["resolution"] = resolution_label

			timeserieses = createMetric("openqoe_resolution_total", resLabels, 1, timestamp, timeserieses)
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

	// Apply cardinality governance
	return ms.cardinality_service.ApplyGovernanceToLabels(labels)
}

func createMetric(name string, labels map[string]string, value float64, timestamp time.Time, timeserieses []TimeSeries) []TimeSeries {
	metric_labels := []Label{
		{Name: "__name__", Value: name},
	}
	for k, v := range labels {
		metric_labels = append(metric_labels, Label{Name: k, Value: v})
	}
	timeserieses = append(timeserieses, TimeSeries{
		Labels: metric_labels,
		Samples: []Sample{
			{Value: value, Timestamp: timestamp},
		},
	})
	return timeserieses
}

func createHistogram(name string, labels map[string]string, value float64, timestamp time.Time, buckets []float64, timeserieses []TimeSeries) []TimeSeries {
	for _, bucket := range buckets {
		bucket_labels := []Label{
			{
				Name:  "__name__",
				Value: name + "_bucket",
			},
		}
		for k, v := range labels {
			bucket_labels = append(bucket_labels, Label{Name: k, Value: v})
		}
		bucket_labels = append(bucket_labels, Label{Name: "le", Value: strconv.FormatFloat(bucket, 'f', -1, 64)})
		val := 0.00
		if value <= bucket {
			val = 1
		} else {
			val = 0
		}
		timeserieses = append(timeserieses, TimeSeries{
			Labels: bucket_labels,
			Samples: []Sample{
				{
					Value:     val,
					Timestamp: timestamp,
				},
			},
		})
	}

	inf_labels := []Label{
		{
			Name:  "__name__",
			Value: name + "_bucket",
		},
	}
	for k, v := range labels {
		inf_labels = append(inf_labels, Label{Name: k, Value: v})
	}
	inf_labels = append(inf_labels, Label{Name: "le", Value: "+Inf"})
	timeserieses = append(timeserieses, TimeSeries{
		Labels: inf_labels,
		Samples: []Sample{
			{
				Value:     1,
				Timestamp: timestamp,
			},
		},
	})
	sum_labels := []Label{
		{
			Name:  "__name__",
			Value: name + "_sum",
		},
	}
	for k, v := range labels {
		sum_labels = append(sum_labels, Label{Name: k, Value: v})
	}
	timeserieses = append(timeserieses, TimeSeries{
		Labels: sum_labels,
		Samples: []Sample{
			{
				Value:     value,
				Timestamp: timestamp,
			},
		},
	})
	count_labels := []Label{
		{
			Name:  "__name__",
			Value: name + "_count",
		},
	}
	for k, v := range labels {
		count_labels = append(count_labels, Label{Name: k, Value: v})
	}
	timeserieses = append(timeserieses, TimeSeries{
		Labels: count_labels,
		Samples: []Sample{
			{
				Value:     1,
				Timestamp: timestamp,
			},
		},
	})
	return timeserieses
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
