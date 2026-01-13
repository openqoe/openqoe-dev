package otelservice

import (
	"context"

	"go.opentelemetry.io/otel/trace"
)

func DetachContext(ctx context.Context) context.Context {
	return trace.ContextWithSpan(context.Background(), trace.SpanFromContext(ctx))
}
