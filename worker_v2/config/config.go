package config

import (
	"context"
	"encoding/json"
	"errors"
	"math"
	"strconv"

	"go.uber.org/zap"
)

type Config struct {
	env                 *Env
	cardinality_config  *CardinalityConfig
	destination_manager *DestinationManager
	redis_client        *RedisConnection
}

func loadCardinalityConfig(env *Env, parentLogger *zap.Logger) *CardinalityConfig {
	if env.CARDINALITY_LIMITS == "default_limits" {
		return &CardinalityConfig{
			Limits: map[string]CardinalityLimit{
				"org_id":     {Max_Cardinality: 1000, Action: Allow},
				"player_id":  {Max_Cardinality: 10000, Action: Allow},
				"env":        {Max_Cardinality: 10, Action: Allow},
				"app_name":   {Max_Cardinality: 100, Action: Allow},
				"event_type": {Max_Cardinality: 20, Action: Allow},

				// Bucket medium-cardinality dimensions
				"video_id":    {Max_Cardinality: 100000, Action: Allow},
				"video_title": {Max_Cardinality: 100000, Action: Allow},
				// Hash high-cardinality dimensions
				// max cardinality mimicks infinity
				"session_id": {Max_Cardinality: math.MaxInt64, Action: Hash},
				"view_id":    {Max_Cardinality: math.MaxInt64, Action: Hash},
				"viewer_id":  {Max_Cardinality: math.MaxInt64, Action: Hash},
				// Device/Browser - allow common values, hash others
				"device_category": {Max_Cardinality: 10, Action: Allow},
				"browser_family":  {Max_Cardinality: 20, Action: Allow},
				"os_family":       {Max_Cardinality: 20, Action: Allow},
				// Network - bucket by country/region
				"network_country": {Max_Cardinality: 250, Action: Allow},
				"network_region":  {Max_Cardinality: 1000, Action: Bucket, Bucket_Size: 100},

				// Drop very high cardinality
				"video_source_url": {Max_Cardinality: 0, Action: Drop},
			},
		}
	}
	jsonData := []byte(env.CARDINALITY_LIMITS)
	var cardinalityConfig CardinalityConfig
	err := json.Unmarshal(jsonData, &cardinalityConfig)
	if err != nil {
		logger := parentLogger.With(zap.String("sub-component", "config"))
		logger.Fatal("Failed to parse CARDINALITY_LIMITS", zap.Error(err))
	}
	return &cardinalityConfig
}
func validateConfiguration(env *Env, destinationManager *DestinationManager, redisClient *RedisConnection, parentLogger *zap.Logger) {
	var error_list []error
	if env.KV_STORE_URL == "" {
		error_list = append(error_list, errors.New("key value store url is missing"))
	}
	if redisClient.PingRedis() != nil {
		error_list = append(error_list, errors.New("failed to connect to redis"))
	}
	valid, dest_errors := destinationManager.ValidateConfiguration()
	if !valid {
		error_list = append(error_list, dest_errors...)
	}
	logger := parentLogger.With(zap.String("sub-component", "config"))
	if len(error_list) > 0 {
		for _, err := range error_list {
			logger.Fatal("Configuration validation error",
				zap.Error(err),
				zap.String("error", err.Error()))
		}
		logger.Fatal("Configuration validation failed")
	}
	logger.Info("Configuration validation successful")
	logger.Info("Successfully connected to Redis")
}
func NewConfig(ctx context.Context, env *Env, parentLogger *zap.Logger) *Config {
	cardinalityConfig := loadCardinalityConfig(env, parentLogger)
	destinationManager := NewDestinationManager(env, parentLogger)
	redisClient := NewRedisClient(ctx, env, parentLogger)

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

func (c *Config) GetConfigType() DestinationType {
	return c.destination_manager.GetDestinationType()
}

func (c *Config) GetOtelConfig() *OtelConfig {
	return c.destination_manager.GetDestinationConfig().Otel
}

func (c *Config) GetApiKey() string {
	return c.env.API_KEY
}

func (c *Config) IsAuthEnabled() bool {
	return c.env.API_KEY != "default_api_key"
}

func (c *Config) GetWorkerPoolSize() int {
	val, err := strconv.Atoi(c.env.WORKER_POOL_SIZE)
	if err != nil {
		return 10 // default value
	}
	return val
}
