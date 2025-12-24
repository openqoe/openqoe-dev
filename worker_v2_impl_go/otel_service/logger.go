package otel_service

import (
	"os"

	"go.opentelemetry.io/otel/sdk/log"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"go.opentelemetry.io/contrib/bridges/otelzap"
)

func NewOtelHookeedWorkerLogger() *zap.Logger {
	// Use a working LoggerProvider implementation instead e.g. use go.opentelemetry.io/otel/sdk/log.
	provider := log.NewLoggerProvider()

	logger_config := zap.NewProductionEncoderConfig()
	logger_config.EncodeTime = zapcore.RFC3339TimeEncoder
	logger_config.EncodeLevel = zapcore.CapitalLevelEncoder

	// If you want to log also on stdout, you can initialize a new zap.Core
	// that has multiple outputs using the method zap.NewTee(). With the following code,
	// logs will be written to stdout and also exported to the OTEL endpoint through the bridge.
	core := zapcore.NewTee(
		zapcore.NewCore(zapcore.NewJSONEncoder(logger_config), zapcore.AddSync(os.Stdout), zapcore.DebugLevel),
		otelzap.NewCore("openqoe.dev/worker_v2", otelzap.WithLoggerProvider(provider)),
	)
	logger := zap.New(core)
	return logger
}
