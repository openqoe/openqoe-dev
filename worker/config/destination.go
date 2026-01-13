package config

import (
	"errors"

	"go.uber.org/zap"
)

type DestinationType string
type OtelConfig struct {
	Url string
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
	logger *zap.Logger
}

func NewDestinationManager(env *Env, parentLogger *zap.Logger) *DestinationManager {
	return &DestinationManager{env: env, logger: parentLogger.With((zap.String("sub-component", "DestinationManager")))}
}

func (dm *DestinationManager) GetDestinationConfig() *DestinationConfig {
	destinationType := dm.GetDestinationType()
	switch destinationType {
	case GrafanaCloud:
		return dm.getGrafanaConfig()
	case SelfHosted:
		return dm.getSelfHostedConfig()
	default:
		return nil
	}
}

func (dm *DestinationManager) GetDestinationType() DestinationType {
	if dm.env.GRAFANA_CLOUD_INSTANCE_ID != "" {
		return GrafanaCloud
	}
	return SelfHosted
}

func (dm *DestinationManager) getGrafanaConfig() *DestinationConfig {
	if dm.env.GRAFANA_CLOUD_INSTANCE_ID == "" || dm.env.GRAFANA_CLOUD_API_KEY == "" {
		dm.logger.Fatal("Grafana Cloud configuration incomplete",
			zap.String("required_fields", "GRAFANA_CLOUD_INSTANCE_ID, GRAFANA_CLOUD_API_KEY"),
		)
	}
	if dm.env.OTEL_URL == "" {
		dm.logger.Fatal("OTEL_URL is required for Metrics and Logs sending", zap.String("required_fields", dm.env.OTEL_URL))
	}
	return &DestinationConfig{
		DestinationType: GrafanaCloud,
		Otel: &OtelConfig{
			Url: dm.env.OTEL_URL,
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
		dm.logger.Fatal("OTEL_URL is required for Metrics and Logs sending", zap.String("required_fields", "OTEL_URL"))
	}
	return &DestinationConfig{
		DestinationType: SelfHosted,
		Otel: &OtelConfig{
			Url: dm.env.OTEL_URL,
		},
	}
}

func (dm *DestinationManager) ValidateConfiguration() (bool, []error) {
	var error_list []error
	config := dm.GetDestinationConfig()
	if config.Otel.Url == "" {
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
