package data

import (
	"time"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
)

const max_age = 24 * 60 * 60 * 1000 * time.Millisecond
const max_future = 5 * 60 * 1000 * time.Millisecond

func RegisterRequestValidators(logger zerolog.Logger) {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("timecheck", func(fl validator.FieldLevel) bool {
			// Parse as time since linux epoch
			t := fl.Field().Int()
			event_time := time.UnixMilli(t)
			if event_time.IsZero() {
				logger.Error().Msg("Failed to parse event time")
				return false
			}
			now := time.Now()
			future_lim := now.Add(max_future)
			if event_time.After(future_lim) {
				logger.Error().
					Time("event time", event_time).
					Time("current time", now).
					Time("max future limit", future_lim).
					Msg("Event time is too far in the future")
				return false
			}
			past_lim := now.Add(max_age * -1)
			if event_time.Before(past_lim) {
				logger.Error().
					Time("event time", event_time).
					Time("current time", now).
					Time("max past limit", past_lim).
					Msg("Event time is too old (>24 hours)")
				return false
			}
			return true
		})
	}
}
