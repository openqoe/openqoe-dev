package compute

import (
	"context"
	"runtime"

	"go.opentelemetry.io/otel/metric"
	"go.uber.org/zap"
	"openqoe.dev/worker_v2/otelservice"
)

func MeasureSystemMetrics(otel_service *otelservice.OpenTelemetryService) {
	meter := otel_service.Meter
	logger := otel_service.Logger.WithLazy(zap.String("sub-component", "system-metrics"))
	heapAllocation, _ := meter.Float64ObservableGauge("worker.heap_allocation", metric.WithDescription("Total Allocated Heap Objects"), metric.WithUnit("byte"))
	stackInUse, _ := meter.Float64ObservableGauge("worker.stack_in_use", metric.WithDescription("Stack Memory in Use of Worker"), metric.WithUnit("byte"))
	goRoutineCount, _ := meter.Int64ObservableGauge("worker.goroutine_count", metric.WithDescription("Number of Goroutines Running"))
	gcCount, _ := meter.Int64ObservableGauge("worker.gc_cycle_count", metric.WithDescription("Number of Garbage Collection Cycles"))
	gcStopWorldPause, _ := meter.Float64ObservableGauge("worker.gc_all_stop_pause_time", metric.WithDescription("Pause Time of Garbage Collection Cycles"), metric.WithUnit("ns"))

	_, err := meter.RegisterCallback(
		func(ctx context.Context, o metric.Observer) error {
			var m runtime.MemStats
			num_gc := m.NumGC
			runtime.ReadMemStats(&m)
			o.ObserveFloat64(heapAllocation, float64(m.HeapAlloc))
			o.ObserveFloat64(stackInUse, float64(m.StackInuse))
			o.ObserveInt64(goRoutineCount, int64(runtime.NumGoroutine()))
			o.ObserveInt64(gcCount, int64(num_gc))
			o.ObserveFloat64(gcStopWorldPause, float64(m.PauseNs[(num_gc+255)%256]))

			return nil
		},
		heapAllocation, stackInUse, goRoutineCount, gcCount, gcStopWorldPause,
	)
	if err != nil {
		logger.Error("failed to register metrics callback", zap.Error(err))
	}
}
