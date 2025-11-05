/**
 * OpenQoE SDK - Public API
 */

// Main SDK class
export { OpenQoE } from './OpenQoE';

// Types
export type {
  OpenQoEConfig,
  VideoMetadata,
  PlayerType,
  BaseEvent,
  PlayerAdapter,
  PlayerInfo,
  DeviceInfo,
  OSInfo,
  BrowserInfo,
  NetworkInfo,
  PlayerState,
  Resolution,
  CMCDData,
  PlayerError,
  Environment
} from './types';

// Adapters (exported for advanced usage)
export { HTML5Adapter } from './adapters/HTML5Adapter';
export { VideoJsAdapter } from './adapters/VideoJsAdapter';
export { HlsJsAdapter } from './adapters/HlsJsAdapter';
export { DashJsAdapter } from './adapters/DashJsAdapter';
export { ShakaAdapter } from './adapters/ShakaAdapter';
