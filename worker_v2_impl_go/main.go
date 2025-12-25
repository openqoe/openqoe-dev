package main

import (
	"context"
	"net/http"
	"os"
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
	_ = godotenv.Load()
	root_ctx := context.Background()
	logger_encoder_config := zap.NewProductionEncoderConfig()
	logger_encoder_config.EncodeTime = zapcore.RFC3339TimeEncoder
	logger_encoder_config.EncodeLevel = zapcore.CapitalLevelEncoder
	logger_config := zap.NewProductionConfig()
	logger_config.EncoderConfig = logger_encoder_config
	root_logger, _ := logger_config.Build()
	defer root_logger.Sync()
	env := config.NewEnv(root_ctx)
	config_obj := config.NewConfig(env, root_logger)
	otel_shutdown, otel_service, err := otelservice.SetupOTelSDK(root_ctx, config_obj, logger_encoder_config)
	logger := otel_service.Logger
	if err != nil {
		logger.Fatal("failed to setup OpenTelemetry SDK", zap.Error(err))
		return
	}
	compute.MeasureSystemMetrics(otel_service)
	event_chan := make(chan requesthandlers.IngestRequestWithContext, 1000)
	defer close(event_chan)

	logger.Info("Starting worker pool")
	worker_pool := pool.NewWorkerPool(env, config_obj, otel_service, event_chan)

	requesthandlers.RegisterRequestValidators(logger)

	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(otelgin.Middleware("openQoE-worker"))
	router.Use(middlewares.GlobalHeaders(env))

	v2 := router.Group("/v2")
	http_req_handler_service := requesthandlers.NewRequestHandlerService(env, config_obj, event_chan, otel_service)
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

	// OS signal handling
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit
	logger.Info("shutdown signal received")

	// graceful HTTP shutdown
	httpCtx, httpCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer httpCancel()

	if err := srv.Shutdown(httpCtx); err != nil {
		logger.Error("server shutdown failed", zap.Error(err))
	}

	logger.Info("HTTP server stopped")

	close(event_chan)
	worker_pool.Wg.Wait()
	logger.Info("all workers finished processing")
	logger.Info("flushing and shutting down OTel...")
	otelCtx, otelCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer otelCancel()

	if err := otel_shutdown(otelCtx); err != nil {
		logger.Error("OTel shutdown failed", zap.Error(err))
	}

	logger.Info("exiting cleanly")
}
