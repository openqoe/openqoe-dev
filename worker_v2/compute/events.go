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

func (ms *MetricsService) onFragmentLoaded(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_lables map[string]string) {
	labels := map[string]string{
		"media_type":       "",
		"service_location": "",
		"url":              "",
		"frag_id":          "",
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
	if val, ok := event.Data["frag_id"]; ok && val != nil {
		labels["frag_id"] = val.(string)
	}
	if val, ok := event.Data["is_outlier"]; ok && val != nil {
		labels["is_outlier"] = strconv.FormatBool(val.(bool))
	}
	attributes := addAttributes(base_lables, labels)
	if val, ok := event.Data["ttfb_ms"]; ok && val != nil {
		num_val := int64(val.(float64))
		ms.metrics.network_latency.Record(parent_span_ctx, num_val, metric.WithAttributeSet(attributes))
	}
	if val, ok := event.Data["z_score"]; ok && val != nil {
		ms.metrics.network_latency_deviation.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(attributes))
	}
	if val, ok := event.Data["frag_duration"]; ok && val != nil {
		num_val := int64(val.(float64))
		ms.metrics.frag_duration.Record(parent_span_ctx, num_val, metric.WithAttributeSet(attributes))
		ms.metrics.buffered_duration.Add(parent_span_ctx, num_val, metric.WithAttributeSet(attributes))
	}

}

func (ms *MetricsService) onManifestLoad(event *requesthandlers.BaseEvent, marker string, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["page_load_time"]; ok && val != nil {
		ms.metrics.page_load_time.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		page_entry := strconv.FormatInt(event.EventTime, 10)
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId,
			map[string]datastructure.Pair[string, time.Duration]{
				"page_entry": {First: page_entry, Second: 24 * time.Hour},
				"marker":     {First: marker, Second: 24 * time.Hour},
			})
	}
}

func (ms *MetricsService) onPlayerReady(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["player_startup_time"]; ok && val != nil {
		ms.metrics.player_startup_time.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
			"player_ready_ts": {First: strconv.FormatFloat(val.(float64), 'f', -1, 64), Second: 10 * time.Minute},
		})
	}
}

func (ms *MetricsService) onBufferLevelChange(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set, base_labels map[string]string) {
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
		ms.metrics.buffer_length.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(attributes))
	}
	if val, ok := event.Data["z_score"]; ok && val != nil {
		ms.metrics.buffer_instability_index.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(attributes))
	}
}

func (ms *MetricsService) onBandwidthChange(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
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
			ms.metrics.network_bandwidth.Add(parent_span_ctx, cur_bandwidth, metric.WithAttributeSet(attributes))
		}
		prev_bandwidth, _ := strconv.ParseInt(res_map[field], 10, 64)
		ms.metrics.network_bandwidth.Add(parent_span_ctx, cur_bandwidth-prev_bandwidth, metric.WithAttributeSet(attributes))
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
			field: {First: strconv.FormatInt(cur_bandwidth, 10), Second: 15 * time.Minute},
		})
	}
}

func (ms *MetricsService) onQualityChangeRequested(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
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
	ms.metrics.quality_change_request_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(attributes))
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
	ms.metrics.bitrate_change.Add(parent_span_ctx, bitrate_new-bitrate_old, metric.WithAttributeSet(attributes))
}

func (ms *MetricsService) onQualityChange(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	// Pre-extract all event data once to avoid repeated map lookups
	mediaType, _ := event.Data["media_type"].(string)
	framerate, _ := event.Data["framerate"].(float64)
	codec, _ := event.Data["codec"].(string)
	bitrateKb, has_bitrate := event.Data["bitrate_kb"].(float64)
	videoWidth, _ := event.Data["video_width"].(float64)
	videoHeight, _ := event.Data["video_height"].(float64)
	playerWidth := int64(1)
	playerHeight := int64(1)
	devicePixelRatio := 1.00

	if val, ok := event.Data["player_width"].(float64); ok {
		playerWidth = int64(val)
	}
	if val, ok := event.Data["player_height"].(float64); ok {
		playerHeight = int64(val)
	}
	if val, ok := event.Data["device_pixel_ratio"].(float64); ok {
		devicePixelRatio = val
	}

	// Build labels once with pre-allocated capacity
	labels := make(map[string]string, 3)
	labels["media_type"] = mediaType
	labels["codec"] = codec
	if framerate > 0 {
		labels["framerate"] = strconv.FormatFloat(framerate, 'f', -1, 64)
	}

	attributes := addAttributes(base_labels, labels)
	sessionKey := "metrics:session_analytics:" + event.SessionId

	// Record quality change total
	ms.metrics.quality_change_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(attributes))

	qualSwitchReqTsKey := "qual_switch_req_ts_" + mediaType
	// === Combined Redis Read: Fetch ALL needed fields in one call ===
	hashFields := []string{
		qualSwitchReqTsKey,
		"last_bitrate",
		"last_bitrate_rendered_ts",
		"last_resolution",
		"last_resolution_rendered_ts",
	}
	resMap, _ := ms.config.Redis_client.GetHashFields(sessionKey, hashFields)

	// === Quality Switch Latency ===
	if reqTsStr := resMap[qualSwitchReqTsKey]; reqTsStr != "" {
		if reqTs, err := strconv.ParseInt(reqTsStr, 10, 64); err == nil {
			qsLat := event.EventTime - reqTs
			ms.metrics.quality_switch_latency.Record(parent_span_ctx, qsLat, metric.WithAttributeSet(attributes))
		}
		ms.config.Redis_client.DeleteHashField(sessionKey, []string{qualSwitchReqTsKey})
	}

	// Record resolution metric
	ms.recordResolutionMetric(event, parent_span_ctx, base_labels)

	// === Bitrate Metrics ===
	if has_bitrate {
		// Process time-weighted average bitrate
		if lastBrStr := resMap["last_bitrate"]; lastBrStr != "" {
			if lastBrRenderedTsStr := resMap["last_bitrate_rendered_ts"]; lastBrRenderedTsStr != "" {
				lastBr, err1 := strconv.ParseFloat(lastBrStr, 64)
				lastBrRenderedTs, err2 := strconv.ParseFloat(lastBrRenderedTsStr, 64)

				if err1 == nil && err2 == nil && event.PlaybackTime > 0 {
					dur := event.PlaybackTime - lastBrRenderedTs
					res := (lastBr * dur) / event.PlaybackTime
					ms.metrics.time_weighted_average_bitrate.Record(parent_span_ctx, res, metric.WithAttributeSet(attributes))
				}
			}
		}

		// Calculate perceived quality index (bits per pixel)
		// Default to 1.0 to avoid divide by zero
		width := 1.00
		height := 1.00
		if videoWidth > 0 {
			width = videoWidth
		}
		if videoHeight > 0 {
			height = videoHeight
		}
		if framerate > 0 {
			bpp := bitrateKb * 1000 / (width * height * framerate)
			ms.metrics.perceived_quality_index.Record(parent_span_ctx, bpp, metric.WithAttributeSet(attributes))
		}
	}

	// === Resolution Metrics ===
	videoPixels := int64(videoWidth) * int64(videoHeight)
	playerPixels := playerWidth * playerHeight

	// Resolution to player ratio
	if playerPixels > 0 && devicePixelRatio > 0 {
		ratio := float64(videoPixels) / float64(playerPixels) / devicePixelRatio
		ms.metrics.resolution_to_player_ratio.Record(parent_span_ctx, ratio, metric.WithAttributeSet(attributes))
	}

	// Time-weighted average resolution
	if lastResStr := resMap["last_resolution"]; lastResStr != "" {
		if lastResRenderedTsStr := resMap["last_resolution_rendered_ts"]; lastResRenderedTsStr != "" {
			lastRes, err1 := strconv.ParseInt(lastResStr, 10, 64)
			lastResRenderedTs, err2 := strconv.ParseFloat(lastResRenderedTsStr, 64)

			if err1 == nil && err2 == nil && event.PlaybackTime > 0 {
				dur := event.PlaybackTime - lastResRenderedTs
				res := float64(lastRes) * dur / event.PlaybackTime
				ms.metrics.time_weighted_average_resolution.Record(parent_span_ctx, res, metric.WithAttributeSet(attributes))
			}
		}
	}

	// === Combined Redis Write: Update both bitrate and resolution state ===
	updateFields := map[string]datastructure.Pair[string, time.Duration]{
		"last_resolution":             {First: strconv.FormatInt(videoPixels, 10), Second: 15 * time.Minute},
		"last_resolution_rendered_ts": {First: strconv.FormatFloat(event.PlaybackTime, 'f', -1, 64), Second: 15 * time.Minute},
	}

	if has_bitrate {
		updateFields["last_bitrate"] = datastructure.Pair[string, time.Duration]{
			First:  strconv.FormatFloat(bitrateKb, 'f', -1, 64),
			Second: 15 * time.Minute,
		}
		updateFields["last_bitrate_rendered_ts"] = datastructure.Pair[string, time.Duration]{
			First:  strconv.FormatFloat(event.PlaybackTime, 'f', -1, 64),
			Second: 15 * time.Minute,
		}
	}

	ms.config.Redis_client.SetOrUpdateHash(sessionKey, updateFields)
}

func (ms *MetricsService) onCanPlay(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	if val, ok := event.Data["video_startup_time"]; ok && val != nil {
		player_ready_ts_field_name := "player_ready_ts"
		res_map, err := ms.config.Redis_client.GetHashFields("metrics:session_analytics:"+event.SessionId, []string{player_ready_ts_field_name})
		if err != nil {
			ms.metrics.video_startup_time.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
		}
		if res_map[player_ready_ts_field_name] != "" {
			player_ready_ts, err := strconv.ParseFloat(res_map[player_ready_ts_field_name], 64)
			if err != nil {
				ms.metrics.video_startup_time.Record(parent_span_ctx, val.(float64), metric.WithAttributeSet(*base_attributes))
			}
			dur := val.(float64) - player_ready_ts
			ms.metrics.video_startup_time.Record(parent_span_ctx, dur, metric.WithAttributeSet(*base_attributes))
		}
		ms.config.Redis_client.DeleteHashField("metrics:session_analytics:"+event.SessionId, []string{player_ready_ts_field_name})
	}
}

func (ms *MetricsService) onPlaying(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_started_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
		"played_ts": {First: strconv.FormatInt(event.EventTime, 10), Second: 24 * time.Hour},
	})
}

func (ms *MetricsService) onPause(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.pause_events_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	playing_time := getFloat64(event, "playing_time", 0)
	if playing_time > 0 {
		ms.metrics.pause_playing_time.Record(parent_span_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onStallStart(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.rebuffer_events_count.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	buffer_length := getFloat64(event, "buffer_length", 0)
	if buffer_length > 0 {
		ms.metrics.buffer_length.Record(parent_span_ctx, buffer_length, metric.WithAttributeSet(*base_attributes))
	}
	ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
		"stall_start_time": {First: strconv.FormatInt(event.EventTime, 10), Second: 30 * time.Minute},
	})
}

func (ms *MetricsService) onStallEnd(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.rebuffer_events_count.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	if val, ok := event.Data["stall_position_secs"]; ok && val != nil {
		ms.metrics.stall_position.Record(parent_span_ctx, int64(val.(float64)), metric.WithAttributeSet(*base_attributes))
	}
	redis_key := "metrics:session_analytics:" + event.SessionId
	field_name := "stall_start_time"
	res_map, _ := ms.config.Redis_client.GetHashFields(redis_key, []string{field_name})
	stall_start_time, _ := strconv.ParseInt(res_map[field_name], 10, 64)
	stall_duration := event.EventTime - stall_start_time
	if stall_duration > 0 {
		ms.metrics.rebuffer_duration.Record(parent_span_ctx, stall_duration, metric.WithAttributeSet(*base_attributes))
	}
	ms.config.Redis_client.DeleteHashField(redis_key, []string{field_name})
}

func (ms *MetricsService) onSeek(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.seek_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	seek_latency := getFloat64(event, "seek_latency", 0)
	if seek_latency > 0 {
		ms.metrics.seek_latency.Record(parent_span_ctx, seek_latency, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onEnded(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_completed_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	playing_time := getFloat64(event, "playing_time", 0)
	if playing_time > 0 {
		ms.metrics.playing_time.Record(parent_span_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
	completion_rate := getFloat64(event, "completion_rate", 0)
	if completion_rate > 0 {
		ms.metrics.completion_rate.Record(parent_span_ctx, completion_rate, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onError(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	labels := maps.Clone(base_labels)
	labels["error_family"] = getString(event, "error_family", "unknown")
	labels["error_code"] = getString(event, "error_code", "unknown")
	ms.metrics.errors_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
}

func (ms *MetricsService) onHeartbeat(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	playing_time := getFloat64(event, "playing_time", 0)
	if playing_time > 0 {
		ms.metrics.heart_beat_playing_time.Record(parent_span_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
	bitrate := getFloat64(event, "bitrate", 0)
	if bitrate > 0 {
		ms.metrics.heart_beat_bitrate.Record(parent_span_ctx, bitrate, metric.WithAttributeSet(*base_attributes))
	}
	dropped_frames := getFloat64(event, "dropped_frames", 0)
	if dropped_frames > 0 {
		ms.metrics.dropped_frames_total.Record(parent_span_ctx, dropped_frames, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onQuartile(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	quartile := getFloat64(event, "quartile", 0)
	if quartile > 0 {
		labels := maps.Clone(base_labels)
		labels["quartile"] = strconv.FormatFloat(quartile, 'f', -1, 64)
		ms.metrics.quartile_reached_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
	}
}

func (ms *MetricsService) onMoveAway(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set, base_labels map[string]string) {
	redis_key := "metrics:session_analytics:" + event.SessionId
	field_names := []string{"page_entry", "marker", "played_ts"}
	res_map, _ := ms.config.Redis_client.GetHashFields(redis_key, field_names)
	if res_map["page_entry"] != "" && res_map["played_ts"] == "" {
		ms.metrics.exit_without_play.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	}
	page_entry, _ := strconv.ParseInt(res_map["page_entry"], 10, 64)
	stay_dur := event.EventTime - page_entry
	ms.metrics.stay_duration.Record(parent_span_ctx, stay_dur, metric.WithAttributeSet(*base_attributes))
	ms.config.Redis_client.DeleteHashField(redis_key, field_names)
}

func (ms *MetricsService) onMoveBack(event *requesthandlers.BaseEvent, marker string, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	//user came back they have not exited so reducing count
	ms.metrics.exit_without_play.Add(parent_span_ctx, -1, metric.WithAttributeSet(*base_attributes))
	page_entry := strconv.FormatInt(event.EventTime, 10)
	ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId,
		map[string]datastructure.Pair[string, time.Duration]{
			"page_entry": {First: page_entry, Second: 24 * time.Hour},
			"marker":     {First: marker, Second: 24 * time.Hour},
		})
}
