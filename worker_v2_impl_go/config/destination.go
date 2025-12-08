package config

import (
	"errors"

	"github.com/rs/zerolog"
)

type DestinationType string
type OtelConfig struct {
	url string
}
type GrafanaConfig struct {
	GrafanaCloudInstanceID string
	GrafanaCloudAPIKey     string
	GrafanaCloudRegion     string
	Headers                map[string]string
}

const (
	SelfHosted   DestinationType = "self-hosted"
	GrafanaCloud DestinationType = "grafana-cloud"
)

type DestinationConfig struct {
	DestinationType DestinationType
	Otel            *OtelConfig
	Grafana         *GrafanaConfig
}

type DestinationManager struct {
	env    *Env
	logger zerolog.Logger
}

func NewDestinationManager(env *Env, parentLogger zerolog.Logger) *DestinationManager {
	return &DestinationManager{env: env, logger: parentLogger.With().Str("sub-component", "DestinationManager").Logger()}
}

func (dm *DestinationManager) GetDestinationConfig() *DestinationConfig {
	destinationType := dm.getDestinationType()
	switch destinationType {
	case GrafanaCloud:
		return dm.getGrafanaConfig()
	case SelfHosted:
		return dm.getSelfHostedConfig()
	default:
		return nil
	}
}

func (dm *DestinationManager) getDestinationType() DestinationType {
	if dm.env.GRAFANA_CLOUD_INSTANCE_ID != "" {
		return GrafanaCloud
	}
	return SelfHosted
}

func (dm *DestinationManager) getGrafanaConfig() *DestinationConfig {
	if dm.env.GRAFANA_CLOUD_INSTANCE_ID == "" || dm.env.GRAFANA_CLOUD_API_KEY == "" {
		dm.logger.Fatal().
			Str("required_fields", "GRAFANA_CLOUD_INSTANCE_ID, GRAFANA_CLOUD_API_KEY").
			Msg("Grafana Cloud configuration incomplete")
	}
	if dm.env.OTEL_URL == "" {
		dm.logger.Fatal().
			Str("required_fields", dm.env.OTEL_URL).
			Msg("OTEL_URL is required for Metrics and Logs sending")
	}
	return &DestinationConfig{
		DestinationType: GrafanaCloud,
		Otel: &OtelConfig{
			url: dm.env.OTEL_URL,
		},
		Grafana: &GrafanaConfig{
			GrafanaCloudInstanceID: dm.env.GRAFANA_CLOUD_INSTANCE_ID,
			GrafanaCloudAPIKey:     dm.env.GRAFANA_CLOUD_API_KEY,
			GrafanaCloudRegion:     dm.env.GRAFANA_CLOUD_REGION,
			Headers: map[string]string{
				"X-Scope-OrgID": dm.env.GRAFANA_CLOUD_INSTANCE_ID,
			},
		},
	}
}

func (dm *DestinationManager) getSelfHostedConfig() *DestinationConfig {
	if dm.env.OTEL_URL == "" {
		dm.logger.Fatal().
			Str("required_fields", dm.env.OTEL_URL).
			Msg("OTEL_URL is required for Metrics and Logs sending")
	}
	return &DestinationConfig{
		DestinationType: SelfHosted,
		Otel: &OtelConfig{
			url: dm.env.OTEL_URL,
		},
	}
}

func (dm *DestinationManager) validateConfiguration() (bool, []error) {
	var error_list []error
	config := dm.GetDestinationConfig()
	if config.Otel.url == "" {
		error_list = append(error_list, errors.New("OTEL_URL is missing"))
	}

	if config.DestinationType == GrafanaCloud {
		if config.Grafana.GrafanaCloudInstanceID == "" {
			error_list = append(error_list, errors.New("GRAFANA_CLOUD_INSTANCE_ID is missing"))
		}
		if config.Grafana.GrafanaCloudAPIKey == "" {
			error_list = append(error_list, errors.New("GRAFANA_CLOUD_API_KEY is missing"))
		}
	}
	return len(error_list) == 0, error_list
}
