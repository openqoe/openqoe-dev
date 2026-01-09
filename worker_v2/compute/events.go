package compute

import (
	"context"
	"maps"
	"strconv"
	"time"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	datastructure "openqoe.dev/worker_v2/data_structure"
	"openqoe.dev/worker_v2/requesthandlers"
)

func (ms *MetricsService) onFragmentLoaded(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_lables map[string]string) {
	labels := map[string]string{
		"media_type":       "",
		"service_location": "",
		"url":              "",
		"is_outlier":       "false",
	}
	if val, ok := event.Data["media_type"]; ok && val != nil {
		labels["media_type"] = val.(string)
	}
	if val, ok := event.Data["service_location"]; ok && val != nil {
		labels["service_location"] = val.(string)
	}
	if val, ok := event.Data["url"]; ok && val != nil {
		labels["url"] = val.(string)
	}
	if val, ok := event.Data["is_outlier"]; ok && val != nil {
		labels["is_outlier"] = strconv.FormatBool(val.(bool))
	}
	attributes := addAttributes(base_lables, labels)
	if val, ok := event.Data["ttfb_ms"]; ok && val != nil {
		ms.metrics.network_latency.Record(evnt_ctx, int64(val.(float64)), metric.WithAttributeSet(attributes))
	}
	if val, ok := event.Data["z_score"]; ok && val != nil {
		ms.metrics.network_latency_deviation.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(attributes))
	}
	if val, ok := event.Data["frag_duration"]; ok && val != nil {
		num_val := int64(val.(float64))
		ms.metrics.frag_duration.Record(evnt_ctx, num_val, metric.WithAttributeSet(attributes))
		ms.metrics.buffered_duration.Add(evnt_ctx, num_val, metric.WithAttributeSet(attributes))
	}

}

func (ms *MetricsService) onManifestLoad(event *requesthandlers.BaseEvent, marker string, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["page_load_time"]; ok && val != nil {
		ms.metrics.page_load_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		page_entry := strconv.FormatInt(event.EventTime, 10)
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId,
			map[string]datastructure.Pair[string, time.Duration]{
				"page_entry": {First: page_entry, Second: 24 * time.Hour},
				"marker":     {First: marker, Second: 24 * time.Hour},
			})
	}
}

func (ms *MetricsService) onPlayerReady(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["player_startup_time"]; ok && val != nil {
		ms.metrics.player_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		ms.config.Redis_client.SetValueWithTTL("metrics:player_startup_time"+event.SessionId, strconv.FormatFloat(val.(float64), 'f', -1, 64), 10*time.Minute)
	}
}

func (ms *MetricsService) onBufferLevelChange(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set, base_labels map[string]string) {
	labels := make(map[string]string)
	attributes := *base_attributes
	if val, ok := event.Data["media_type"]; ok && val != nil {
		labels["media_type"] = val.(string)
	}
	if val, ok := event.Data["is_outlier"]; ok && val != nil {
		labels["is_outlier"] = strconv.FormatBool(val.(bool))
	}
	attributes = addAttributes(base_labels, labels)
	if val, ok := event.Data["buffer_len_ms"]; ok && val != nil {
		ms.metrics.buffer_length.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(attributes))
	}
	if val, ok := event.Data["z_score"]; ok && val != nil {
		ms.metrics.buffer_instability_index.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(attributes))
	}
}

func (ms *MetricsService) onBandwidthChange(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string) {
	labels := map[string]string{
		"media_type": "",
		"codec":      "",
	}
	if val, ok := event.Data["media_type"]; ok && val != nil {
		labels["media_type"] = val.(string)
	}
	if val, ok := event.Data["codec"]; ok && val != nil {
		labels["codec"] = val.(string)
	}
	attributes := addAttributes(base_labels, labels)
	field := "bandwidth"
	if val, ok := event.Data[field]; ok && val != nil {
		cur_bandwidth := int64(val.(float64)) * 1000
		res_map, err := ms.config.Redis_client.GetHashFields("metrics:session_analytics:"+event.SessionId, []string{field})
		if err != nil || res_map[field] == "" {
			ms.metrics.network_bandwidth.Add(evnt_ctx, cur_bandwidth, metric.WithAttributeSet(attributes))
		}
		prev_bandwidth, _ := strconv.ParseInt(res_map[field], 10, 64)
		ms.metrics.network_bandwidth.Add(evnt_ctx, cur_bandwidth-prev_bandwidth, metric.WithAttributeSet(attributes))
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
			field: {First: strconv.FormatInt(cur_bandwidth, 10), Second: 15 * time.Minute},
		})
	}
}

func (ms *MetricsService) onQualityChangeRequested(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string) {
	labels := map[string]string{
		"media_type": "",
	}
	if val, ok := event.Data["media_type"]; ok && val != nil {
		labels["media_type"] = val.(string)
	}
	attributes := addAttributes(base_labels, labels)
	ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId,
		map[string]datastructure.Pair[string, time.Duration]{
			"qual_switch_req_ts_" + labels["media_type"]: {First: strconv.FormatInt(event.EventTime, 10), Second: 20 * time.Minute},
		})
	ms.metrics.quality_change_request_total.Add(evnt_ctx, 1, metric.WithAttributeSet(attributes))
	bitrate_old := 0.00
	bitrate_new := 0.00
	if val, ok := event.Data["old"]; ok && val != nil {
		old_rep := val.(map[string]any)
		bitrate_old = old_rep["bitrate_kb"].(float64) * 1000
	}
	if val, ok := event.Data["new"]; ok && val != nil {
		new_rep := val.(map[string]any)
		bitrate_new = new_rep["bitrate_kb"].(float64) * 1000
	}
	ms.metrics.requested_bitrate.Add(evnt_ctx, bitrate_new-bitrate_old, metric.WithAttributeSet(attributes))
}

func (ms *MetricsService) onQualityChange(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string) {
	labels := map[string]string{
		"media_type": "",
		"framerate":  "",
		"codec":      "",
	}
	if val, ok := event.Data["media_type"]; ok && val != nil {
		labels["media_type"] = val.(string)
	}
	framerate := 0.00
	if val, ok := event.Data["framerate"]; ok && val != nil {
		framerate = val.(float64)
		labels["framerate"] = strconv.FormatFloat(framerate, 'f', -1, 64)
	}
	if val, ok := event.Data["codec"]; ok && val != nil {
		labels["codec"] = val.(string)
	}
	attributes := addAttributes(base_labels, labels)

	ms.metrics.quality_change_total.Add(evnt_ctx, 1, metric.WithAttributeSet(attributes))

	last_br := "qual_switch_req_ts_" + labels["media_type"]
	res_map, _ := ms.config.Redis_client.GetHashFields("metrics:session_analytics:"+event.SessionId, []string{last_br})
	req_ts, _ := strconv.ParseInt(res_map[last_br], 10, 64)
	qs_lat := event.EventTime - req_ts
	ms.metrics.quality_switch_latency.Record(evnt_ctx, qs_lat, metric.WithAttributeSet(attributes))
	ms.config.Redis_client.DeleteHashField("metrics:session_analytics:"+event.SessionId, last_br)

	ms.recordResolutionMetric(event, evnt_ctx, base_labels)

	if val, ok := event.Data["bitrate_kb"]; ok && val != nil {
		cur_br := val.(float64)
		last_br_field_name := "last_bitrate"
		last_qual_ren_ts_field_name := "last_quality_rendered_ts"
		res_map, _ = ms.config.Redis_client.GetHashFields("metrics:session_analytics:"+event.SessionId, []string{last_br_field_name, last_qual_ren_ts_field_name})
		if res_map[last_br_field_name] != "" && res_map[last_qual_ren_ts_field_name] != "" {
			last_br, _ := strconv.ParseFloat(res_map[last_br_field_name], 64)
			last_qual_ren_ts, _ := strconv.ParseFloat(res_map[last_qual_ren_ts_field_name], 64)
			dur := event.PlaybackTime - last_qual_ren_ts
			res := (last_br * dur) / event.PlaybackTime
			ms.metrics.time_weighted_average_bitrate.Record(evnt_ctx, res, metric.WithAttributeSet(attributes))

		}
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
			last_br_field_name:          {First: strconv.FormatFloat(cur_br, 'f', -1, 64), Second: 15 * time.Minute},
			last_qual_ren_ts_field_name: {First: strconv.FormatFloat(event.PlaybackTime, 'f', -1, 64), Second: 15 * time.Minute},
		})
		// had to make it 1 to avoid divide by 0
		width := 1.00
		height := 1.00
		if val, ok := event.Data["video_width"]; ok && val != nil {
			width = val.(float64)
		}
		if val, ok := event.Data["video_height"]; ok && val != nil {
			height = val.(float64)
		}
		bpp := cur_br * 1000 / (width * height * framerate)
		ms.metrics.perceived_quality_index.Record(evnt_ctx, bpp, metric.WithAttributeSet(attributes))
	}

}

func (ms *MetricsService) onCanPlay(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["video_startup_time"]; ok && val != nil {
		res, err := ms.config.Redis_client.GetValue("metrics:player_startup_time" + event.SessionId)
		if err != nil {
			ms.metrics.video_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		}
		video_startup_time := val.(float64)
		player_startup_time, err := strconv.ParseFloat(res, 64)
		if err != nil {
			ms.metrics.video_startup_time.Record(evnt_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		}
		dur := video_startup_time - player_startup_time
		ms.metrics.video_startup_time.Record(evnt_ctx, dur, metric.WithAttributeSet(*base_attributes))
		ms.config.Redis_client.Delete("metrics:player_startup_time" + event.SessionId)
	}
}

func (ms *MetricsService) onPlaying(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_started_total.Add(evnt_ctx, 1, metric.WithAttributeSet(*base_attributes))
	bitrate := getFloat64(event, "bitrate", 0)
	if bitrate > 0 {
		ms.metrics.requested_bitrate.Add(evnt_ctx, bitrate*1000, metric.WithAttributeSet(*base_attributes))
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
