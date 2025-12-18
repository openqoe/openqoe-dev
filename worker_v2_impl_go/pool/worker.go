package pool

import (
	"context"
	"sync"

	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/data"
	"openqoe.dev/worker_v2/otel"
)

type Worker struct {
	ctx             context.Context
	config          *config.Config
	logger          zerolog.Logger
	event_chan      <-chan data.IngestRequest
	metrics_service *otel.MetricsService
	wait_group      *sync.WaitGroup
}

func NewWorkerPool(env *config.Env, config_obj *config.Config, ctx context.Context, parent_logger zerolog.Logger, event_chan <-chan data.IngestRequest) {
	logger := parent_logger.With().Str("sub-component", "worker_pool").Logger()
	cardinality_service := config.NewCardinalityService(env, config_obj, logger)
	worker_pool := &Worker{
		ctx:             ctx,
		config:          config_obj,
		logger:          logger,
		event_chan:      event_chan,
		metrics_service: otel.NewMetricsService(config_obj, cardinality_service, logger),
		wait_group:      &sync.WaitGroup{},
	}
	for i := 0; i < config_obj.GetWorkerPoolSize(); i++ {
		worker_pool.wait_group.Add(1)
		logger.Debug().Int("worker id", i).Msg("Starting worker")
		go worker_pool.worker(i)
	}
}

func (w *Worker) worker(worker_id int) {
	defer w.wait_group.Done()
	logger := w.logger.With().Str("sub-component", "worker").Int("worker id", worker_id).Logger()
	for {
		select {
		case event, ok := <-w.event_chan:
			if !ok {
				return
			}
			logger.Info().Msg("Received event")
			// Process event
			w.processEvent(event, logger)
		case <-w.ctx.Done():
			logger.Info().Msg("Context cancelled, stopping worker")
			return
		}
	}
}

func (w *Worker) processEvent(event_stream data.IngestRequest, logger zerolog.Logger) {
	for _, event := range event_stream.Events {
		logger.Info().Str("event type", event.EventType).Str("view id", event.ViewId).Msg("Processing event")
		logger.Info().Str("event type", event.EventType).Str("view id", event.ViewId).Msg("Event processing success")
	}

}
