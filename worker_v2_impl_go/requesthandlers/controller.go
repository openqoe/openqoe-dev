package requesthandlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/otel_service"
)

type RequestHandlerService struct {
	config       *config.Config
	auth_service *config.AuthService
	event_chan   chan<- IngestRequestWithContext
}

func NewRequestHandlerService(env *config.Env, config_obj *config.Config, event_chan chan<- IngestRequestWithContext, parent_logger *zap.Logger) *RequestHandlerService {
	return &RequestHandlerService{
		config:       config_obj,
		auth_service: config.NewAuthService(config_obj, parent_logger),
		event_chan:   event_chan,
	}
}

func (c *RequestHandlerService) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/events", middlewares.Authenticate(c.auth_service), validateRequest, c.ingestEvents)
	r.GET("/health", c.handleHealth)
	r.GET("/stats", c.handleStats)
}

func (c *RequestHandlerService) ingestEvents(ctx *gin.Context) {
	startTime := time.Now()
	var processing_time time.Duration
	ingestion_events := ctx.MustGet("request").(*IngestRequest)
	ingestion_events_with_ctx := &IngestRequestWithContext{
		Ctx:    otel_service.DetachContext(ctx.Request.Context()),
		Events: ingestion_events.Events,
	}
	// channel full
	if cap(c.event_chan)-len(c.event_chan) <= 0 {
		processing_time = time.Since(startTime)
		ctx.JSON(http.StatusTooManyRequests, IngestionSuccessResponse{
			Success:          false,
			Message:          "Server overload",
			EventsReceived:   len(ingestion_events.Events),
			ProcessingTimeMs: processing_time.Milliseconds(),
		})
		return
	}

	c.event_chan <- *ingestion_events_with_ctx
	processing_time = time.Since(startTime)

	ctx.JSON(http.StatusAccepted, IngestionSuccessResponse{
		Success:          true,
		Message:          "Events accepted",
		EventsReceived:   len(ingestion_events.Events),
		ProcessingTimeMs: processing_time.Milliseconds(),
	})
}

func (c *RequestHandlerService) handleHealth(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, &HealthCheck{
		Status:    "healthy",
		Timestamp: time.Now(),
		Service:   "openqoe-worker",
		Version:   "2.0.0",
	})
}

func (c *RequestHandlerService) handleStats(ctx *gin.Context) {
}
