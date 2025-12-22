package otel_service

import (
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

func GetTracer(name string) trace.Tracer {
	return otel.Tracer(name)
}

func DetachContext(ctx context.Context) context.Context {
	return trace.ContextWithSpan(context.Background(), trace.SpanFromContext(ctx))
}
