package compute

import (
	"strconv"
	"time"

	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/data"
)

type MetricsService struct {
	config              *config.Config
	cardinality_service *config.CardinalityService
	logger              zerolog.Logger
}

func NewMetricsService(config *config.Config, cardinality_service *config.CardinalityService, parent_logger zerolog.Logger) *MetricsService {
	return &MetricsService{
		config:              config,
		cardinality_service: cardinality_service,
		logger:              parent_logger.With().Str("sub-component", "metrics-service").Logger(),
	}
}

func (ms *MetricsService) ComputeMetrics(events_chunk data.IngestRequest) []data.TimeSeries {
	timeserieses := []data.TimeSeries{}
	for _, event := range events_chunk.Events {
		ms.logger.Info().Str("event type", event.EventType).Str("view id", event.ViewId).Msg("Processing event")
		ms.transformEventsToMetrics(event, timeserieses)
		ms.logger.Info().Str("event type", event.EventType).Str("view id", event.ViewId).Msg("Event processing success")
	}
	return timeserieses
}

func (ms *MetricsService) transformEventsToMetrics(event data.BaseEvent, timeserieses []data.TimeSeries) {
	base_labels := ms.extractBaseLabels(event)
	timestamp := time.UnixMilli(event.EventTime)

	go createMetric("openqoe_events_total", base_labels, 1, timestamp, timeserieses)
	switch event.EventType {
	case "playerready":
		if val, ok := event.Data["player_startup_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error().Err(err).Msg("Failed to parse player_startup_time")
			} else {
				go createMetric("openqoe_player_startup_seconds", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
		if val, ok := event.Data["page_load_time"]; ok {
			metric_value, err := strconv.ParseFloat(val, 64)
			if err != nil {
				ms.logger.Error().Err(err).Msg("Failed to parse page_load_time")
			} else {
				go createMetric("openqoe_page_load_time", base_labels, metric_value/1000.00, timestamp, timeserieses)
			}
		}
	case "viewstart":
		go createMetric("openqoe_views_started_total", base_labels, 1, timestamp, timeserieses)
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
