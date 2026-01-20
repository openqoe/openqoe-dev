package pool

import (
	"sync"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
	"openqoe.dev/worker/compute"
	"openqoe.dev/worker/config"
	"openqoe.dev/worker/otelservice"
	"openqoe.dev/worker/requesthandlers"
)

type WorkerPool struct {
	Wg *sync.WaitGroup
}

func NewWorkerPool(env *config.Env, config_obj *config.Config, otel_service *otelservice.OpenTelemetryService, cardinality_service *config.CardinalityService, event_chan <-chan *requesthandlers.IngestRequestWithContext) *WorkerPool {
	logger := otel_service.Logger.With(zap.String("sub-component", "worker_pool"))
	metrics_service := compute.NewMetricsService(config_obj, cardinality_service, otel_service, logger)
	wg := &sync.WaitGroup{}
	pool := &WorkerPool{Wg: wg}
	for i := 0; i < config_obj.GetWorkerPoolSize(); i++ {
		wg.Add(1)
		logger.Debug("Starting worker", zap.Int("worker id", i))
		go func(id int) {
			defer wg.Done()
			worker(id, logger, otel_service.Tracer, metrics_service, event_chan)
		}(i)
	}
	return pool
}

func worker(worker_id int, parent_logger *zap.Logger, tracer trace.Tracer, metrics_service *compute.MetricsService, event_chan <-chan *requesthandlers.IngestRequestWithContext) {
	logger := parent_logger.With(zap.String("sub-component", "worker"), zap.Int("worker id", worker_id))
	// For events in the channel
	for events_chunk := range event_chan {
		do(tracer, events_chunk, worker_id, metrics_service, logger)
	}
}

func do(tracer trace.Tracer, events_chunk *requesthandlers.IngestRequestWithContext, worker_id int, metrics_service *compute.MetricsService, logger *zap.Logger) {
	span_ctx, span := tracer.Start(events_chunk.Ctx, "worker.work", trace.WithSpanKind(trace.SpanKindConsumer), trace.WithAttributes(attribute.Int("worker.id", worker_id)))
	defer span.End()
	logger.Debug("Received event for processing", zap.Int("worker id", worker_id))
	// For each event chunk
	metrics_service.ComputeMetrics(events_chunk, tracer, span_ctx)
	logger.Info("Event processing complete", zap.Int("worker id", worker_id))
}
