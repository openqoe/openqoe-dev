package compute

import "time"

type Label struct {
	Name  string
	Value string
}

type Sample struct {
	Value     float64
	Timestamp time.Time
}
type TimeSeries struct {
	Labels  []Label
	Samples []Sample
}

type resolution struct {
	width  int64
	height int64
}
