package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"openqoe.dev/worker_v2/controller"
	"openqoe.dev/worker_v2/middlewares"
)

func main() {
	_ = godotenv.Load()
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(middlewares.GlobalHeaders())
	v2Router := router.Group("/v2")
	controller.RegisterRoutes(v2Router)
	log.Info().Str("port", "8788").Msg("Starting HTTP server")
	srv := &http.Server{
		Addr:    ":8788",
		Handler: router.Handler(),
	}
	go func() {
		// service connections
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("listen error")
		}
	}()
	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no params) by default sends syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info().Msg("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Error().Err(err).Msg("Server Shutdown Failed")
	}
	log.Info().Msg("Server exiting")
}
