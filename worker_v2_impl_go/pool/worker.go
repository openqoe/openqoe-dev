package pool

import (
	"sync"

	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/compute"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/data"
)

type WorkerPool struct {
	Wg *sync.WaitGroup
}

func NewWorkerPool(env *config.Env, config_obj *config.Config, parent_logger zerolog.Logger, event_chan <-chan data.IngestRequest) *WorkerPool {
	logger := parent_logger.With().Str("sub-component", "worker_pool").Logger()
	cardinality_service := config.NewCardinalityService(env, config_obj, logger)
	metrics_service := compute.NewMetricsService(config_obj, cardinality_service, logger)
	wg := &sync.WaitGroup{}
	pool := &WorkerPool{Wg: wg}
	for i := 0; i < config_obj.GetWorkerPoolSize(); i++ {
		wg.Add(1)
		logger.Debug().Int("worker id", i).Msg("Starting worker")
		go func(id int) {
			defer wg.Done()
			worker(id, logger, metrics_service, event_chan)
		}(i)
	}
	return pool
}

func worker(worker_id int, parent_logger zerolog.Logger, metrics_service *compute.MetricsService, event_chan <-chan data.IngestRequest) {
	logger := parent_logger.With().Str("sub-component", "worker").Int("worker id", worker_id).Logger()
	// For events in the channel
	for events_chunk := range event_chan {
		logger.Info().Msg("Received event")
		// For each event chunk
		time_series := metrics_service.ComputeMetrics(events_chunk)
	}
}
