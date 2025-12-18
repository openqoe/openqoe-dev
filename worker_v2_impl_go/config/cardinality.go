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

type CardinalityStat struct {
	count  int
	values []string
}

type CardinalityConfig struct {
	Limits map[string]CardinalityLimit
}

type CardinalityService struct {
	env    *Env
	config *Config
	logger zerolog.Logger
}

func NewCardinalityService(env *Env, config *Config, parent_logger zerolog.Logger) *CardinalityService {
	logger := parent_logger.With().Str("sub-component", "cardinality_service").Logger()
	return &CardinalityService{
		env:    env,
		config: config,
		logger: logger,
	}
}

func (cs *CardinalityService) applyGovernance(dimension string, value string) string {
	limit := cs.config.GetCardinalityLimit(dimension)
	res_chan := make(chan string, 1)
	switch limit.Action {
	case Allow:
		go cs.handleAllow(dimension, value, limit.Max_Cardinality, res_chan)
	case Bucket:
		go cs.handleBucket(value, limit.Bucket_Size, res_chan)
	case Hash:
		go cs.handleHash(value, res_chan)
	case Drop:
		go func() {
			defer close(res_chan)
			res_chan <- ""
		}()
	default:
		go func() {
			defer close(res_chan)
			res_chan <- value
		}()
	}
	return <-res_chan
}

// Handle 'allow' action - track cardinality and allow if under limit
func (cs *CardinalityService) handleAllow(dimension string, value string, max_cardinality float64, res_chan chan<- string) {
	defer close(res_chan)
	const key = "cardinality:" // Redis key prefix
	// Get current cardinality set from K
	existing_json, err := cs.config.redis_client.GetValue(key)
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to get existing cardinality data")
	}

	existing_set := datastructure.NewSet[string]()
	if existing_json != "" {
		var items []string
		if err := json.Unmarshal([]byte(existing_json), &items); err != nil {
			cs.logger.Error().Err(err).Msg("Failed to unmarshal existing cardinality data")
		} else {
			existing_set = datastructure.NewSet(items...)
		}
	}
	// Check if value already exists
	if existing_set.Contains(value) {
		res_chan <- value
		return
	}

	// Check if adding this value would exceed limit
	if existing_set.Size() >= int(max_cardinality) {
		cs.logger.Warn().Str("dimension", dimension).Int("limit", existing_set.Size()/int(max_cardinality)).Msg("cardinality limit reached")
		res_chan <- cs.handleHashString(value)
		return
	}

	// Add to set and save back to KV
	existing_set.Add(value)
	items := existing_set.Items()
	json_data, err := json.Marshal(items)
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to marshal cardinality data")
		return
	}
	err = cs.config.redis_client.SetValueWithTTL(key, string(json_data), 86400*time.Second)
	if err != nil {
		cs.logger.Error().Err(err).Msg("Failed to set cardinality data with TTL")
	}
	res_chan <- value
}

func (cs *CardinalityService) handleBucket(value string, bucket_size int, res_chan chan<- string) {
	defer close(res_chan)
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
	defer close(res_chan)
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

func (cs *CardinalityService) applyGovernanceToLabels(labels map[string]string) map[string]string {
	governed := make(map[string]string)
	for key, value := range labels {
		governed_value := cs.applyGovernance(key, value)
		if governed_value != "" {
			governed[key] = governed_value
		}
	}
	return governed
}

func (cs *CardinalityService) getCardinalityStats(dimension string, res_chan chan<- CardinalityStat) {
	defer close(res_chan)
	const key = "cardinality:"
	existing_json, err := cs.config.redis_client.GetValue(key)
	if err != nil || existing_json == "" {
		cs.logger.Error().Err(err).Msg("Failed to get existing cardinality data")
		res_chan <- CardinalityStat{count: 0, values: []string{}}
		return
	}
	var values []string
	if err := json.Unmarshal([]byte(existing_json), &values); err != nil {
		cs.logger.Error().Err(err).Str("dimension", dimension).Msg("Error getting cardinality stats")
		res_chan <- CardinalityStat{count: 0, values: []string{}}
		return
	}
	res_chan <- CardinalityStat{count: len(values), values: values}
}

func (cs *CardinalityService) resetCardinality(dimension string, res_chan chan<- bool) {
	defer close(res_chan)
	const key = "cardinality:"
	err := cs.config.redis_client.DeleteValue(key)
	if err != nil {
		cs.logger.Error().Err(err).Str("dimension", dimension).Msg("Error resetting cardinality")
		res_chan <- false
		return
	}
	res_chan <- true
}
