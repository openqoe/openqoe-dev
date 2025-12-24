package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/otel_service"
	"openqoe.dev/worker_v2/pool"
	"openqoe.dev/worker_v2/requesthandlers"
)

func main() {
	_ = godotenv.Load()
	logger := otel_service.NewOtelHookeedWorkerLogger()
	root_ctx := context.Background()
	env := config.NewEnv(root_ctx)
	config_obj := config.NewConfig(env, logger)
	otel_shutdown, err := otel_service.SetupOTelSDK(root_ctx, config_obj, logger)
	startProcessMetrics(logger)
	event_chan := make(chan requesthandlers.IngestRequestWithContext, 1000)
	defer close(event_chan)

	if err != nil {
		logger.Fatal("failed to setup OpenTelemetry SDK", zap.Error(err))
		return
	}

	logger.Info("Starting worker pool")
	worker_pool := pool.NewWorkerPool(env, config_obj, logger, event_chan)

	requesthandlers.RegisterRequestValidators(logger)

	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(otelgin.Middleware("openQoE-worker"))
	router.Use(middlewares.GlobalHeaders(env))

	v2 := router.Group("/v2")
	http_req_handler_service := requesthandlers.NewRequestHandlerService(env, config_obj, event_chan, logger)
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

func startProcessMetrics(log *zap.Logger) {
	meter := otel.GetMeterProvider().Meter("hangout.storage.metrics")
	heapMemUsage, _ := meter.Float64ObservableGauge("go_heap_memory_usage")
	stackMemUsage, _ := meter.Float64ObservableGauge("go_stack_memory_usage")
	goRoutineCount, _ := meter.Int64ObservableGauge("go_goroutines_count")
	gcCount, _ := meter.Int64ObservableGauge("go_gc_cycle_count")
	gcPause, _ := meter.Float64ObservableGauge("go_gc_all_stop_pause_time_sum")

	_, err := meter.RegisterCallback(
		func(ctx context.Context, o metric.Observer) error {
			var m runtime.MemStats
			runtime.ReadMemStats(&m)
			o.ObserveFloat64(heapMemUsage, float64(m.Alloc))
			o.ObserveFloat64(stackMemUsage, float64(m.StackInuse))
			o.ObserveInt64(goRoutineCount, int64(runtime.NumGoroutine()))
			o.ObserveFloat64(gcPause, float64(m.PauseTotalNs))
			o.ObserveInt64(gcCount, int64(m.NumGC))

			return nil
		},
		heapMemUsage, stackMemUsage, goRoutineCount, gcCount, gcPause,
	)
	if err != nil {
		log.Error("failed to register metrics callback", zap.Error(err))
	}
}
