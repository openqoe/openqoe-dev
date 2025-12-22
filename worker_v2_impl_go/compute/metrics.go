package compute

import (
	"encoding/json"
	"maps"
	"strconv"
	"time"

	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/data"
)

type MetricsService struct {
	config              *config.Config
	cardinality_service *config.CardinalityService
	logger              *zap.Logger
}

func NewMetricsService(config *config.Config, cardinality_service *config.CardinalityService, parent_logger *zap.Logger) *MetricsService {
	return &MetricsService{
		config:              config,
		cardinality_service: cardinality_service,
		logger:              parent_logger.With(zap.String("sub-component", "metrics-service")),
	}
}

func (ms *MetricsService) ComputeMetrics(events_chunk data.IngestRequestWithContext) []data.TimeSeries {
	timeserieses := []data.TimeSeries{}
	for _, event := range events_chunk.Events {
		ms.logger.Info("Processing event", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
		ms.transformEventsToMetrics(event, timeserieses)
		ms.logger.Info("Event processing success", zap.String("event type", event.EventType), zap.String("view id", event.ViewId))
	}
	return timeserieses
}

func (ms *MetricsService) transformEventsToMetrics(event data.BaseEvent, timeserieses []data.TimeSeries) {
	base_labels := ms.extractBaseLabels(event)
	timestamp := time.UnixMilli(event.EventTime)

	createMetric("openqoe_events_total", base_labels, 1, timestamp, timeserieses)
	switch event.EventType {
	case "playerready":
		if val, ok := event.Data["player_startup_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse player_startup_time", zap.Error(err))
			} else {
				createMetric("openqoe_player_startup_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["page_load_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse page_load_time", zap.Error(err))
			} else {
				createMetric("openqoe_page_load_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
	case "viewstart":
		createMetric("openqoe_views_started_total", base_labels, 1, timestamp, timeserieses)
	case "playing":
		if val, ok := event.Data["video_startup_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse video_startup_time", zap.Error(err))
			} else {
				createHistogram("openqoe_video_startup_seconds", base_labels, metric_value/1000, timestamp, []float64{0.5, 1.0, 2.0, 3.0, 5.0, 10.0, 15.0, 30.0}, timeserieses)
			}
		}
		if val, ok := event.Data["bitrate"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse bitrate", zap.Error(err))
			} else {
				createMetric("openqoe_bitrate_bps", base_labels, metric_value, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["resolution"]; ok {
			var res resolution
			err := json.Unmarshal([]byte(val), &res)
			if err != nil {
				ms.logger.Error("Failed to unmarshal resolution", zap.Error(err))
			}
			resolution_label := getResolutionLabel(&res)
			labels := maps.Clone(base_labels)
			labels["resolution"] = resolution_label

			createMetric("openqoe_resolution_total", labels, 1, timestamp, timeserieses)
		}
	case "stall_start":
		createMetric("openqoe_rebuffer_events_total", base_labels, 1, timestamp, timeserieses)
		if val, ok := event.Data["buffer_length"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse buffer length", zap.Error(err))
			} else {
				createMetric("openqoe_buffer_length_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
	case "stall_end":
		if val, ok := event.Data["stall_duration"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse stall duration", zap.Error(err))
			} else {
				createHistogram("openqoe_rebuffer_duration_seconds", base_labels, metric_value/1000.00, timestamp, []float64{0.5, 1.0, 2.0, 3.0, 5.0, 10.0, 30.0}, timeserieses)
			}
		}
	case "seek":
		createMetric("openqoe_seeks_total", base_labels, 1, timestamp, timeserieses)
		if val, ok := event.Data["seek_latency"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse seek_latency", zap.Error(err))
			} else {
				createHistogram("openqoe_seek_latency_seconds", base_labels, metric_value/1000.00, timestamp, []float64{0.1, 0.25, 0.5, 1.0, 2.0, 5.0}, timeserieses)
			}
		}

	case "ended":
		createMetric("openqoe_views_completed_total", base_labels, 1, timestamp, timeserieses)
		if val, ok := event.Data["playing_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse playing_time", zap.Error(err))
			} else {
				createMetric("openqoe_playing_time_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["completion_rate"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse completion_rate", zap.Error(err))
			} else {
				createMetric("openqoe_completion_rate", base_labels, metric_value, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["rebuffer_count"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse rebuffer_count", zap.Error(err))
			} else {
				createMetric("openqoe_rebuffer_count", base_labels, metric_value, timestamp, timeserieses)
			}
		}

	case "error":
		labels := maps.Clone(base_labels)

		if val, ok := event.Data["error_family"]; ok {
			labels["error_family"] = val
		} else {
			labels["error_family"] = "unknown"
		}

		if val, ok := event.Data["error_code"]; ok {
			labels["error_code"] = val
		} else {
			labels["error_code"] = "unknown"
		}
		createMetric("openqoe_errors_total", ms.cardinality_service.ApplyGovernanceToLabels(labels), 1, timestamp, timeserieses)

	case "heartbeat":
		if val, ok := event.Data["playing_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse playing_time", zap.Error(err))
			} else {
				createMetric("openqoe_heartbeat_playing_time_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["bitrate"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse bitrate", zap.Error(err))
			} else {
				createMetric("openqoe_heartbeat_bitrate_bps", base_labels, metric_value, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["dropped_frames"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse dropped_frames", zap.Error(err))
			} else {
				createMetric("openqoe_dropped_frames_total", base_labels, metric_value, timestamp, timeserieses)
			}
		}

	case "quartile":
		if val, ok := event.Data["quartile"]; ok {
			labels := maps.Clone(base_labels)
			labels["quartile"] = val
			createMetric("openqoe_quartile_reached_total", ms.cardinality_service.ApplyGovernanceToLabels(labels), 1, timestamp, timeserieses)
		}

	case "pause":
		createMetric("openqoe_pause_events_total", base_labels, 1, timestamp, timeserieses)
		if val, ok := event.Data["playing_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse playing_time", zap.Error(err))
			} else {
				createMetric("openqoe_pause_playing_time_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}

	case "quality_change":
		labels := maps.Clone(base_labels)
		if val, ok := event.Data["trigger"]; ok && val != "" {
			labels["trigger"] = val
		} else {
			labels["trigger"] = "unknown"
		}

		createMetric("openqoe_quality_changes_total", ms.cardinality_service.ApplyGovernanceToLabels(labels), 1, timestamp, timeserieses)

		if val, ok := event.Data["new_bitrate"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse new_bitrate", zap.Error(err))
			} else {
				createMetric("openqoe_quality_change_bitrate_bps", base_labels, metric_value, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["old_bitrate"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error("Failed to parse old_bitrate", zap.Error(err))
			} else {
				createMetric("openqoe_quality_change_old_bitrate_bps", base_labels, metric_value, timestamp, timeserieses)
			}
		}
		if _, ok := event.Data["resolution"]; ok {
			// Resolution logic repeated for quality change
			heightStr := event.Data["height"]
			widthStr := event.Data["width"]

			height, _ := strconv.ParseInt(heightStr, 10, 64)
			width, _ := strconv.ParseInt(widthStr, 10, 64)

			resolution_label := getResolutionLabel(&resolution{width: width, height: height})
			resLabels := maps.Clone(base_labels)
			resLabels["resolution"] = resolution_label

			createMetric("openqoe_resolution_total", resLabels, 1, timestamp, timeserieses)
		}
	}
}

func (ms *MetricsService) extractBaseLabels(event data.BaseEvent) map[string]string {
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

func createMetric(name string, labels map[string]string, value float64, timestamp time.Time, timeserieses []data.TimeSeries) {
	metric_labels := []data.Label{
		{Name: "__name__", Value: name},
	}
	for k, v := range labels {
		metric_labels = append(metric_labels, data.Label{Name: k, Value: v})
	}
	timeserieses = append(timeserieses, data.TimeSeries{
		Labels: metric_labels,
		Samples: []data.Sample{
			{Value: value, Timestamp: timestamp},
		},
	})
}

func createHistogram(name string, labels map[string]string, value float64, timestamp time.Time, buckets []float64, timeserieses []data.TimeSeries) {
	for _, bucket := range buckets {
		bucket_labels := []data.Label{
			{
				Name:  "__name__",
				Value: name + "_bucket",
			},
		}
		for k, v := range labels {
			bucket_labels = append(bucket_labels, data.Label{Name: k, Value: v})
		}
		bucket_labels = append(bucket_labels, data.Label{Name: "le", Value: strconv.FormatFloat(bucket, 'f', -1, 64)})
		val := 0.00
		if value <= bucket {
			val = 1
		} else {
			val = 0
		}
		timeserieses = append(timeserieses, data.TimeSeries{
			Labels: bucket_labels,
			Samples: []data.Sample{
				{
					Value:     val,
					Timestamp: timestamp,
				},
			},
		})
	}

	inf_labels := []data.Label{
		{
			Name:  "__name__",
			Value: name + "_bucket",
		},
	}
	for k, v := range labels {
		inf_labels = append(inf_labels, data.Label{Name: k, Value: v})
	}
	inf_labels = append(inf_labels, data.Label{Name: "le", Value: "+Inf"})
	timeserieses = append(timeserieses, data.TimeSeries{
		Labels: inf_labels,
		Samples: []data.Sample{
			{
				Value:     1,
				Timestamp: timestamp,
			},
		},
	})
	sum_labels := []data.Label{
		{
			Name:  "__name__",
			Value: name + "_sum",
		},
	}
	for k, v := range labels {
		sum_labels = append(sum_labels, data.Label{Name: k, Value: v})
	}
	timeserieses = append(timeserieses, data.TimeSeries{
		Labels: sum_labels,
		Samples: []data.Sample{
			{
				Value:     value,
				Timestamp: timestamp,
			},
		},
	})
	count_labels := []data.Label{
		{
			Name:  "__name__",
			Value: name + "_count",
		},
	}
	for k, v := range labels {
		count_labels = append(count_labels, data.Label{Name: k, Value: v})
	}
	timeserieses = append(timeserieses, data.TimeSeries{
		Labels: count_labels,
		Samples: []data.Sample{
			{
				Value:     1,
				Timestamp: timestamp,
			},
		},
	})
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
