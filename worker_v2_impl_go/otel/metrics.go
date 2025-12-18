package otel

import (
	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/config"
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
