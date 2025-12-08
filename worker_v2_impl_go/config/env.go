package config

import "os"

type GinMode string

const (
	GIN_MODE_DEBUG   GinMode = "debug"
	GIN_MODE_RELEASE GinMode = "release"
	GIN_MODE_TEST    GinMode = "test"
)

type Env struct {
	KV_STORE_URL              string
	OTEL_URL                  string
	GRAFANA_CLOUD_INSTANCE_ID string
	GRAFANA_CLOUD_API_KEY     string
	GRAFANA_CLOUD_REGION      string
	API_KEY                   string
	CARDINALITY_LIMITS        string
	CORS_ALLOWED_ORIGINS      string
	GIN_MODE                  GinMode
}

func NewEnv() *Env {
	gm := GIN_MODE_DEBUG
	if getEnv("GIN_MODE", "debug") == "release" {
		gm = GIN_MODE_RELEASE
	}
	return &Env{
		KV_STORE_URL:              getEnv("KV_STORE_URL", "redis://localhost:6379"),
		OTEL_URL:                  getEnv("OTEL_URL", ""),
		GRAFANA_CLOUD_INSTANCE_ID: getEnv("GRAFANA_CLOUD_INSTANCE_ID", ""),
		GRAFANA_CLOUD_API_KEY:     getEnv("GRAFANA_CLOUD_API_KEY", ""),
		GRAFANA_CLOUD_REGION:      getEnv("GRAFANA_CLOUD_REGION", "us"),
		API_KEY:                   getEnv("API_KEY", "default_api_key"),
		CARDINALITY_LIMITS:        getEnv("CARDINALITY_LIMITS", "default_limits"),
		CORS_ALLOWED_ORIGINS:      getEnv("CORS_ALLOWED_ORIGINS", "*"),
		GIN_MODE:                  gm,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
