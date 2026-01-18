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
		"media_type":       getString(event, "media_type", "", ms.logger),
		"service_location": getString(event, "service_location", "", ms.logger),
		"url":              getString(event, "url", "", ms.logger),
		"frag_id":          getString(event, "frag_id", "", ms.logger),
		"is_outlier":       strconv.FormatBool(getBool(event, "is_outlier", false, ms.logger)),
	}
	attributes := addAttributes(base_lables, labels)
	num_val := getInt64(event, "ttfb_ms", 0, ms.logger)
	if num_val > 0 {
		ms.metrics.network_latency.Record(parent_span_ctx, num_val, metric.WithAttributeSet(attributes))
	}
	z_score := getFloat64(event, "z_score", 0, ms.logger)
	if z_score > 0 {
		ms.metrics.network_latency_deviation.Record(parent_span_ctx, z_score, metric.WithAttributeSet(attributes))
	}
	frag_duration := getInt64(event, "frag_duration", 0, ms.logger)
	if frag_duration > 0 {
		ms.metrics.frag_duration.Record(parent_span_ctx, frag_duration, metric.WithAttributeSet(attributes))
		ms.metrics.buffered_duration.Add(parent_span_ctx, frag_duration, metric.WithAttributeSet(attributes))
	}

}

func (ms *MetricsService) onManifestLoad(event *requesthandlers.BaseEvent, marker string, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	page_load_time := getFloat64(event, "page_load_time", 0, ms.logger)
	if page_load_time > 0 {
		ms.metrics.page_load_time.Record(parent_span_ctx, page_load_time, metric.WithAttributeSet(*base_attributes))
		page_entry := strconv.FormatInt(event.EventTime, 10)
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId,
			map[string]datastructure.Pair[string, time.Duration]{
				"page_entry": {First: page_entry, Second: 24 * time.Hour},
				"marker":     {First: marker, Second: 24 * time.Hour},
			})
	}
}

func (ms *MetricsService) onPlayerReady(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	player_startup_time := getFloat64(event, "player_startup_time", 0, ms.logger)
	if player_startup_time > 0 {
		ms.metrics.player_startup_time.Record(parent_span_ctx, player_startup_time, metric.WithAttributeSet(*base_attributes))
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
			"player_ready_ts": {First: strconv.FormatFloat(player_startup_time, 'f', -1, 64), Second: 10 * time.Minute},
		})
	}
}

func (ms *MetricsService) onBufferLevelChange(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set, base_labels map[string]string) {
	labels := map[string]string{
		"media_type": getString(event, "media_type", "", ms.logger),
		"is_outlier": strconv.FormatBool(getBool(event, "is_outlier", false, ms.logger)),
	}
	attributes := addAttributes(base_labels, labels)
	buffer_len_ms := getFloat64(event, "buffer_len_ms", 0, ms.logger)
	if buffer_len_ms > 0 {
		ms.metrics.buffer_length.Record(parent_span_ctx, buffer_len_ms, metric.WithAttributeSet(attributes))
	}
	z_score := getFloat64(event, "z_score", 0, ms.logger)
	if z_score > 0 {
		ms.metrics.buffer_instability_index.Record(parent_span_ctx, z_score, metric.WithAttributeSet(attributes))
	}
}

func (ms *MetricsService) onBandwidthChange(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	labels := map[string]string{
		"media_type": getString(event, "media_type", "", ms.logger),
		"codec":      getString(event, "codec", "", ms.logger),
	}
	attributes := addAttributes(base_labels, labels)
	bandwidth := getFloat64(event, "bandwidth", 0, ms.logger)
	if bandwidth > 0 {
		cur_bandwidth := int64(bandwidth) * 1000
		res_map, err := ms.config.Redis_client.GetHashFields("metrics:session_analytics:"+event.SessionId, []string{"bandwidth"})
		if err != nil || res_map["bandwidth"] == "" {
			ms.metrics.network_bandwidth.Add(parent_span_ctx, cur_bandwidth, metric.WithAttributeSet(attributes))
		}
		prev_bandwidth, _ := strconv.ParseInt(res_map["bandwidth"], 10, 64)
		ms.metrics.network_bandwidth.Add(parent_span_ctx, cur_bandwidth-prev_bandwidth, metric.WithAttributeSet(attributes))
		ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
			"bandwidth": {First: strconv.FormatInt(cur_bandwidth, 10), Second: 15 * time.Minute},
		})
	}
}

func (ms *MetricsService) onQualityChangeRequested(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	labels := map[string]string{
		"media_type": getString(event, "media_type", "", ms.logger),
	}
	attributes := addAttributes(base_labels, labels)
	ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId,
		map[string]datastructure.Pair[string, time.Duration]{
			"qual_switch_req_ts_" + labels["media_type"]: {First: strconv.FormatInt(event.EventTime, 10), Second: 20 * time.Minute},
		})
	ms.metrics.quality_change_request_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(attributes))
	bitrate_old := 0.00
	bitrate_new := 0.00
	old_rep := getMap(event, "old", nil, ms.logger)
	if old_rep != nil {
		bitrate_old = getMapFloat64(old_rep, "bitrate_kb", 0, ms.logger) * 1000
	}
	new_rep := getMap(event, "new", nil, ms.logger)
	if new_rep != nil {
		bitrate_new = getMapFloat64(new_rep, "bitrate_kb", 0, ms.logger) * 1000
	}
	ms.metrics.bitrate_change.Add(parent_span_ctx, bitrate_new-bitrate_old, metric.WithAttributeSet(attributes))
}

func (ms *MetricsService) onQualityChange(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	// Pre-extract all event data once to avoid repeated map lookups using safe helpers
	mediaType := getString(event, "media_type", "", ms.logger)
	framerate := getFloat64(event, "framerate", 0, ms.logger)
	codec := getString(event, "codec", "", ms.logger)
	bitrateKb := getFloat64(event, "bitrate_kb", 0, ms.logger)
	has_bitrate := bitrateKb > 0
	videoWidth := getFloat64(event, "video_width", 0, ms.logger)
	videoHeight := getFloat64(event, "video_height", 0, ms.logger)
	playerWidth := getInt64(event, "player_width", 1, ms.logger)
	playerHeight := getInt64(event, "player_height", 1, ms.logger)
	devicePixelRatio := getFloat64(event, "device_pixel_ratio", 1.0, ms.logger)

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
	video_startup_time := getFloat64(event, "video_startup_time", 0, ms.logger)
	if video_startup_time > 0 {
		player_ready_ts_field_name := "player_ready_ts"
		res_map, err := ms.config.Redis_client.GetHashFields("metrics:session_analytics:"+event.SessionId, []string{player_ready_ts_field_name})
		if err != nil {
			ms.metrics.video_startup_time.Record(parent_span_ctx, video_startup_time, metric.WithAttributeSet(*base_attributes))
		} else if res_map[player_ready_ts_field_name] != "" {
			player_ready_ts, err := strconv.ParseFloat(res_map[player_ready_ts_field_name], 64)
			if err != nil {
				ms.metrics.video_startup_time.Record(parent_span_ctx, video_startup_time, metric.WithAttributeSet(*base_attributes))
			} else {
				dur := video_startup_time - player_ready_ts
				ms.metrics.video_startup_time.Record(parent_span_ctx, dur, metric.WithAttributeSet(*base_attributes))
			}
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
	playing_time := getFloat64(event, "playing_time", 0, ms.logger)
	if playing_time > 0 {
		ms.metrics.pause_playing_time.Record(parent_span_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onStallStart(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.rebuffer_events_count.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	buffer_length := getFloat64(event, "buffer_length", 0, ms.logger)
	if buffer_length > 0 {
		ms.metrics.buffer_length.Record(parent_span_ctx, buffer_length, metric.WithAttributeSet(*base_attributes))
	}
	ms.config.Redis_client.SetOrUpdateHash("metrics:session_analytics:"+event.SessionId, map[string]datastructure.Pair[string, time.Duration]{
		"stall_start_time": {First: strconv.FormatInt(event.EventTime, 10), Second: 30 * time.Minute},
	})
}

func (ms *MetricsService) onStallEnd(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.rebuffer_events_count.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	stall_position := getInt64(event, "stall_position_secs", 0, ms.logger)
	if stall_position > 0 {
		ms.metrics.stall_position.Record(parent_span_ctx, stall_position, metric.WithAttributeSet(*base_attributes))
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
	seek_latency := getFloat64(event, "seek_latency", 0, ms.logger)
	if seek_latency > 0 {
		ms.metrics.seek_latency.Record(parent_span_ctx, seek_latency, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onEnded(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	ms.metrics.views_completed_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(*base_attributes))
	playing_time := getFloat64(event, "playing_time", 0, ms.logger)
	if playing_time > 0 {
		ms.metrics.playing_time.Record(parent_span_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
	completion_rate := getFloat64(event, "completion_rate", 0, ms.logger)
	if completion_rate > 0 {
		ms.metrics.completion_rate.Record(parent_span_ctx, completion_rate, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onError(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	labels := maps.Clone(base_labels)
	labels["error_family"] = getString(event, "error_family", "unknown", ms.logger)
	labels["error_code"] = getString(event, "error_code", "unknown", ms.logger)
	ms.metrics.errors_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
}

func (ms *MetricsService) onHeartbeat(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
	playing_time := getFloat64(event, "playing_time", 0, ms.logger)
	if playing_time > 0 {
		ms.metrics.heart_beat_playing_time.Record(parent_span_ctx, playing_time, metric.WithAttributeSet(*base_attributes))
	}
	bitrate := getFloat64(event, "bitrate", 0, ms.logger)
	if bitrate > 0 {
		ms.metrics.heart_beat_bitrate.Record(parent_span_ctx, bitrate, metric.WithAttributeSet(*base_attributes))
	}
	dropped_frames := getFloat64(event, "dropped_frames", 0, ms.logger)
	if dropped_frames > 0 {
		ms.metrics.dropped_frames_total.Record(parent_span_ctx, dropped_frames, metric.WithAttributeSet(*base_attributes))
	}
}

func (ms *MetricsService) onQuartile(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_labels map[string]string) {
	quartile := getFloat64(event, "quartile", 0, ms.logger)
	if quartile > 0 {
		labels := maps.Clone(base_labels)
		labels["quartile"] = strconv.FormatFloat(quartile, 'f', -1, 64)
		ms.metrics.quartile_reached_total.Add(parent_span_ctx, 1, metric.WithAttributeSet(mapToAttributeSet(ms.cardinality_service.ApplyGovernanceToLabels(labels))))
	}
}

func (ms *MetricsService) onMoveAway(event *requesthandlers.BaseEvent, parent_span_ctx context.Context, base_attributes *attribute.Set) {
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
