package main

import (
	"context"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"openqoe.dev/worker_v2/compute"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/otelservice"
	"openqoe.dev/worker_v2/pool"
	"openqoe.dev/worker_v2/requesthandlers"
)

func main() {
	logger_encoder_config := zap.NewProductionEncoderConfig()
	logger_encoder_config.EncodeTime = zapcore.RFC3339TimeEncoder
	logger_encoder_config.EncodeLevel = zapcore.CapitalLevelEncoder
	logger_config := zap.NewProductionConfig()
	logger_config.EncoderConfig = logger_encoder_config
	root_logger, _ := logger_config.Build()
	defer root_logger.Sync()

	_ = godotenv.Load()
	root_ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	env := config.NewEnv(root_ctx)
	config_obj := config.NewConfig(root_ctx, env, root_logger)
	otel_shutdown, otel_service, err := otelservice.SetupOTelSDK(root_ctx, config_obj, logger_encoder_config)
	logger := otel_service.Logger
	if err != nil {
		logger.Fatal("failed to setup OpenTelemetry SDK", zap.Error(err))
		return
	}

	logger.Info("Starting to observe system metrics")
	compute.MeasureSystemMetrics(otel_service)

	event_chan := make(chan requesthandlers.IngestRequestWithContext, 1000)

	cardinality_service := config.NewCardinalityService(env, config_obj, otel_service.Logger)

	logger.Info("Starting worker pool")
	worker_pool := pool.NewWorkerPool(env, config_obj, otel_service, cardinality_service, event_chan)

	logger.Info("Starting HTTP server", zap.Int("port", 8788))
	requesthandlers.RegisterRequestValidators(logger)
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(otelgin.Middleware("openQoE-worker"))
	router.Use(middlewares.GlobalHeaders(env))

	v2 := router.Group("/v2")
	http_req_handler_service := requesthandlers.NewRequestHandlerService(env, config_obj, otel_service, cardinality_service, event_chan)
	http_req_handler_service.RegisterRoutes(v2)

	srv := &http.Server{
		Addr:    ":8788",
		Handler: router.Handler(),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen error", zap.Error(err))
		}
	}()

	// Shutdown Sequence
	<-root_ctx.Done()
	logger.Info("shutdown signal received")

	shutdown_ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 1. Stop HTTP server (no more producers)
	if err := srv.Shutdown(shutdown_ctx); err != nil {
		logger.Error("HTTP shutdown failed", zap.Error(err))
	} else {
		logger.Info("HTTP server stopped")
	}

	// 2. Close channel (signals workers to exit)
	close(event_chan)

	// 3. Wait for workers
	worker_pool.Wg.Wait()
	logger.Info("all workers finished processing")

	// 4. Shutdown OTel
	if err := otel_shutdown(shutdown_ctx); err != nil {
		logger.Error("OTel shutdown failed", zap.Error(err))
	} else {
		logger.Info("OTel shutdown complete")
	}
	logger.Info("exiting cleanly")

}
