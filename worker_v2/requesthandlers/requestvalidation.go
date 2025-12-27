package requesthandlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

const max_past = 24 * time.Hour
const max_future = 5 * time.Minute

func RegisterRequestValidators(logger *zap.Logger) {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("timecheck", func(fl validator.FieldLevel) bool {
			// Parse as time since Unix epoch
			t := fl.Field().Int()
			if t == 0 {
				logger.Error("Event time is zero")
				return false
			}

			event_time := time.UnixMilli(t)
			now := time.Now()
			future_lim := now.Add(max_future)
			if event_time.After(future_lim) {
				logger.Error("Event time is too far in the future",
					zap.Time("event time", event_time),
					zap.Time("current time", now),
					zap.Time("max future limit", future_lim),
				)
				return false
			}
			past_lim := now.Add(max_past * -1)
			if event_time.Before(past_lim) {
				logger.Error("Event time is too old (>24 hours)",
					zap.Time("event time", event_time),
					zap.Time("current time", now),
					zap.Time("max past limit", past_lim),
				)
				return false
			}
			return true
		})
	}
}

func validateRequest(c *gin.Context) {
	req := new(IngestRequest)
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
