package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/events"
	"openqoe.dev/worker_v2/healthcheck"
	"openqoe.dev/worker_v2/statistics"
)

type Controller struct {
	config             *config.Config
	cardinalityService *config.CardinalityService
}

func NewController(env *config.Env, logger zerolog.Logger) *Controller {
	config_obj := config.NewConfig(env, logger)
	return &Controller{
		config:             config_obj,
		cardinalityService: config.NewCardinalityService(config_obj, env, logger),
	}
}

func (c *Controller) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/events", events.IngestEvents)
	r.GET("/health", healthcheck.HandleHealth)
	r.GET("/stats", statistics.HandleStats)
}
