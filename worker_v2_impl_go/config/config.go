package config

import (
	"encoding/json"
	"errors"
	"log"
	"math"

	"github.com/rs/zerolog"
)

type Config struct {
	env                *Env
	cardinalityConfig  *CardinalityConfig
	destinationManager *DestinationManager
}

func loadCardinalityConfig(env *Env, parentLogger zerolog.Logger) *CardinalityConfig {
	if env.CARDINALITY_LIMITS == "" {
		return &CardinalityConfig{
			Limits: map[string]CardinalityLimit{
				"org_id": {
					Max_Cardinality: 1000,
					Action:          "allow",
				},
				"player_id":  {Max_Cardinality: 10000, Action: "allow"},
				"env":        {Max_Cardinality: 10, Action: "allow"},
				"app_name":   {Max_Cardinality: 100, Action: "allow"},
				"event_type": {Max_Cardinality: 20, Action: "allow"},

				// Bucket medium-cardinality dimensions
				"video_id":    {Max_Cardinality: 100000, Action: "bucket", Bucket_Size: 10000},
				"video_title": {Max_Cardinality: 100000, Action: "bucket", Bucket_Size: 10000},
				// Hash high-cardinality dimensions
				"session_id": {Max_Cardinality: math.Inf(1), Action: "hash"},
				"view_id":    {Max_Cardinality: math.Inf(1), Action: "hash"},
				"viewer_id":  {Max_Cardinality: math.Inf(1), Action: "hash"},
				// Device/Browser - allow common values, hash others
				"device_category": {Max_Cardinality: 10, Action: "allow"},
				"browser_family":  {Max_Cardinality: 20, Action: "allow"},
				"os_family":       {Max_Cardinality: 20, Action: "allow"},
				// Network - bucket by country/region
				"network_country": {Max_Cardinality: 250, Action: "allow"},
				"network_region":  {Max_Cardinality: 1000, Action: "bucket", Bucket_Size: 100},

				// Drop very high cardinality
				"video_source_url": {Max_Cardinality: 0, Action: "drop"},
			},
		}
	}
	jsonData := []byte(env.CARDINALITY_LIMITS)
	var cardinalityConfig CardinalityConfig
	err := json.Unmarshal(jsonData, &cardinalityConfig)
	if err != nil {
		logger := parentLogger.With().Str("sub-component", "config").Logger()
		logger.Fatal().
			Err(err).
			Str("sub-component", "config").
			Msg("Failed to parse CARDINALITY_LIMITS")
	}
	return &cardinalityConfig
}
func validateConfiguration(env *Env, destinationManager *DestinationManager, parentLogger zerolog.Logger) {
	var error_list []error
	logger := parentLogger.With().Str("sub-component", "config").Logger()
	if env.KV_STORE_URL == "" {
		error_list = append(error_list, errors.New("key value store url is missing"))
	}
	valid, dest_errors := destinationManager.validateConfiguration()
	if !valid {
		error_list = append(error_list, dest_errors...)
	}
	if len(error_list) > 0 {
		for _, err := range error_list {
			logger.Error().
				Err(err).
				Str("sub-component", "config").
				Msg("Configuration validation error")
		}
		log.Fatal("Configuration validation failed")
	}
	logger.Info().Msg("Configuration validation successful")
}
func NewConfig(env *Env, parentLogger zerolog.Logger) *Config {
	config := &Config{
		env:                env,
		cardinalityConfig:  loadCardinalityConfig(env, parentLogger),
		destinationManager: NewDestinationManager(env, parentLogger),
	}
	validateConfiguration(config.env, config.destinationManager, parentLogger)
	return config
}

func (c *Config) GetCardinalityLimit(dimension string) CardinalityLimit {
	return c.cardinalityConfig.Limits[dimension]
}

func (c *Config) GetAllCardinalityLimits() map[string]CardinalityLimit {
	return c.cardinalityConfig.Limits
}

func (c *Config) GetOtelConfig() *OtelConfig {
	return c.destinationManager.GetDestinationConfig().Otel
}

func (c *Config) GetApiKey() string {
	return c.env.API_KEY
}

func (c *Config) IsAuthEnabled() bool {
	return c.env.API_KEY != ""
}
