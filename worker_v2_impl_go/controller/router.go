package controller

import (
	"github.com/gin-gonic/gin"
	"openqoe.dev/worker_v2/events"
	"openqoe.dev/worker_v2/healthcheck"
	"openqoe.dev/worker_v2/statistics"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/events", events.IngestEvents)
	r.GET("/health", healthcheck.HandleHealth)
	r.GET("/stats", statistics.HandleStats)
}
