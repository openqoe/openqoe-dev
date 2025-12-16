package config

import (
	"encoding/json"
	"fmt"
	"hash/crc32"
	"math"
	"strconv"
	"time"

	"github.com/rs/zerolog"
	datastructure "openqoe.dev/worker_v2/data_structure"
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
		go cs.handleBucket(dimension, value, limit.Bucket_Size, res_chan)
	case Hash:
		go cs.handleHash(value, res_chan)
	case Drop:
		res_chan <- ""
	default:
		res_chan <- value
	}
}

// Handle 'allow' action - track cardinality and allow if under limit
func (cs *CardinalityService) handleAllow(dimension string, value string, max_cardinality float64, res_chan chan<- string) {
	const key = "cardinality:" // Redis key prefix
	// Get current cardinality set from K
	existingJson, err := cs.config.redisClient.GetValue(key)
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to get existing cardinality data")
	}

	existingSet := datastructure.NewSet[string]()
	if existingJson != "" {
		var items []string
		if err := json.Unmarshal([]byte(existingJson), &items); err != nil {
			cs.logger.Error().Err(err).Msg("Failed to unmarshal existing cardinality data")
		} else {
			existingSet = datastructure.NewSet(items...)
		}
	}
	// Check if value already exists
	if existingSet.Contains(value) {
		res_chan <- value
		return
	}

	// Check if adding this value would exceed limit
	if existingSet.Size() >= int(max_cardinality) {
		cs.logger.Warn().Str("dimension", dimension).Int("limit", existingSet.Size()/int(max_cardinality)).Msg("cardinality limit reached")
		res_chan <- cs.handleHashString(value)
		return
	}

	// Add to set and save back to KV
	existingSet.Add(value)
	items := existingSet.Items()
	jsonData, err := json.Marshal(items)
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to marshal cardinality data")
		return
	}
	err = cs.config.redisClient.SetValueWithTTL(key, string(jsonData), 86400*time.Second)
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to set cardinality data with TTL")
	}
	res_chan <- value
	return
}

func (cs *CardinalityService) handleBucket(dimension string, value string, bucket_size int, res_chan chan<- string) {
	num_value, err := strconv.ParseFloat(value, 64)

	if err != nil {
		res_chan <- cs.handleHashBucket(value, bucket_size)
	}

	bucket_index := math.Floor(num_value / float64(bucket_size))
	bucket_start := bucket_index * float64(bucket_size)
	bucket_end := bucket_start + float64(bucket_size)
	res_chan <- fmt.Sprintf("%d-%d", int(bucket_start), int(bucket_end))

}
func (cs *CardinalityService) handleHash(value string, res_chan chan<- string) {
	res_chan <- cs.handleHashString(value)
}

func (cs *CardinalityService) handleHashString(value string) string {
	hash := crc32.ChecksumIEEE([]byte(value))
	return fmt.Sprintf("%08x", hash)
}

func (cs *CardinalityService) handleHashBucket(value string, bucket_size int) string {
	hash := cs.handleHashNumber(value)
	bucket := int(hash) % bucket_size
	return fmt.Sprintf("bucket_%d", bucket)
}

func (cs *CardinalityService) handleHashNumber(value string) uint32 {
	return crc32.ChecksumIEEE([]byte(value))
}
