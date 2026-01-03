package requesthandlers

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"openqoe.dev/worker_v2/config"
)

func markDevice(env *config.Env) gin.HandlerFunc {
	return func(c *gin.Context) {
		marker, err := c.Cookie("marker")
		if err != nil || marker == "" {
			new_marker := uuid.New().String()
			c.SetCookie("marker", new_marker, 3600*24*365*2, "/v2/events", env.OWN_DOMAIN, true, true)
			marker = new_marker
		}
		c.Set("marker", marker)
		c.Next()
	}
}
