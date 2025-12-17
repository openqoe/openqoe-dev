package middlewares

import (
	"github.com/gin-gonic/gin"
)

func ValidateRequest(c *gin.Context) {
	c.Next()
}
