package controller

import (
	"time"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
)

type DeviceInfo struct {
	Name         string `json:"name"`
	Model        string `json:"model"`
	Category     string `json:"category"`
	Manufacturer string `json:"manufacturer"`
}

type OSInfo struct {
	Family  string `json:"family"`
	Version string `json:"version"`
}

type BrowserInfo struct {
	Family  string `json:"family"`
	Version string `json:"version"`
}

type PlayerInfo struct {
	Name     string `json:"name"`
	Version  string `json:"version"`
	Autoplay bool   `json:"autoplay"`
	Preload  string `json:"preload"`
}

type NetworkInfo struct {
	Asn         int    `json:"asn"`
	CountryCode string `json:"country_code"`
	Region      string `json:"region"`
	City        string `json:"city"`
}

type CDNInfo struct {
	Provider string `json:"provider"`
	EdgePop  string `json:"edge_pop"`
	Origin   string `json:"origin"`
}

type VideoInfo struct {
	Id        string  `json:"id"`
	Title     string  `json:"title"`
	Series    string  `json:"series"`
	Duration  float64 `json:"duration"`
	SourceUrl string  `json:"source_url"`
}

type CMCDData struct {
	Br  int    `json:"br"`
	Bl  int    `json:"bl"`
	Bs  bool   `json:"bs"`
	Cid string `json:"cid"`
	D   int    `json:"d"`
	Dl  int    `json:"dl"`
	Mtp int    `json:"mtp"`
	Ot  string `json:"ot"`
	Pr  int    `json:"pr"`
	Sf  string `json:"sf"`
	Sid string `json:"sid"`
	St  string `json:"st"`
	Su  bool   `json:"su"`
	Tb  int    `json:"tb"`
}

type BaseEvent struct {
	EventType    string `json:"event_type" binding:"required,oneof=playerready viewstart playing pause seek stall_start stall_end ended error quartile heartbeat quality_change"`
	EventTime    int    `json:"event_time" binding:"required, timecheck"`
	ViewerTime   int    `json:"viewer_time" binding:"required"`
	PlaybackTime int    `json:"playback_time"`

	// Session identifiers
	OrgId     string `json:"org_id" binding:"required"`
	PlayerId  string `json:"player_id" binding:"required"`
	ViewId    string `json:"view_id" binding:"required"`
	SessionId string `json:"session_id" binding:"required"`
	ViewerId  string `json:"viewer_id" binding:"required"`

	// Environment
	Env        string `json:"env"`
	AppName    string `json:"app_name"`
	AppVersion string `json:"app_version"`

	// Context
	Device  DeviceInfo  `json:"device"`
	Os      OSInfo      `json:"os"`
	Browser BrowserInfo `json:"browser"`
	Player  PlayerInfo  `json:"player"`
	Network NetworkInfo `json:"network"`
	Cdn     CDNInfo     `json:"cdn"`
	Video   VideoInfo   `json:"video"`
	Cmcd    CMCDData    `json:"cmcd"`

	// Event-specific data
	Data map[string]any `json:"data"`
}

type IngestRequest struct {
	Events []BaseEvent `json:"events" binding:"required, min=1, max=1000, dive"`
}

func RegisterRequestValidators(logger zerolog.Logger) {
	const max_age = 24 * 60 * 60 * 1000
	const max_future = 5 * 60 * 1000
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("timecheck", func(fl validator.FieldLevel) bool {
			// Parse as time
			p := fl.Field().String()
			event_time, err := time.Parse(time.RFC3339, p)
			if err != nil {
				logger.Error().Err(err).Str("format", time.RFC3339).Msg("Failed to parse event time")
				return false
			}
			now := time.Now()
			if event_time.After(now.Add(max_future)) {
				logger.Error().Msg("Event time is too far in the future")
				return false
			}
			if event_time.Before(now.Add(max_age * -1)) {
				logger.Error().Msg("Event time is too old (>24 hours)")
				return false
			}
			return true
		})
	}
}
