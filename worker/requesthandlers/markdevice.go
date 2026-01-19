package requesthandlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"openqoe.dev/worker/config"
)

func markDevice(env *config.Env) gin.HandlerFunc {
	return func(c *gin.Context) {
		marker, err := c.Cookie("marker")
		if err != nil || marker == "" {
			newMarker, err := uuid.NewV7()
			if err != nil {
				// Fallback to v4 UUID to avoid zero-value marker
				newMarker = uuid.New()
			}
			marker := newMarker.String()
			c.SetCookie("marker", marker, int(24*365*2*time.Hour), "/v2/events", env.OWN_DOMAIN, true, true)
		}
		c.Set("marker", marker)
		c.Next()
	}
}
