package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/data"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/otel_service"
)

type Controller struct {
	config       *config.Config
	auth_service *config.AuthService
	event_chan   chan<- data.IngestRequestWithContext
}

func NewController(env *config.Env, config_obj *config.Config, event_chan chan<- data.IngestRequestWithContext, parent_logger *zap.Logger) *Controller {
	return &Controller{
		config:       config_obj,
		auth_service: config.NewAuthService(config_obj, parent_logger),
		event_chan:   event_chan,
	}
}

func (c *Controller) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/events", middlewares.Authenticate(c.auth_service), middlewares.ValidateRequest, c.ingestEvents)
	r.GET("/health", c.handleHealth)
	r.GET("/stats", c.handleStats)
}

func (c *Controller) ingestEvents(ctx *gin.Context) {
	startTime := time.Now()
	var processing_time time.Duration
	ingestion_events := ctx.MustGet("request").(*data.IngestRequest)
	ingestion_events_with_ctx := &data.IngestRequestWithContext{
		Ctx:    otel_service.DetachContext(ctx.Request.Context()),
		Events: ingestion_events.Events,
	}
	// channel full
	if cap(c.event_chan)-len(c.event_chan) <= 0 {
		processing_time = time.Since(startTime)
		ctx.JSON(http.StatusTooManyRequests, data.IngestionSuccessResponse{
			Success:          false,
			Message:          "Server overload",
			EventsReceived:   len(ingestion_events.Events),
			ProcessingTimeMs: processing_time.Milliseconds(),
		})
		return
	}

	c.event_chan <- *ingestion_events_with_ctx
	processing_time = time.Since(startTime)

	ctx.JSON(http.StatusAccepted, data.IngestionSuccessResponse{
		Success:          true,
		Message:          "Events accepted",
		EventsReceived:   len(ingestion_events.Events),
		ProcessingTimeMs: processing_time.Milliseconds(),
	})
}

func (c *Controller) handleHealth(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, &data.HealthCheck{
		Status:    "healthy",
		Timestamp: time.Now(),
		Service:   "openqoe-worker",
		Version:   "2.0.0",
	})
}

func (c *Controller) handleStats(ctx *gin.Context) {
}
