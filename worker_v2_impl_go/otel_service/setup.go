package otel_service

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.37.0"
	"openqoe.dev/worker_v2/config"
)

// setupOTelSDK bootstraps the OpenTelemetry pipeline.
// If it does not return an error, make sure to call shutdown for proper cleanup.
func SetupOTelSDK(ctx context.Context, config_obj *config.Config) (func(context.Context) error, error) {
	var shutdownFuncs []func(context.Context) error
	var err error

	// shutdown calls cleanup functions registered via shutdownFuncs.
	// The errors from the calls are joined.
	// Each registered cleanup will be invoked once.
	shutdown := func(ctx context.Context) error {
		var err error
		for _, fn := range shutdownFuncs {
			err = errors.Join(err, fn(ctx))
		}
		shutdownFuncs = nil
		return err
	}

	// handleErr calls shutdown for cleanup and makes sure that all errors are returned.
	handleErr := func(inErr error) {
		err = errors.Join(inErr, shutdown(ctx))
	}

	// Set up propagator.
	prop := newPropagator()
	otel.SetTextMapPropagator(prop)
	// Set up resource
	res := resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceName("openQoE-worker"),
		semconv.ServiceInstanceID(uuid.New().String()),
	)
	// Set up trace provider.
	tracerProvider, err := newTracerProvider(ctx, config_obj, res)
	if err != nil {
		handleErr(err)
		return shutdown, err
	}
	shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
	otel.SetTracerProvider(tracerProvider)

	// Set up meter provider.
	meterProvider, err := newMeterProvider(ctx, config_obj, res)
	if err != nil {
		handleErr(err)
		return shutdown, err
	}
	shutdownFuncs = append(shutdownFuncs, meterProvider.Shutdown)
	otel.SetMeterProvider(meterProvider)

	// Set up logger provider.
	loggerProvider, err := newLoggerProvider(ctx, config_obj, res)
	if err != nil {
		handleErr(err)
		return shutdown, err
	}
	shutdownFuncs = append(shutdownFuncs, loggerProvider.Shutdown)
	global.SetLoggerProvider(loggerProvider)

	return shutdown, err
}

func newPropagator() propagation.TextMapPropagator {
	return propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
}

func newTracerProvider(ctx context.Context, config_obj *config.Config, res *resource.Resource) (*trace.TracerProvider, error) {
	otelCfg := config_obj.GetOtelConfig()

	// 1. Initialize common options
	opts := []otlptracegrpc.Option{
		otlptracegrpc.WithEndpoint(otelCfg.Url),
		otlptracegrpc.WithCompressor("gzip"),
	}

	// 2. Add conditional options
	if config_obj.GetConfigType() == config.SelfHosted {
		opts = append(opts, otlptracegrpc.WithInsecure())
	}

	// 3. Create the exporter with the combined options
	traceExporter, err := otlptracegrpc.New(ctx, opts...)
	if err != nil {
		return nil, err
	}

	tracerProvider := trace.NewTracerProvider(
		trace.WithBatcher(traceExporter),
		trace.WithResource(res),
	)

	return tracerProvider, nil
}
func newMeterProvider(ctx context.Context, config_obj *config.Config, res *resource.Resource) (*metric.MeterProvider, error) {
	otelCfg := config_obj.GetOtelConfig()

	// 1. Initialize common options
	opts := []otlpmetricgrpc.Option{
		otlpmetricgrpc.WithEndpoint(otelCfg.Url),
		otlpmetricgrpc.WithCompressor("gzip"),
	}

	// 2. Add Insecure option only for Self-Hosted
	if config_obj.GetConfigType() == config.SelfHosted {
		opts = append(opts, otlpmetricgrpc.WithInsecure())
	}

	// 3. Create the exporter
	metricExporter, err := otlpmetricgrpc.New(ctx, opts...)
	if err != nil {
		return nil, err
	}

	// 4. Wrap with a PeriodicReader (default is 1-minute intervals)
	meterProvider := metric.NewMeterProvider(
		metric.WithReader(metric.NewPeriodicReader(metricExporter)),
		metric.WithResource(res),
	)

	return meterProvider, nil
}

func newLoggerProvider(ctx context.Context, config_obj *config.Config, res *resource.Resource) (*log.LoggerProvider, error) {
	otelCfg := config_obj.GetOtelConfig()

	// 1. Initialize common options
	opts := []otlploggrpc.Option{
		otlploggrpc.WithEndpoint(otelCfg.Url),
		otlploggrpc.WithCompressor("gzip"),
	}

	// 2. Add Insecure option only for Self-Hosted
	if config_obj.GetConfigType() == config.SelfHosted {
		opts = append(opts, otlploggrpc.WithInsecure())
	}

	// 3. Create the log exporter
	logExporter, err := otlploggrpc.New(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to create log exporter: %w", err)
	}

	// 4. Create the provider with a BatchProcessor
	// This is more efficient than a SimpleProcessor for high-volume logs
	loggerProvider := log.NewLoggerProvider(
		log.WithProcessor(log.NewBatchProcessor(logExporter)),
		log.WithResource(res),
	)

	return loggerProvider, nil
}
