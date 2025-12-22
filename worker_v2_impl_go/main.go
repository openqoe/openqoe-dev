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
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/controller"
	"openqoe.dev/worker_v2/data"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/otel_service"
	"openqoe.dev/worker_v2/pool"
)

func main() {
	_ = godotenv.Load()
	logger := otel_service.NewOtelHookeedWorkerLogger()
	env := config.NewEnv(context.Background())
	config_obj := config.NewConfig(env, logger)
	otel_shutdown, err := otel_service.SetupOTelSDK(context.Background(), config_obj)

	event_chan := make(chan data.IngestRequestWithContext, 1000)
	defer close(event_chan)

	if err != nil {
		logger.Fatal("failed to setup OpenTelemetry SDK", zap.Error(err))
		return
	}

	logger.Info("Starting worker pool")
	worker_pool := pool.NewWorkerPool(env, config_obj, logger, event_chan)

	data.RegisterRequestValidators(logger)

	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(otelgin.Middleware("openQoE-worker"))
	router.Use(middlewares.GlobalHeaders(env))

	v2 := router.Group("/v2")
	controller_obj := controller.NewController(env, config_obj, event_chan, logger)
	controller_obj.RegisterRoutes(v2)

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
