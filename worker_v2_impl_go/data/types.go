package data

import "time"

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
	EventType    string  `json:"event_type" binding:"required,oneof=playerready viewstart playing pause seek stall_start stall_end ended error quartile heartbeat quality_change"`
	EventTime    int     `json:"event_time" binding:"required,timecheck"`
	ViewerTime   int     `json:"viewer_time" binding:"required"`
	PlaybackTime float64 `json:"playback_time"`

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
	Events []BaseEvent `json:"events" binding:"required,min=1,max=1000,dive"`
}

type IngestionSuccessResponse struct {
	Success          bool   `json:"success"`
	Message          string `json:"message"`
	EventsReceived   int    `json:"events_received"`
	ProcessingTimeMs int64  `json:"processing_time_ms"`
}

type HealthCheck struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Service   string    `json:"service"`
	Version   string    `json:"version"`
}
