package config

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type RedisConnection struct {
	client *redis.Client
	ctx    context.Context
}

func NewRedisClient(ctx context.Context, env *Env, parentLogger *zap.Logger) *RedisConnection {
	logger := parentLogger.With(zap.String("sub-component", "redis_client"))
	// URL: redis://<user>:<pass>@localhost:6379/<db>
	opt, err := redis.ParseURL(env.KV_STORE_URL)
	if err != nil {
		logger.Fatal("Failed to parse KV_STORE_URL", zap.Error(err))
	}
	rdb := redis.NewClient(opt)
	logger.Info("Redis client initialized")
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

func (r *RedisConnection) SetValueWithTTL(key string, value string, ttl time.Duration) error {
	err := r.client.Set(r.ctx, key, value, ttl).Err()
	if err != nil {
		return err
	}
	return nil
}

func (r *RedisConnection) DeleteValue(key string) error {
	err := r.client.Del(r.ctx, key).Err()
	if err != nil {
		return err
	}
	return nil
}

func (r *RedisConnection) Close() error {
	return r.client.Close()
}
