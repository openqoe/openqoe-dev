package compute

import (
	"context"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"openqoe.dev/worker_v2/requesthandlers"
)

func (ms *MetricsService) onPlayerReady(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["player_startup_time"]; ok && val != nil {
		ms.metrics.player_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
	if val, ok := event.Data["page_load_time"]; ok && val != nil {
		ms.metrics.page_load_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onViewStart(evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_started_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
}

func (ms *MetricsService) onPlaying(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set, base_labels map[string]string) {
	if val, ok := event.Data["video_startup_time"]; ok && val != nil {
		ms.metrics.video_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
	if val, ok := event.Data["bitrate"]; ok && val != nil {
		ms.metrics.bitrate.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
	if val, ok := event.Data["resolution"]; ok && val != nil {
		val_map := val.(map[string]any)
		res := &resolution{width: int64(val_map["width"].(float64)), height: int64(val_map["height"].(float64))}
		resolution_label := getResolutionLabel(res)

		labels := base_labels
		labels["resolution"] = resolution_label
		ms.metrics.resolution_total.Add(evnt_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(labels)))
	}
}

func (ms *MetricsService) onStallStart(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.rebuffer_events_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	if val, ok := event.Data["buffer_length"]; ok && val != nil {
		ms.metrics.buffer_length.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
	}
}
