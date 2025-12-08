package config

import (
	"context"

	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
)

type RedisConnection struct {
	client *redis.Client
	ctx    context.Context
}

func NewRedisClient(env *Env, ctx context.Context, parentLogger zerolog.Logger) *RedisConnection {
	logger := parentLogger.With().Str("sub-component", "redis_client").Logger()
	// URL: redis://<user>:<pass>@localhost:6379/<db>
	opt, err := redis.ParseURL(env.KV_STORE_URL)
	if err != nil {
		logger.Fatal().
			Err(err).
			Str("sub-component", "redis_client").
			Msg("Failed to parse KV_STORE_URL")
	}
	rdb := redis.NewClient(opt)
	logger.Info().Msg("Redis client initialized")
	return &RedisConnection{
		client: rdb,
		ctx:    ctx,
	}
}

func (r *RedisConnection) PingRedis() error {
	_, err := r.client.Ping(r.ctx).Result()
	return err
}

func (r *RedisConnection) GetValue(key string) (string, error) {
	val, err := r.client.Get(r.ctx, key).Result()
	if err != nil {
		return "", err
	}
	return val, nil
}

func (r *RedisConnection) SetValue(key string, value string) error {
	err := r.client.Set(r.ctx, key, value, 0).Err()
	if err != nil {
		return err
	}
	return nil
}
