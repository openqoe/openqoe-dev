package middlewares

import (
	"github.com/gin-gonic/gin"
	"openqoe.dev/worker/config"
)

type UnAuthorizedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func Authenticate(auth_service *config.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if res := auth_service.Authenticate(c.Request); !res {
			c.Header("WWW-Authenticate", "Bearer realm='OpenQoE'")
			c.AbortWithStatusJSON(401, UnAuthorizedResponse{
				Success: false,
				Message: "Unauthorized: Invalid or missing API key",
			})
			return
		}
		c.Next()
	}
}
