# openqoe-core Architecture

**Version:** 2.0.0
**Last Updated:** January 2026

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Deployment Architecture](#deployment-architecture)
5. [Security Architecture](#security-architecture)
6. [Scalability & Performance](#scalability--performance)

---

## System Architecture Overview

### High-Level Architecture

```mermaid
graph TB
    subgraph "Your Application"
        VP[Video Player<br/>Dash.js - Ready]
        SDK[openqoe-core SDK]
        VP -->|events| SDK
    end

    subgraph "Worker Environment"
        WORKER[Go Worker<br/>Auth, Validate, Forward]
    end

    subgraph "Observability Pipeline"
        ALLOY[Grafana Alloy<br/>Collector & Processor]
        LOKI[Grafana Loki]
        MIMIR[Grafana Mimir]
        TEMPO[Grafana Tempo]
    end

    subgraph "Visualization"
        GRAF[Grafana]
    end

    SDK -->|HTTPS /v2/events| WORKER
    WORKER -->|OTLP| ALLOY
    ALLOY -->|Logs| LOKI
    ALLOY -->|Metrics| MIMIR
    ALLOY -->|Traces| TEMPO

    LOKI --> GRAF
    MIMIR --> GRAF
    TEMPO --> GRAF

    GRAF -->|Alerts| ALERT[Alert Channels]
```

---

## Component Architecture

### 1. SDK Architecture

```mermaid
graph TB
    subgraph "openqoe-core SDK"
        subgraph "Public API"
            INIT[OpenQoE Class]
            CONFIG[Configuration]
        end

        subgraph "Player Adapters"
            HTML5[HTML5Adapter]
            VIDEOJS[VideoJsAdapter]
            HLSJS[HlsJsAdapter]
            DASHJS[DashJsAdapter]
            SHAKA[ShakaAdapter]
        end

        subgraph "Core Modules"
            COLLECTOR[Event Collector]
            SESSION[Session Manager]
            PRIVACY[Privacy Module<br/>Hashing]
            BATCH[Batch Manager]
            QUEUE[Offline Queue]
            RETRY[Retry Logic<br/>Exp. Backoff]
            CMCD[CMCD Processor]
        end

        subgraph "Transport"
            HTTP[HTTP Client<br/>Fetch/XHR]
        end
    end

    INIT --> CONFIG
    CONFIG --> HTML5
    CONFIG --> VIDEOJS
    CONFIG --> HLSJS
    CONFIG --> DASHJS
    CONFIG --> SHAKA

    HTML5 --> COLLECTOR
    VIDEOJS --> COLLECTOR
    HLSJS --> COLLECTOR
    DASHJS --> COLLECTOR
    SHAKA --> COLLECTOR

    COLLECTOR --> SESSION
    COLLECTOR --> PRIVACY
    COLLECTOR --> CMCD
    SESSION --> BATCH
    PRIVACY --> BATCH
    CMCD --> BATCH

    BATCH --> QUEUE
    QUEUE --> RETRY
    RETRY --> HTTP

    HTTP -->|Success| QUEUE
    HTTP -->|Failure| RETRY
```

### 2. SDK Module Responsibilities

| Module | Responsibility | Interface |
|--------|----------------|-----------|
| **OpenQoE Class** | Public API, initialization, lifecycle | `new OpenQoE(config)`, `attachPlayer()`, `destroy()` |
| **Configuration** | Validate config, store settings | `OpenQoEConfig` interface |
| **Player Adapters** | Translate player-specific events to standard events | `PlayerAdapter` interface |
| **Event Collector** | Receive events, enrich with context | `trackEvent(type, data)` |
| **Session Manager** | Generate IDs, track session state | `startSession()`, `endSession()`, `getSessionId()` |
| **Privacy Module** | Hash PII fields, apply privacy policies | `hash(value)`, `sanitize(event)` |
| **CMCD Processor** | Extract, normalize, de-duplicate CMCD | `extractCMCD(player)`, `normalizeCMCD(data)` |
| **Batch Manager** | Accumulate events, trigger flushes | `addEvent(event)`, `flush()` |
| **Offline Queue** | Store events when offline, persist to storage | `enqueue(event)`, `dequeue()`, `persist()` |
| **Retry Logic** | Exponential backoff, circuit breaker | `send(batch)`, `retry(batch, attempt)` |
| **HTTP Client** | Send batches to ingest endpoint | `post(url, data)` |

### 3. PlayerAdapter Interface

```mermaid
classDiagram
    class PlayerAdapter {
        <<interface>>
        +attach(player: any, metadata: VideoMetadata) void
        +detach() void
        +onPlayerReady() void
        +onViewStart() void
        +onPlaying() void
        +onPause() void
        +onSeek() void
        +onStallStart() void
        +onStallEnd() void
        +onQualityChange() void
        +onEnded() void
        +onError(error: PlayerError) void
        +getCurrentTime() number
        +getDuration() number
        +getBitrate() number
        +getVideoResolution() Resolution
        +getPlayerState() PlayerState
        +getCMCDData() CMCDSnapshot
    }

    class HTML5Adapter {
        -video: HTMLVideoElement
        -eventListeners: Map
        +attach(player, metadata) void
        +onPlayerReady() void
        ...
    }

    class VideoJsAdapter {
        -player: videojs.Player
        -eventListeners: Map
        +attach(player, metadata) void
        +onPlayerReady() void
        ...
    }

    class HlsJsAdapter {
        -player: Hls
        -video: HTMLVideoElement
        -eventListeners: Map
        +attach(player, metadata) void
        +getCMCDData() CMCDSnapshot
        ...
    }

    class DashJsAdapter {
        -player: dashjs.MediaPlayerClass
        -eventListeners: Map
        +attach(player, metadata) void
        +getCMCDData() CMCDSnapshot
        ...
    }

    class ShakaAdapter {
        -player: shaka.Player
        -video: HTMLVideoElement
        -eventListeners: Map
        +attach(player, metadata) void
        +getCMCDData() CMCDSnapshot
        ...
    }

    PlayerAdapter <|.. HTML5Adapter
    PlayerAdapter <|.. VideoJsAdapter
    PlayerAdapter <|.. HlsJsAdapter
    PlayerAdapter <|.. DashJsAdapter
    PlayerAdapter <|.. ShakaAdapter
```

---

### 4. Go Worker Architecture

```mermaid
graph TB
    subgraph "Worker Request Flow"
        REQUEST[Incoming Request /v2/events]
        GIN[Gin Gonic Web Framework]
        AUTH[Authentication Middleware]
        VALIDATE[Request Validator]
        CHAN[Event Channel / Queue]
        POOL[Worker Pool]
        OTEL[OTLP Exporter]
        RESPONSE[Response 202 Accepted]
    end

    REQUEST --> GIN
    GIN --> AUTH
    AUTH --> VALIDATE
    VALIDATE --> RESPONSE
    VALIDATE --> CHAN
    CHAN --> POOL
    POOL --> OTEL
```

### 5. Worker Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| **Gin Framework** | HTTP routing, middleware management, health checks |
| **Auth Middleware** | API key verification and Org ID resolution |
| **Request Validator** | Schema validation using Go Struct tags |
| **Worker Pool** | Concurrent processing of events from the queue |
| **Cardinality Service** | Governance of dimension values to prevent explosion |
| **OTLP Exporter** | Exporting metrics, logs, and traces to Alloy |

---

### 1. Event Lifecycle

```mermaid
sequenceDiagram
    participant Player as Video Player
    participant Adapter as PlayerAdapter
    participant Collector as Event Collector
    participant SDK as SDK Transport
    participant Worker as Go Worker
    participant Alloy as Grafana Alloy
    participant Backends as Mimir/Loki/Tempo

    Player->>Adapter: play event
    Adapter->>Collector: onPlaying()
    Collector->>Collector: Enrich with context
    Collector->>SDK: track(event)
    SDK->>Worker: POST /v2/events
    Worker->>Worker: Auth & Validate
    Worker-->>SDK: 202 Accepted
    Worker->>Worker: Add to internal queue
    Worker->>Alloy: OTLP Push
    Alloy->>Alloy: Batch & Process
    Alloy->>Backends: Export (Mimir/Loki/Tempo)
```

### 2. Error Handling Flow

```mermaid
sequenceDiagram
    participant SDK as SDK
    participant Worker as Go Worker
    participant Alloy as Grafana Alloy

    SDK->>Worker: POST /v2/events
    alt Success
        Worker-->>SDK: 202 Accepted
    else Auth Failure
        Worker-->>SDK: 401 Unauthorized
    else Validation Error
        Worker-->>SDK: 400 Bad Request
    else Rate Limit
        Worker-->>SDK: 429 Too Many Requests
    end

    alt Downstream Error
        Worker->>Alloy: Push OTLP
        Alloy--XWorker: Connection Refused
        Worker->>Worker: Retry with Backoff
    end
```

### 3. CMCD Extraction Flow

```mermaid
graph TB
    subgraph "Player-Specific Extraction"
        HLSJS[HLS.js<br/>Extract from<br/>frag.url or headers]
        DASHJS[dash.js<br/>Extract from<br/>request.cmcd]
        SHAKA[Shaka Player<br/>Extract from<br/>request.headers]
    end

    subgraph "CMCD Processor"
        PARSE[Parse CMCD string]
        NORMALIZE[Normalize keys/values]
        DEDUPE[De-duplicate per segment]
        VALIDATE[Validate against schema]
    end

    subgraph "Event Data"
        EVENT[Event with CMCD snapshot]
    end

    HLSJS --> PARSE
    DASHJS --> PARSE
    SHAKA --> PARSE

    PARSE --> NORMALIZE
    NORMALIZE --> DEDUPE
    DEDUPE --> VALIDATE
    VALIDATE --> EVENT
```

---

## Deployment Architecture

### 1. Multi-Environment Setup

```mermaid
graph TB
    subgraph "Development"
        SDK_DEV[SDK Dev Build]
        WORKER_DEV[Worker Dev]
        LOKI_DEV[Loki Dev]
        PROM_DEV[Prom Dev]
        GRAF_DEV[Grafana Dev]

        SDK_DEV --> WORKER_DEV
        WORKER_DEV --> LOKI_DEV
        WORKER_DEV --> PROM_DEV
        LOKI_DEV --> GRAF_DEV
        PROM_DEV --> GRAF_DEV
    end

    subgraph "Staging"
        SDK_STAGE[SDK Staging Build]
        WORKER_STAGE[Worker Staging]
        LOKI_STAGE[Loki Staging]
        PROM_STAGE[Prom Staging]
        GRAF_STAGE[Grafana Staging]

        SDK_STAGE --> WORKER_STAGE
        WORKER_STAGE --> LOKI_STAGE
        WORKER_STAGE --> PROM_STAGE
        LOKI_STAGE --> GRAF_STAGE
        PROM_STAGE --> GRAF_STAGE
    end

    subgraph "Production"
        SDK_PROD[SDK Prod Build<br/>npm registry]
        WORKER_PROD[Worker Prod<br/>Go / Container]

        subgraph "Option 1: Grafana Cloud"
            LOKI_CLOUD[Grafana Cloud Loki]
            PROM_CLOUD[Grafana Cloud Prometheus]
            GRAF_CLOUD[Grafana Cloud]
        end

        subgraph "Option 2: Self-Hosted"
            LOKI_SELF[Loki Cluster]
            PROM_SELF[Prometheus Cluster]
            GRAF_SELF[Grafana Cluster]
        end

        SDK_PROD --> WORKER_PROD
        WORKER_PROD --> LOKI_CLOUD
        WORKER_PROD --> PROM_CLOUD
        WORKER_PROD -.-> LOKI_SELF
        WORKER_PROD -.-> PROM_SELF

        LOKI_CLOUD --> GRAF_CLOUD
        PROM_CLOUD --> GRAF_CLOUD
        LOKI_SELF -.-> GRAF_SELF
        PROM_SELF -.-> GRAF_SELF
    end
```

### 2. Geographic Distribution (Cloudflare Edge)

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Global Network                 │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Americas   │  │    Europe    │  │  Asia-Pacific│      │
│  │              │  │              │  │              │      │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │      │
│  │ │  Worker  │ │  │ │  Worker  │ │  │ │  Worker  │ │      │
│  │ │  (Edge)  │ │  │ │  (Edge)  │ │  │ │  (Edge)  │ │      │
│  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │      │
│  │              │  │              │  │              │      │
│  │ 100+ POPs    │  │ 100+ POPs    │  │ 100+ POPs    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Backend (Centralized) │
                  │  - Loki               │
                  │  - Prometheus         │
                  │  - Grafana            │
                  └──────────────────────┘
```

**Benefits:**
- Low latency (<100ms) from any location
- High availability (auto-failover)
- DDoS protection
- Edge caching/routing

---

## Security Architecture

### 1. Security Layers

```mermaid
graph TB
    subgraph "Browser Security"
        CSP[Content Security Policy]
        CORS[CORS Headers]
        TLS_CLIENT[TLS 1.2+ Client]
        NO_SECRETS[No Secrets in Browser]
    end

    subgraph "Transport Security"
        HTTPS[HTTPS Only]
        TLS[TLS 1.2+]
        HSTS[HSTS Headers]
    end

    subgraph "Worker Security"
        AUTH[Token Authentication]
        SCHEMA[Schema Validation]
        RATE_LIMIT[Rate Limiting]
        PII_CONTROL[PII Controls]
        SECRETS_MGR[Secrets Manager<br/>Environment Variables]
    end

    subgraph "Backend Security"
        RBAC[Role-Based Access Control]
        AUDIT[Audit Logs]
        ENCRYPTION[Encryption at Rest]
    end

    CSP --> HTTPS
    CORS --> HTTPS
    TLS_CLIENT --> TLS
    NO_SECRETS --> TLS

    TLS --> AUTH
    HTTPS --> AUTH
    HSTS --> AUTH

    AUTH --> SCHEMA
    SCHEMA --> RATE_LIMIT
    RATE_LIMIT --> PII_CONTROL
    PII_CONTROL --> SECRETS_MGR

    SECRETS_MGR --> RBAC
    RBAC --> AUDIT
    AUDIT --> ENCRYPTION
```

### 2. Authentication Flow

```mermaid
sequenceDiagram
    participant SDK as SDK (Browser)
    participant Worker as Go Worker
    participant KV as KV Store
    participant Backend as Backend

    Note over SDK: No secrets in SDK<br/>Token injected server-side

    SDK->>Worker: POST /v1/events<br/>Header: X-API-Token
    Worker->>Worker: Extract token from header
    Worker->>KV: Lookup token
    KV-->>Worker: {valid: true, org_id: "org_123"}

    alt Token Valid
        Worker->>Worker: Attach org_id to events
        Worker->>Backend: Forward events
        Backend-->>Worker: 200 OK
        Worker-->>SDK: 200 OK
    else Token Invalid
        Worker-->>SDK: 401 Unauthorized
    else Token Expired
        Worker-->>SDK: 401 Token Expired
    end
```

### 3. Privacy Architecture

```mermaid
graph TB
    subgraph "Client-Side Privacy"
        HASH_CLIENT[Hash viewer_id<br/>SHA-256 + org salt]
        NO_PII[No raw PII collected]
    end

    subgraph "Worker-Side Privacy"
        HASH_VERIFY[Verify hashes]
        PII_ALLOWLIST[PII allowlist check]
        REDACT[Redaction engine]
        SANITIZE[Sanitize URLs, etc.]
    end

    subgraph "Storage Privacy"
        HASHED_ONLY[Only hashed IDs stored]
        NO_RAW_IDS[No raw IDs in logs/metrics]
        RETENTION[Retention policies]
    end

    HASH_CLIENT --> HASH_VERIFY
    NO_PII --> PII_ALLOWLIST

    HASH_VERIFY --> HASHED_ONLY
    PII_ALLOWLIST --> HASHED_ONLY
    REDACT --> NO_RAW_IDS
    SANITIZE --> NO_RAW_IDS

    HASHED_ONLY --> RETENTION
    NO_RAW_IDS --> RETENTION
```

---

## Scalability & Performance

### 1. Scalability Tiers

```
┌────────────────────────────────────────────────────────────┐
│                       Tier S (Small)                        │
│  - Sustained: 5,000 events/s                               │
│  - Burst: 10,000 events/s                                  │
│  - Estimated viewers: ~500 concurrent                      │
│  - Use case: Small to medium sites                         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                       Tier M (Medium)                       │
│  - Sustained: 25,000 events/s                              │
│  - Burst: 50,000 events/s                                  │
│  - Estimated viewers: ~2,500 concurrent                    │
│  - Use case: Medium to large sites                         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                       Tier L (Large)                        │
│  - Sustained: 100,000 events/s                             │
│  - Burst: 200,000 events/s                                 │
│  - Estimated viewers: ~10,000 concurrent                   │
│  - Use case: Large platforms, streaming services           │
└────────────────────────────────────────────────────────────┘
```

### 2. Performance Optimizations

#### SDK Optimizations

```mermaid
graph LR
    subgraph "Bundle Size"
        TREE_SHAKE[Tree Shaking]
        CODE_SPLIT[Code Splitting<br/>Per Adapter]
        MINIFY[Minification]
        GZIP[Gzip Compression]
    end

    subgraph "Runtime Performance"
        DEBOUNCE[Event Debouncing]
        BATCH[Batching]
        ASYNC[Async Processing]
        WEB_WORKER[Web Worker<br/>Optional]
    end

    subgraph "Network Optimization"
        COMPRESSION[Request Compression]
        KEEP_ALIVE[Keep-Alive]
        OFFLINE[Offline Queue]
    end

    TREE_SHAKE --> CODE_SPLIT --> MINIFY --> GZIP
    DEBOUNCE --> BATCH --> ASYNC --> WEB_WORKER
    COMPRESSION --> KEEP_ALIVE --> OFFLINE
```

#### Worker Optimizations

```mermaid
graph TB
    subgraph "Request Processing"
        PARALLEL[Parallel Validation]
        BATCH_WORKER[Batch Accumulation]
        STREAMING[Streaming Transforms]
    end

    subgraph "Downstream Optimization"
        BATCH_LOKI[Batch to Loki<br/>100 events/req]
        BATCH_PROM[Batch to Prometheus<br/>1000 samples/req]
        CIRCUIT[Circuit Breaker]
    end

    subgraph "Resource Management"
        CPU_LIMIT[CPU Time Budget<br/><50ms]
        MEM_LIMIT[Memory Limit<br/><128MB]
        CACHE[KV Cache<br/>Org configs]
    end

    PARALLEL --> BATCH_WORKER
    BATCH_WORKER --> STREAMING
    STREAMING --> BATCH_LOKI
    STREAMING --> BATCH_PROM
    BATCH_LOKI --> CIRCUIT
    BATCH_PROM --> CIRCUIT

    PARALLEL --> CPU_LIMIT
    BATCH_WORKER --> MEM_LIMIT
    CIRCUIT --> CACHE
```

### 3. Monitoring & Observability

```mermaid
graph TB
    subgraph "SDK Metrics (Client-Side)"
        SDK_PERF[Performance.measure()<br/>Event capture time]
        SDK_MEM[Memory usage]
        SDK_NETWORK[Network requests]
        SDK_ERRORS[SDK errors]
    end

    subgraph "Worker Metrics (Edge)"
        WORKER_LATENCY[Request latency<br/>P50/P95/P99]
        WORKER_SUCCESS[Success rate]
        WORKER_ERRORS[Error rate by type]
        WORKER_REJECT[Reject rate by reason]
        WORKER_CPU[CPU time]
    end

    subgraph "Backend Metrics"
        LOKI_INGEST[Loki ingest rate]
        PROM_INGEST[Prometheus ingest rate]
        QUERY_LATENCY[Query latency]
        STORAGE[Storage usage]
    end

    subgraph "Alerting"
        ALERT_INGESTION[Ingest SLO alert]
        ALERT_LATENCY[Latency alert]
        ALERT_ERRORS[Error rate alert]
        ALERT_COST[Cost alert]
    end

    SDK_PERF --> WORKER_LATENCY
    SDK_NETWORK --> WORKER_SUCCESS
    SDK_ERRORS --> WORKER_ERRORS

    WORKER_LATENCY --> LOKI_INGEST
    WORKER_SUCCESS --> PROM_INGEST
    WORKER_REJECT --> ALERT_COST

    LOKI_INGEST --> QUERY_LATENCY
    PROM_INGEST --> STORAGE

    WORKER_LATENCY --> ALERT_LATENCY
    WORKER_SUCCESS --> ALERT_INGESTION
    WORKER_ERRORS --> ALERT_ERRORS
    STORAGE --> ALERT_COST
```

---

**End of Architecture v1.0**
