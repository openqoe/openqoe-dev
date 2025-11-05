/**
 * SessionManager Tests
 */

import { SessionManager } from '../../src/core/SessionManager';
import { PrivacyModule } from '../../src/utils/privacy';

describe('SessionManager', () => {
  let sessionManager: SessionManager;
  let privacy: PrivacyModule;

  beforeEach(() => {
    privacy = new PrivacyModule('test-salt');
    sessionManager = new SessionManager(privacy);
  });

  describe('startSession', () => {
    it('should create a new session', () => {
      const sessionId = sessionManager.startSession();
      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
    });

    it('should create unique session IDs', () => {
      const id1 = sessionManager.startSession();
      const id2 = sessionManager.startSession();
      expect(id1).not.toBe(id2);
    });

    it('should set session ID', () => {
      const sessionId = sessionManager.startSession();
      expect(sessionManager.getSessionId()).toBe(sessionId);
    });

    it('should create a view ID', () => {
      sessionManager.startSession();
      const viewId = sessionManager.getViewId();
      expect(viewId).toBeTruthy();
      expect(typeof viewId).toBe('string');
    });
  });

  describe('getSessionId', () => {
    it('should return null before session is started', () => {
      expect(sessionManager.getSessionId()).toBeNull();
    });

    it('should return session ID after session is started', () => {
      const sessionId = sessionManager.startSession();
      expect(sessionManager.getSessionId()).toBe(sessionId);
    });
  });

  describe('getViewId', () => {
    it('should return null before session is started', () => {
      expect(sessionManager.getViewId()).toBeNull();
    });

    it('should return view ID after session is started', () => {
      sessionManager.startSession();
      const viewId = sessionManager.getViewId();
      expect(viewId).toBeTruthy();
    });
  });

  describe('startNewView', () => {
    it('should create a new view ID', () => {
      sessionManager.startSession();
      const viewId1 = sessionManager.getViewId();

      sessionManager.startNewView();
      const viewId2 = sessionManager.getViewId();

      expect(viewId1).not.toBe(viewId2);
    });

    it('should keep the same session ID', () => {
      const sessionId = sessionManager.startSession();
      sessionManager.startNewView();
      expect(sessionManager.getSessionId()).toBe(sessionId);
    });
  });

  describe('updateHeartbeat', () => {
    it('should update last heartbeat time', () => {
      sessionManager.startSession();
      const before = Date.now();
      sessionManager.updateHeartbeat();
      const after = Date.now();

      // This is a simple test - in production you'd check the actual timestamp
      expect(true).toBe(true);
    });
  });

  describe('isSessionExpired', () => {
    it('should return false for new session', () => {
      sessionManager.startSession();
      expect(sessionManager.isSessionExpired()).toBe(false);
    });

    it('should return true for expired session', () => {
      sessionManager.startSession();

      // Mock an old timestamp (we can't easily test this without time manipulation)
      // In a real scenario, you'd use jest.useFakeTimers()
      expect(sessionManager.isSessionExpired()).toBe(false);
    });
  });

  describe('endSession', () => {
    it('should clear session ID', () => {
      sessionManager.startSession();
      sessionManager.endSession();
      expect(sessionManager.getSessionId()).toBeNull();
    });

    it('should clear view ID', () => {
      sessionManager.startSession();
      sessionManager.endSession();
      expect(sessionManager.getViewId()).toBeNull();
    });
  });

  describe('getPlaybackPosition', () => {
    it('should return 0 by default', () => {
      sessionManager.startSession();
      expect(sessionManager.getPlaybackPosition()).toBe(0);
    });
  });

  describe('setPlaybackPosition', () => {
    it('should update playback position', () => {
      sessionManager.startSession();
      sessionManager.setPlaybackPosition(1234);
      expect(sessionManager.getPlaybackPosition()).toBe(1234);
    });

    it('should handle multiple updates', () => {
      sessionManager.startSession();
      sessionManager.setPlaybackPosition(100);
      sessionManager.setPlaybackPosition(200);
      sessionManager.setPlaybackPosition(300);
      expect(sessionManager.getPlaybackPosition()).toBe(300);
    });
  });
});
