/**
 * BatchManager Tests
 */

import { BatchManager } from '../../src/core/BatchManager';
import { Logger } from '../../src/utils/logger';
import { BaseEvent } from '../../src/types';

describe('BatchManager', () => {
  let batchManager: BatchManager;
  let logger: Logger;
  let flushCallback: jest.Mock;

  beforeEach(() => {
    logger = new Logger(false, 'error');
    flushCallback = jest.fn().mockResolvedValue(undefined);
    batchManager = new BatchManager(5, 1000, flushCallback, logger);
  });

  afterEach(() => {
    batchManager.destroy();
  });

  const createMockEvent = (eventType: string): BaseEvent => ({
    event_type: eventType,
    event_time: Date.now(),
    viewer_time: Date.now(),
    org_id: 'test-org',
    player_id: 'test-player',
    view_id: 'test-view',
    session_id: 'test-session',
    viewer_id: 'test-viewer'
  });

  describe('addEvent', () => {
    it('should add event to batch', () => {
      const event = createMockEvent('test');
      batchManager.addEvent(event);
      expect(flushCallback).not.toHaveBeenCalled();
    });

    it('should flush when batch size is reached', () => {
      for (let i = 0; i < 5; i++) {
        batchManager.addEvent(createMockEvent(`test-${i}`));
      }
      expect(flushCallback).toHaveBeenCalledTimes(1);
      expect(flushCallback).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should flush correct number of events', () => {
      const events = [
        createMockEvent('test-1'),
        createMockEvent('test-2'),
        createMockEvent('test-3'),
        createMockEvent('test-4'),
        createMockEvent('test-5')
      ];

      events.forEach(e => batchManager.addEvent(e));

      expect(flushCallback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ event_type: 'test-1' }),
          expect.objectContaining({ event_type: 'test-2' }),
          expect.objectContaining({ event_type: 'test-3' }),
          expect.objectContaining({ event_type: 'test-4' }),
          expect.objectContaining({ event_type: 'test-5' })
        ])
      );
    });

    it('should continue batching after flush', () => {
      // First batch
      for (let i = 0; i < 5; i++) {
        batchManager.addEvent(createMockEvent(`batch1-${i}`));
      }
      expect(flushCallback).toHaveBeenCalledTimes(1);

      // Second batch
      for (let i = 0; i < 5; i++) {
        batchManager.addEvent(createMockEvent(`batch2-${i}`));
      }
      expect(flushCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('flush', () => {
    it('should flush manually', () => {
      batchManager.addEvent(createMockEvent('test-1'));
      batchManager.addEvent(createMockEvent('test-2'));

      batchManager.flush();

      expect(flushCallback).toHaveBeenCalledTimes(1);
      expect(flushCallback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ event_type: 'test-1' }),
          expect.objectContaining({ event_type: 'test-2' })
        ])
      );
    });

    it('should not flush if batch is empty', () => {
      batchManager.flush();
      expect(flushCallback).not.toHaveBeenCalled();
    });

    it('should clear batch after flush', () => {
      batchManager.addEvent(createMockEvent('test'));
      batchManager.flush();

      flushCallback.mockClear();
      batchManager.flush();

      expect(flushCallback).not.toHaveBeenCalled();
    });
  });

  describe('interval flushing', () => {
    it('should flush after interval', (done) => {
      jest.useFakeTimers();

      batchManager.addEvent(createMockEvent('test'));

      expect(flushCallback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      // Wait for async flush
      setTimeout(() => {
        expect(flushCallback).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
        done();
      }, 100);
    });
  });

  describe('destroy', () => {
    it('should flush on destroy', () => {
      batchManager.addEvent(createMockEvent('test'));
      batchManager.destroy();

      expect(flushCallback).toHaveBeenCalledTimes(1);
    });

    it('should clear interval on destroy', () => {
      jest.useFakeTimers();

      batchManager.destroy();
      batchManager.addEvent(createMockEvent('test'));

      jest.advanceTimersByTime(10000);

      // Should not flush after destroy
      expect(flushCallback).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('should handle flush errors gracefully', async () => {
      const errorCallback = jest.fn().mockRejectedValue(new Error('Flush failed'));
      const errorBatchManager = new BatchManager(2, 1000, errorCallback, logger);

      errorBatchManager.addEvent(createMockEvent('test-1'));
      errorBatchManager.addEvent(createMockEvent('test-2'));

      // Wait for async flush to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorCallback).toHaveBeenCalled();

      errorBatchManager.destroy();
    });
  });
});
