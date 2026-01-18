package config

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	datastructure "openqoe.dev/worker/data_structure"
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

func (r *RedisConnection) Delete(key string) error {
	err := r.client.Del(r.ctx, key).Err()
	if err != nil {
		return err
	}
	return nil
}

func (r *RedisConnection) GetHashFields(key string, fields []string) (map[string]string, error) {
	res_map := make(map[string]string)
	for _, f := range fields {
		value, err := r.client.HGet(r.ctx, key, f).Result()
		if err == redis.Nil {
			res_map[f] = ""
		}
		if err != nil {
			return nil, err
		}
		res_map[f] = value
	}
	return res_map, nil
}

func (r *RedisConnection) SetOrUpdateHash(key string, value_with_ttl map[string]datastructure.Pair[string, time.Duration]) error {
	value := make(map[string]string, len(value_with_ttl))
	group_fields_by_ttl := make(map[time.Duration][]string)

	for field_name, pair := range value_with_ttl {
		value[field_name] = pair.First
		secondsOnly := (pair.Second / time.Second) * time.Second
		group_fields_by_ttl[secondsOnly] = append(group_fields_by_ttl[secondsOnly], field_name)
	}
	pipe := r.client.Pipeline()

	pipe.HSet(r.ctx, key, value)

	for ttl, fields := range group_fields_by_ttl {
		if ttl > 0 {
			pipe.HExpire(r.ctx, key, ttl, fields...)
		}
	}

	pipe.Expire(r.ctx, key, 24*time.Hour)

	_, err := pipe.Exec(r.ctx)
	return err
}

func (r *RedisConnection) DeleteHashField(key string, fields []string) error {
	err := r.client.HDel(r.ctx, key, fields...).Err()
	if err != nil {
		return err
	}
	return nil
}

func (r *RedisConnection) Close() error {
	return r.client.Close()
}
