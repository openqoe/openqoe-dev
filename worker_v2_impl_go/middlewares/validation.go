package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"openqoe.dev/worker_v2/data"
)

func ValidateRequest(c *gin.Context) {
	req := new(data.IngestRequest)
	if err := c.ShouldBindJSON(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Validation failed",
			"errors":  err.Error()})
		c.Abort()
		return
	}
	c.Set("request", req)
	c.Next()
}
