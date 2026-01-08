package compute

import (
	"context"
	"maps"
	"strconv"
	"time"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/requesthandlers"
)

func (ms *MetricsService) onFragmentLoaded(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_lables map[string]string) {
	media_type := ""
	service_loc := ""
	if event.Data["media_type"] != nil {
		media_type = event.Data["media_type"].(string)
	}
	if event.Data["service_location"] != nil {
		service_loc = event.Data["service_location"].(string)
	}
	labels := addAttributes(base_lables, map[string]string{"media_type": media_type, "service_location": service_loc})
	if val, ok := event.Data["bandwidth"]; ok && val != nil {
		ms.metrics.network_bandwidth.Record(evnt_ctx, int64(val.(float64)), metric.WithAttributeSet(labels))
	}
	load_start := time.Time{}
	if val, ok := event.Data["load_start"]; ok && val != nil {
		load_start, _ = time.Parse(time.RFC3339Nano, val.(string))

	}
	load_complete := time.Now()
	if val, ok := event.Data["load_complete"]; ok && val != nil {
		load_complete = time.UnixMilli(int64(val.(float64)))
	}
	ms.otel_service.Logger.Debug("load times", zap.Time("start", load_start), zap.Time("end", load_complete))
	ms.metrics.loading_delay.Record(evnt_ctx, load_complete.Sub(load_start).Nanoseconds(), metric.WithAttributeSet(labels))
	if val, ok := event.Data["duration"]; ok && val != nil {
		num_val := int64(val.(float64))
		ms.metrics.frag_duration.Record(evnt_ctx, num_val, metric.WithAttributeSet(labels))
		ms.metrics.buffered_duration.Add(evnt_ctx, num_val, metric.WithAttributeSet(labels))
	}

}

func (ms *MetricsService) onManifestLoad(event *requesthandlers.BaseEvent, marker string, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["page_load_time"]; ok && val != nil {
		ms.metrics.page_load_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		ms.config.Redis_client.SetHash("metrics.page_entry."+event.SessionId, map[string]string{
			"event_ts": strconv.FormatInt(event.EventTime, 10),
			"marker":   marker,
		}, 24*time.Hour)
	}
}

func (ms *MetricsService) onPlayerReady(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["player_startup_time"]; ok && val != nil {
		ms.metrics.player_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onCanPlay(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["video_startup_time"]; ok && val != nil {
		ms.metrics.video_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onPlaying(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_started_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	bitrate := getFloat64(event, "bitrate", 0)
	if bitrate > 0 {
		ms.metrics.bitrate.Record(evnt_ctx, bitrate, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onStallStart(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.rebuffer_events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	buffer_length := getFloat64(event, "buffer_length", 0)
	if buffer_length > 0 {
		ms.metrics.buffer_length.Record(evnt_ctx, buffer_length, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onStallEnd(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	stall_duration := getFloat64(event, "stall_duration", 0)
	if stall_duration > 0 {
		ms.metrics.rebuffer_duration.Record(evnt_ctx, stall_duration, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onSeek(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.seek_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	seek_latency := getFloat64(event, "seek_latency", 0)
	if seek_latency > 0 {
		ms.metrics.seek_latency.Record(evnt_ctx, seek_latency, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onEnded(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_completed_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	playing_time := getFloat64(event, "playing_time", 0)
	if playing_time > 0 {
		ms.metrics.playing_time.Record(evnt_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
	completion_rate := getFloat64(event, "completion_rate", 0)
	if completion_rate > 0 {
		ms.metrics.completion_rate.Record(evnt_ctx, completion_rate, metric.WithAttributeSet(*base_attributes))
	}
	rebuffer_count := getFloat64(event, "rebuffer_count", 0)
	if rebuffer_count > 0 {
		ms.metrics.rebuffer_count.Record(evnt_ctx, rebuffer_count, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onError(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string) {
	labels := maps.Clone(base_labels)
	labels["error_family"] = getString(event, "error_family", "unknown")
	labels["error_code"] = getString(event, "error_code", "unknown")
	ms.metrics.errors_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
}

func (ms *MetricsService) onHeartbeat(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	playing_time := getFloat64(event, "playing_time", 0)
	if playing_time > 0 {
		ms.metrics.heart_beat_playing_time.Record(evnt_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
	bitrate := getFloat64(event, "bitrate", 0)
	if bitrate > 0 {
		ms.metrics.heart_beat_bitrate.Record(evnt_ctx, bitrate, metric.WithAttributeSet(*base_attributes))
	}
	dropped_frames := getFloat64(event, "dropped_frames", 0)
	if dropped_frames > 0 {
		ms.metrics.dropped_frames_total.Record(evnt_ctx, dropped_frames, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onQuartile(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string) {
	quartile := getFloat64(event, "quartile", 0)
	if quartile > 0 {
		labels := maps.Clone(base_labels)
		labels["quartile"] = strconv.FormatFloat(quartile, 'f', -1, 64)
		ms.metrics.quartile_reached_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
	}
}

func (ms *MetricsService) onPause(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.pause_events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	playing_time := getFloat64(event, "playing_time", 0)
	if playing_time > 0 {
		ms.metrics.pause_playing_time.Record(evnt_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onQualityChange(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string, base_attributes *attribute.Set) {
	labels := maps.Clone(base_labels)
	labels["trigger"] = getString(event, "trigger", "unknown")
	ms.metrics.quality_change_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))

	new_bitrate := getFloat64(event, "new_bitrate", 0)
	if new_bitrate > 0 {
		ms.metrics.quality_change_bitrate.Record(evnt_ctx, new_bitrate, metric.WithAttributeSet(*base_attributes))
	}
	old_bitrate := getFloat64(event, "old_bitrate", 0)
	if old_bitrate > 0 {
		ms.metrics.quality_change_old_bitrate.Record(evnt_ctx, old_bitrate, metric.WithAttributeSet(*base_attributes))
	}
	ms.recordResolutionMetric(event, evnt_ctx, base_labels)
}
