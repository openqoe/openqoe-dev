package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"openqoe.dev/worker_v2/config"
)

func GlobalHeaders(env *config.Env) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Cors Headers
		allowed_origins := env.CORS_ALLOWED_ORIGINS
		c.Header("Access-Control-Allow-Origin", allowed_origins)
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, X-API-Key, X-SDK-Version")
		c.Header("Access-Control-Max-Age", "86400")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		// Own default headers
		c.Header("Content-Type", "application/json")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		mode := env.GIN_MODE
		if mode == config.GIN_MODE_RELEASE {
			c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}
		c.Header("Content-Security-Policy",
			"default-src 'self'; "+
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "+
				"font-src 'self' https://fonts.gstatic.com; "+
				"img-src 'self' data:; "+
				"script-src 'self'; "+
				"connect-src 'self';")
		// my custom header
		c.Header("X-App-Version", "v2")
		c.Next()
	}
}
