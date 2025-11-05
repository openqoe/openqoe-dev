/**
 * Session Manager - Manages session and view IDs
 */

import { SessionData } from '../types';
import { PrivacyModule } from '../utils/privacy';

export class SessionManager {
  private privacy: PrivacyModule;
  private currentSession: SessionData | null = null;
  private SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor(privacy: PrivacyModule) {
    this.privacy = privacy;
  }

  /**
   * Start a new session
   */
  startSession(): string {
    const sessionId = this.privacy.generateUUID();

    this.currentSession = {
      sessionId,
      viewId: this.privacy.generateUUID(),
      viewStart: Date.now(),
      playbackPosition: 0,
      lastHeartbeat: Date.now()
    };

    return sessionId;
  }

  /**
   * Start a new view (within the same session)
   */
  startView(): string {
    if (!this.currentSession) {
      this.startSession();
    }

    const viewId = this.privacy.generateUUID();
    this.currentSession!.viewId = viewId;
    this.currentSession!.viewStart = Date.now();
    this.currentSession!.playbackPosition = 0;

    return viewId;
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.viewEnd = Date.now();
      this.currentSession = null;
    }
  }

  /**
   * Update heartbeat
   */
  updateHeartbeat(): void {
    if (this.currentSession) {
      this.currentSession.lastHeartbeat = Date.now();
    }
  }

  /**
   * Update playback position
   */
  updatePlaybackPosition(position: number): void {
    if (this.currentSession) {
      this.currentSession.playbackPosition = position;
    }
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.currentSession?.sessionId || null;
  }

  /**
   * Get current view ID
   */
  getViewId(): string | null {
    return this.currentSession?.viewId || null;
  }

  /**
   * Get current session data
   */
  getSessionData(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Check if session has expired
   */
  isSessionExpired(): boolean {
    if (!this.currentSession) return true;

    const now = Date.now();
    const timeSinceLastHeartbeat = now - this.currentSession.lastHeartbeat;

    return timeSinceLastHeartbeat > this.SESSION_TIMEOUT;
  }

  /**
   * Clean up expired session
   */
  cleanupIfExpired(): void {
    if (this.isSessionExpired()) {
      this.currentSession = null;
    }
  }
}
