package config

import (
	"encoding/json"
	"errors"
	"math"

	"github.com/rs/zerolog"
)

type Config struct {
	env                 *Env
	cardinality_config  *CardinalityConfig
	destination_manager *DestinationManager
	redis_client        *RedisConnection
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
func validateConfiguration(env *Env, destinationManager *DestinationManager, redisClient *RedisConnection, parentLogger zerolog.Logger) {
	var error_list []error
	if env.KV_STORE_URL == "" {
		error_list = append(error_list, errors.New("key value store url is missing"))
	}
	if redisClient.PingRedis() != nil {
		error_list = append(error_list, errors.New("failed to connect to redis"))
	}
	valid, dest_errors := destinationManager.validateConfiguration()
	if !valid {
		error_list = append(error_list, dest_errors...)
	}
	logger := parentLogger.With().Str("sub-component", "config").Logger()
	if len(error_list) > 0 {
		for _, err := range error_list {
			logger.Fatal().
				Err(err).
				Stack().
				Msg("Configuration validation error")
		}
		logger.Fatal().Msg("Configuration validation failed")
	}
	logger.Info().Msg("Configuration validation successful")
	logger.Info().Msg("Successfully connected to Redis")
}
func NewConfig(env *Env, parentLogger zerolog.Logger) *Config {
	cardinalityConfig := loadCardinalityConfig(env, parentLogger)
	destinationManager := NewDestinationManager(env, parentLogger)
	redisClient := NewRedisClient(env, env.CONTEXT, parentLogger)

	validateConfiguration(env, destinationManager, redisClient, parentLogger)
	return &Config{
		env:                 env,
		cardinality_config:  cardinalityConfig,
		destination_manager: destinationManager,
		redis_client:        redisClient,
	}
}

func (c *Config) GetCardinalityLimit(dimension string) CardinalityLimit {
	return c.cardinality_config.Limits[dimension]
}

func (c *Config) GetAllCardinalityLimits() map[string]CardinalityLimit {
	return c.cardinality_config.Limits
}

func (c *Config) GetOtelConfig() *OtelConfig {
	return c.destination_manager.GetDestinationConfig().Otel
}

func (c *Config) GetApiKey() string {
	return c.env.API_KEY
}

func (c *Config) IsAuthEnabled() bool {
	return c.env.API_KEY != ""
}
