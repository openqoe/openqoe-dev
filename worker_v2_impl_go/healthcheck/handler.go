package healthcheck

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, &HealthCheck{
		Status:    "healthy",
		Timestamp: time.Now(),
		Service:   "openqoe-worker",
		Version:   "2.0.0",
	})
}
