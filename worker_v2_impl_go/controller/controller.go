package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/middlewares"
)

type Controller struct {
	config              *config.Config
	auth_service        *config.AuthService
	cardinality_service *config.CardinalityService
}

func NewController(env *config.Env, parent_logger zerolog.Logger) *Controller {
	config_obj := config.NewConfig(env, parent_logger)
	return &Controller{
		config:              config_obj,
		auth_service:        config.NewAuthService(config_obj, parent_logger),
		cardinality_service: config.NewCardinalityService(config_obj, env, parent_logger),
	}
}

func (c *Controller) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/events", middlewares.Authenticate(c.auth_service), middlewares.ValidateRequest, c.ingestEvents)
	r.GET("/health", c.handleHealth)
	r.GET("/stats", c.handleStats)
}

func (c *Controller) ingestEvents(ctx *gin.Context) {
}

func (c *Controller) handleHealth(ctx *gin.Context) {
}

func (c *Controller) handleStats(ctx *gin.Context) {
}
