package compute

import (
	"context"
	"maps"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker/requesthandlers"
)

func (ms *MetricsService) extractBaseLabels(event requesthandlers.BaseEvent, marker string) map[string]string {
	labels := map[string]string{
		"org_id":     event.OrgId,
		"player_id":  event.PlayerId,
		"event_type": event.EventType,
		"marker":     marker,
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

func addAttributes(src map[string]string, dst map[string]string) attribute.Set {
	out := make(map[string]string, len(src)+len(dst))
	maps.Copy(out, src)
	maps.Copy(out, dst)
	return mapToAttributeSet(out)
}

func mapToAttributeSet(m map[string]string) attribute.Set {
	attrs := make([]attribute.KeyValue, 0, len(m))
	for k, v := range m {
		attrs = append(attrs, attribute.String(k, v))
	}
	return attribute.NewSet(attrs...)
}

// getFloat64 safely extracts a float64 value from event data with a fallback default
func getFloat64(event *requesthandlers.BaseEvent, field string, defaultVal float64, logger *zap.Logger) float64 {
	if val, ok := event.Data[field]; ok && val != nil {
		if floatVal, ok := val.(float64); ok {
			return floatVal
		}
		logger.Warn("type assertion failed for float64",
			zap.String("field", field),
			zap.String("sessionId", event.SessionId),
			zap.Any("value", val),
			zap.String("expectedType", "float64"),
			zap.Float64("defaultValue", defaultVal),
		)
	}
	return defaultVal
}

// getString safely extracts a string value from event data with a fallback default
func getString(event *requesthandlers.BaseEvent, field string, defaultVal string, logger *zap.Logger) string {
	if val, ok := event.Data[field]; ok && val != nil {
		if strVal, ok := val.(string); ok {
			return strVal
		}
		logger.Warn("type assertion failed for string",
			zap.String("field", field),
			zap.String("sessionId", event.SessionId),
			zap.Any("value", val),
			zap.String("expectedType", "string"),
			zap.String("defaultValue", defaultVal),
		)
	}
	return defaultVal
}

// getBool safely extracts a bool value from event data with a fallback default
func getBool(event *requesthandlers.BaseEvent, field string, defaultVal bool, logger *zap.Logger) bool {
	if val, ok := event.Data[field]; ok && val != nil {
		if boolVal, ok := val.(bool); ok {
			return boolVal
		}
		logger.Warn("type assertion failed for bool",
			zap.String("field", field),
			zap.String("sessionId", event.SessionId),
			zap.Any("value", val),
			zap.String("expectedType", "bool"),
			zap.Bool("defaultValue", defaultVal),
		)
	}
	return defaultVal
}

// getInt64 safely extracts an int64 value from a float64 in event data with a fallback default
func getInt64(event *requesthandlers.BaseEvent, field string, defaultVal int64, logger *zap.Logger) int64 {
	if val, ok := event.Data[field]; ok && val != nil {
		if floatVal, ok := val.(float64); ok {
			return int64(floatVal)
		}
		logger.Warn("type assertion failed for int64 (from float64)",
			zap.String("field", field),
			zap.String("sessionId", event.SessionId),
			zap.Any("value", val),
			zap.String("expectedType", "float64"),
			zap.Int64("defaultValue", defaultVal),
		)
	}
	return defaultVal
}

// getMap safely extracts a map[string]any value from event data with a fallback default
func getMap(event *requesthandlers.BaseEvent, field string, defaultVal map[string]any, logger *zap.Logger) map[string]any {
	if val, ok := event.Data[field]; ok && val != nil {
		if mapVal, ok := val.(map[string]any); ok {
			return mapVal
		}
		logger.Warn("type assertion failed for map[string]any",
			zap.String("field", field),
			zap.String("sessionId", event.SessionId),
			zap.Any("value", val),
			zap.String("expectedType", "map[string]any"),
		)
	}
	return defaultVal
}

// getMapFloat64 safely extracts a float64 value from a nested map
func getMapFloat64(m map[string]any, field string, defaultVal float64, logger *zap.Logger) float64 {
	if val, ok := m[field]; ok && val != nil {
		if floatVal, ok := val.(float64); ok {
			return floatVal
		}
		logger.Warn("type assertion failed for float64 in map",
			zap.String("field", field),
			zap.Any("value", val),
			zap.String("expectedType", "float64"),
			zap.Float64("defaultValue", defaultVal),
		)
	}
	return defaultVal
}

// recordResolutionMetric records the resolution metric from event data
func (ms *MetricsService) recordResolutionMetric(event *requesthandlers.BaseEvent, evnt_ctx context.Context, base_labels map[string]string) {
	val_map := getMap(event, "resolution", nil, ms.logger)
	if val_map != nil {
		width := int64(getMapFloat64(val_map, "width", 0, ms.logger))
		height := int64(getMapFloat64(val_map, "height", 0, ms.logger))
		res := &resolution{width: width, height: height}
		resolution_label := getResolutionLabel(res)

		labels := addAttributes(base_labels, map[string]string{"resolution": resolution_label})
		ms.metrics.resolution_total.Add(evnt_ctx, 1, metric.WithAttributeSet(labels))
	}
}
