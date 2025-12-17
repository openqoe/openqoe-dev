package pool

import (
	"context"
	"sync"

	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/data"
)

type Worker struct {
	ctx           context.Context
	config        *config.Config
	parent_logger zerolog.Logger
	event_chan    <-chan data.IngestRequest
	wait_group    *sync.WaitGroup
}

func NewWorkerPool(config *config.Config, ctx context.Context, parent_logger zerolog.Logger, event_chan <-chan data.IngestRequest) {
	logger := parent_logger.With().Str("sub-component", "worker_pool").Logger()
	worker_pool := &Worker{
		ctx:           ctx,
		config:        config,
		parent_logger: logger,
		event_chan:    event_chan,
		wait_group:    &sync.WaitGroup{},
	}
	for i := 0; i < config.GetWorkerPoolSize(); i++ {
		worker_pool.wait_group.Add(1)
		logger.Debug().Int("worker id", i).Msg("Starting worker")
		go worker_pool.worker(i)
	}
}

func (w *Worker) worker(worker_id int) {
	defer w.wait_group.Done()
	logger := w.parent_logger.With().Str("sub-component", "worker").Int("worker id", worker_id).Logger()
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
		}
	}
}

func (w *Worker) processEvent(event_stream data.IngestRequest, logger zerolog.Logger) {
	for _, event := range event_stream.Events {
		logger.Info().Str("event type", event.EventType).Str("view id", event.ViewId).Msg("Processing event")
		logger.Info().Str("event type", event.EventType).Str("view id", event.ViewId).Msg("Event processing success")
	}

}
