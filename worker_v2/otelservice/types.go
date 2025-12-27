package otelservice

import (
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

const package_name = "openqoe.dev/worker_v2"

type OpenTelemetryService struct {
	Tracer trace.Tracer
	Logger *zap.Logger
	Meter  metric.Meter
}
