package config

import (
	"github.com/rs/zerolog"
)

type Action string

const (
	Allow  Action = "allow"
	Bucket Action = "bucket"
	Hash   Action = "hash"
	Drop   Action = "drop"
)

type CardinalityLimit struct {
	Max_Cardinality float64 `json:"max_cardinality"`
	Action          Action  `json:"action"`
	Bucket_Size     int     `json:"bucket_size"`
}

type CardinalityConfig struct {
	Limits map[string]CardinalityLimit
}

type CardinalityService struct {
	config Config
	env    Env
	logger zerolog.Logger
}

func NewCardinalityService(config Config, env Env, parentLogger zerolog.Logger) *CardinalityService {
	logger := parentLogger.With().Str("sub-component", "cardinality_service").Logger()
	return &CardinalityService{
		config: config,
		env:    env,
		logger: logger,
	}
}

func (cs *CardinalityService) applyGovernance(dimension string, value string, res_chan chan<- string) {
	limit := cs.config.GetCardinalityLimit(dimension)
	switch limit.Action {
	case Allow:
		go cs.handleAllow(dimension, value, limit.Max_Cardinality, res_chan)
	case Bucket:
		// Implement bucketing logic here
		return "bucketed_value", nil
	case Hash:
		// Implement hashing logic here
		return "hashed_value", nil
	case Drop:
		return "", nil
	default:
		return "", nil
	}
}

func (cs *CardinalityService) handleAllow(dimension string, value string, max_cardinality float64, res_chan chan<- string) {
	const key = "cardinality:" // Redis key prefix

	// Increment the cardinality count for the given dimension and value
	count, err := cs.env.RedisClient.HIncrBy(cs.env.Ctx, key+dimension, value, 1).Result()
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to increment cardinality count")
		res_chan <- ""
		return
	}
}
