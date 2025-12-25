package requesthandlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/otelservice"
)

type RequestHandlerService struct {
	config                   *config.Config
	auth_service             *config.AuthService
	otel_service             *otelservice.OpenTelemetryService
	req_processing_time_hist metric.Int64Histogram
	event_chan               chan<- IngestRequestWithContext
}

func NewRequestHandlerService(env *config.Env, config_obj *config.Config, event_chan chan<- IngestRequestWithContext, otel_service *otelservice.OpenTelemetryService) *RequestHandlerService {
	req_processing_time_gauge, err := otel_service.Meter.Int64Histogram(
		"request_processing_time",
		metric.WithDescription("Time taken for the request from being received in server till just before sending response back"),
		metric.WithUnit("ns"),
		metric.WithExplicitBucketBoundaries(100000, 150000, 250000, 400000, 600000, 850000, 11000000),
	)
	if err != nil {
		otel_service.Logger.Error("request processing time gauge set up failed", zap.Error(err))
	}
	return &RequestHandlerService{
		config:                   config_obj,
		auth_service:             config.NewAuthService(config_obj, otel_service.Logger),
		otel_service:             otel_service,
		req_processing_time_hist: req_processing_time_gauge,
		event_chan:               event_chan,
	}
}

func (rhs *RequestHandlerService) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/events", middlewares.Authenticate(rhs.auth_service), validateRequest, rhs.ingestEvents)
	r.GET("/health", rhs.handleHealth)
	r.GET("/stats", rhs.handleStats)
}

func (rhs *RequestHandlerService) ingestEvents(c *gin.Context) {
	_, span := rhs.otel_service.Tracer.Start(c.Request.Context(), "ingestEvents", trace.WithSpanKind(trace.SpanKindProducer))
	defer span.End()
	logger := rhs.otel_service.Logger
	startTime := c.MustGet("req_start_time").(int64)
	ingestion_events := c.MustGet("request").(*IngestRequest)
	ingestion_events_with_ctx := &IngestRequestWithContext{
		Ctx:    otelservice.DetachContext(c.Request.Context()),
		Events: ingestion_events.Events,
	}
	// channel full
	if cap(rhs.event_chan)-len(rhs.event_chan) <= 0 {
		processing_time := time.Now().UnixNano() - startTime
		c.JSON(http.StatusTooManyRequests, IngestionSuccessResponse{
			Success:          false,
			Message:          "Server overload",
			EventsReceived:   len(ingestion_events.Events),
			ProcessingTimeNs: processing_time,
		})
		return
	}
	rhs.event_chan <- *ingestion_events_with_ctx
	processing_time := time.Now().UnixNano() - startTime
	logger.Debug("request processing time", zap.Int64("duration_ns", processing_time))
	rhs.req_processing_time_hist.Record(c.Request.Context(), processing_time,
		metric.WithAttributes(
			attribute.String("org.id", ingestion_events_with_ctx.Events[0].OrgId),
			attribute.String("player.id", ingestion_events_with_ctx.Events[0].PlayerId),
		))
	c.JSON(http.StatusAccepted, IngestionSuccessResponse{
		Success:          true,
		Message:          "Events accepted",
		EventsReceived:   len(ingestion_events.Events),
		ProcessingTimeNs: processing_time,
	})
}

func (rhs *RequestHandlerService) handleHealth(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, &HealthCheck{
		Status:    "healthy",
		Timestamp: time.Now(),
		Service:   "openqoe-worker",
		Version:   "2.0.0",
	})
}

func (rhs *RequestHandlerService) handleStats(ctx *gin.Context) {
}
