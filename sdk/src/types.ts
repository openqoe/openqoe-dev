/**
 * openqoe-core Types & Interfaces
 */

export type Environment = "dev" | "staging" | "prod";
export type LogLevel = "error" | "warn" | "info" | "debug";
export type PlayerType = "html5" | "videojs" | "hlsjs" | "dashjs" | "shaka";
export type DeviceCategory = "desktop" | "mobile" | "tablet" | "tv";
export type StreamType = "vod" | "live";
export type PlayerPreload = "none" | "metadata" | "auto";
export type ErrorFamily = "network" | "decoder" | "source" | "drm" | "business";

export interface OpenQoEConfig {
  // Required
  orgId: string;
  playerId: string;
  endpointUrl: string;

  // Optional - Environment
  env?: Environment;
  appName?: string;
  appVersion?: string;

  // Optional - Sampling
  samplingRate?: number; // 0.0 - 1.0

  // Optional - Privacy
  enablePII?: boolean;
  hashSalt?: string;

  // Optional - Performance
  batchSize?: number;
  batchInterval?: number; // ms
  maxQueueSize?: number;

  // Optional - Debugging
  debug?: boolean;
  logLevel?: LogLevel;
}

export interface VideoMetadata {
  videoId?: string;
  videoTitle?: string;
  videoSeries?: string;
  duration?: number; // ms
  sourceUrl?: string;
  customDimensions?: Record<string, string>;
}

export interface DeviceInfo {
  name?: string;
  model?: string;
  category?: DeviceCategory;
  manufacturer?: string;
}

export interface OSInfo {
  family?: string;
  version?: string;
}

export interface BrowserInfo {
  family?: string;
  version?: string;
}

export interface PlayerInfo {
  name: string;
  version?: string;
  autoplay?: boolean;
  preload?: PlayerPreload;
}

export interface NetworkInfo {
  asn?: number;
  country_code?: string;
  region?: string;
  city?: string;
}

export interface CDNInfo {
  provider?: string;
  edge_pop?: string;
  origin?: string;
}

export interface VideoInfo {
  id?: string;
  title?: string;
  series?: string;
  duration?: number; // ms
  source_url?: string;
}

export interface Resolution {
  width: number;
  height: number;
}

export interface CMCDData {
  br?: number; // Encoded bitrate (kbps)
  bl?: number; // Buffer length (ms)
  bs?: boolean; // Buffer starvation
  cid?: string; // Content ID
  d?: number; // Object duration (ms)
  dl?: number; // Deadline (ms)
  mtp?: number; // Measured throughput (kbps)
  nor?: string; // Next object request
  nrr?: string; // Next range request
  ot?: string; // Object type
  pr?: number; // Playback rate
  rtp?: number; // Requested max throughput (kbps)
  sf?: string; // Streaming format
  sid?: string; // Session ID
  st?: string; // Stream type
  su?: boolean; // Startup
  tb?: number; // Top bitrate (kbps)
  v?: number; // Version
}

export interface BaseEvent {
  // Event metadata
  event_type: string;
  event_time: number; // Unix ms
  viewer_time: number; // Unix ms
  playback_time?: number; // ms

  // Session identifiers
  org_id: string;
  player_id: string;
  view_id: string;
  session_id: string;
  viewer_id: string;

  // Environment
  env?: string;
  app_name?: string;
  app_version?: string;

  // Context
  device?: DeviceInfo;
  os?: OSInfo;
  browser?: BrowserInfo;
  player?: PlayerInfo;
  network?: NetworkInfo;
  cdn?: CDNInfo;
  video?: VideoInfo;

  // CMCD
  cmcd?: CMCDData;

  // Event-specific data
  data?: Record<string, any>;
}

export interface PlayerReadyData {
  player_startup_time?: number; // ms
  page_load_time?: number; // ms
}

export interface ViewStartData {
  video_startup_time?: number; // ms
  preroll_requested?: boolean;
}

export interface PlayingData {
  bitrate?: number; // bps
  resolution?: Resolution;
  framerate?: number;
}

export interface PauseData {
  playing_time?: number; // ms
}

export interface SeekData {
  from: number; // ms
  to: number; // ms
  seek_latency?: number; // ms
}

export interface StallStartData {
  buffer_length?: number; // ms
  bitrate?: number; // bps
}

export interface StallEndData {
  stall_duration: number; // ms
  buffer_length?: number; // ms
}

export interface QualityChangeData {
  previous_bitrate?: number; // bps
  new_bitrate: number; // bps
  previous_resolution?: Resolution;
  new_resolution?: Resolution;
  trigger?: "abr" | "manual";
}

export interface EndedData {
  playing_time?: number; // ms
  total_watch_time?: number; // ms
  completion_rate?: number; // 0.0 - 1.0
  rebuffer_count?: number;
  rebuffer_duration?: number; // ms
}

export interface ErrorData {
  error_family: ErrorFamily;
  error_id?: number;
  error_code: string;
  error_message: string;
  error_context?: Record<string, any>;
}

export interface QuartileData {
  quartile: 25 | 50 | 75 | 100;
  playing_time?: number; // ms
  watch_time?: number; // ms
}

export interface HeartbeatData {
  playing_time?: number; // ms
  bitrate?: number; // bps
  buffer_length?: number; // ms
  dropped_frames?: number;
}

export interface SessionData {
  sessionId: string;
  viewId: string;
  viewStart: number; // Unix ms
  viewEnd?: number; // Unix ms
  playbackPosition: number; // ms
  lastHeartbeat: number; // Unix ms
}

export interface PlayerState {
  currentTime: number; // seconds
  duration: number; // seconds
  paused: boolean;
  ended: boolean;
  buffered: TimeRanges | null;
  readyState: number;
}

export interface PlayerError {
  code: string | number;
  message: string;
  fatal?: boolean;
  context?: Record<string, any>;
}

export interface PlayerAdapter {
  attach(player: any, metadata: VideoMetadata): void;
  detach(): void;
  getVideoPlaybackPosition(): number;
  getDuration(): number;
  getBitrate(): number | null;
  getVideoResolution(): Resolution | null;
  getPlayerState(): PlayerState;
  getCMCDData(): CMCDData | null;
}
