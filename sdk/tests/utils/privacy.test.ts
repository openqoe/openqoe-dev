/**
 * Privacy Module Tests
 */

import { PrivacyModule } from '../../src/utils/privacy';

describe('PrivacyModule', () => {
  let privacy: PrivacyModule;

  beforeEach(() => {
    privacy = new PrivacyModule('test-salt');
  });

  describe('hash', () => {
    it('should hash a string with SHA-256', async () => {
      const result = await privacy.hash('test-value');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBe(64); // SHA-256 produces 64 hex characters
    });

    it('should produce consistent hashes for same input', async () => {
      const hash1 = await privacy.hash('test-value');
      const hash2 = await privacy.hash('test-value');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', async () => {
      const hash1 = await privacy.hash('value1');
      const hash2 = await privacy.hash('value2');
      expect(hash1).not.toBe(hash2);
    });

    it('should include salt in hash', async () => {
      const privacy1 = new PrivacyModule('salt1');
      const privacy2 = new PrivacyModule('salt2');

      const hash1 = await privacy1.hash('test');
      const hash2 = await privacy2.hash('test');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = privacy.generateUUID();
      expect(uuid).toBeTruthy();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = privacy.generateUUID();
      const uuid2 = privacy.generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('generateViewerId', () => {
    it('should generate a hashed viewer ID', async () => {
      const viewerId = await privacy.generateViewerId();
      expect(viewerId).toBeTruthy();
      expect(typeof viewerId).toBe('string');
      expect(viewerId.length).toBe(64);
    });

    it('should generate different viewer IDs', async () => {
      const id1 = await privacy.generateViewerId();
      const id2 = await privacy.generateViewerId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('sanitizeUrl', () => {
    it('should remove query parameters', () => {
      const url = 'https://example.com/video?id=123&token=abc';
      const sanitized = privacy.sanitizeUrl(url);
      expect(sanitized).toBe('https://example.com/video');
    });

    it('should remove hash', () => {
      const url = 'https://example.com/video#section';
      const sanitized = privacy.sanitizeUrl(url);
      expect(sanitized).toBe('https://example.com/video');
    });

    it('should remove both query and hash', () => {
      const url = 'https://example.com/video?id=123#section';
      const sanitized = privacy.sanitizeUrl(url);
      expect(sanitized).toBe('https://example.com/video');
    });

    it('should keep clean URLs unchanged', () => {
      const url = 'https://example.com/video';
      const sanitized = privacy.sanitizeUrl(url);
      expect(sanitized).toBe(url);
    });

    it('should handle URLs with port', () => {
      const url = 'https://example.com:8080/video?id=123';
      const sanitized = privacy.sanitizeUrl(url);
      expect(sanitized).toBe('https://example.com:8080/video');
    });
  });

  describe('sanitizeEvent', () => {
    it('should return event as-is when enablePII is false', () => {
      const event = {
        event_type: 'test',
        event_time: 123,
        org_id: 'org-1',
        viewer_id: 'viewer-1',
        video: {
          source_url: 'https://example.com/video?token=secret'
        }
      };

      const sanitized = privacy.sanitizeEvent(event as any);
      expect(sanitized).toBeDefined();
      expect(sanitized.event_type).toBe('test');
    });

    it('should sanitize URLs in video metadata', () => {
      const event = {
        event_type: 'test',
        event_time: 123,
        org_id: 'org-1',
        viewer_id: 'viewer-1',
        video: {
          source_url: 'https://example.com/video?token=secret#section'
        }
      };

      const sanitized = privacy.sanitizeEvent(event as any);
      expect(sanitized.video?.source_url).toBe('https://example.com/video');
    });

    it('should handle events without video metadata', () => {
      const event = {
        event_type: 'test',
        event_time: 123,
        org_id: 'org-1',
        viewer_id: 'viewer-1'
      };

      const sanitized = privacy.sanitizeEvent(event as any);
      expect(sanitized).toBeDefined();
      expect(sanitized.video).toBeUndefined();
    });
  });
});
