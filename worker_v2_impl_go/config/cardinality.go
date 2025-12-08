package config

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
