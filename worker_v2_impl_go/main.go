package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/rs/zerolog"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"openqoe.dev/worker_v2/config"
	"openqoe.dev/worker_v2/controller"
	"openqoe.dev/worker_v2/data"
	"openqoe.dev/worker_v2/middlewares"
	"openqoe.dev/worker_v2/pool"
)

func main() {
	_ = godotenv.Load()

	logger := zerolog.New(
		zerolog.ConsoleWriter{
			Out:        os.Stderr,
			TimeFormat: time.RFC3339,
		},
	).With().Timestamp().Str("component", "openQoE-worker").Logger()

	root_ctx, rootCancel := context.WithCancel(context.Background())
	defer rootCancel()

	env := config.NewEnv(root_ctx)
	config_obj := config.NewConfig(env, logger)

	event_chan := make(chan data.IngestRequest, 1000)
	defer close(event_chan)

	logger.Info().Msg("Starting worker pool")
	pool.NewWorkerPool(env, config_obj, root_ctx, logger, event_chan)

	data.RegisterRequestValidators(logger)

	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(middlewares.GlobalHeaders(env))

	v2 := router.Group("/v2")
	controller_obj := controller.NewController(env, config_obj, root_ctx, event_chan, logger)
	controller_obj.RegisterRoutes(v2)

	srv := &http.Server{
		Addr:    ":8788",
		Handler: router.Handler(),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal().Err(err).Msg("listen error")
		}
	}()

	// OS signal handling
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit
	logger.Info().Msg("shutdown signal received")

	// cancel root context so workers stop
	rootCancel()

	// graceful HTTP shutdown
	httpCtx, httpCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer httpCancel()

	if err := srv.Shutdown(httpCtx); err != nil {
		logger.Error().Err(err).Msg("server shutdown failed")
	}

	logger.Info().Msg("server exited cleanly")
}
