/**
 * Event Validation Module
 */

import { BaseEvent, IngestRequest } from "../definitions/types";

export class ValidationService {
  /**
   * Validate ingest request
   */
  validateRequest(body: any): {
    valid: boolean;
    errors: string[];
    data?: IngestRequest;
  } {
    const errors: string[] = [];

    if (!body) {
      errors.push("Request body is empty");
      return { valid: false, errors };
    }

    if (!Array.isArray(body.events)) {
      errors.push("events must be an array");
      return { valid: false, errors };
    }

    if (body.events.length === 0) {
      errors.push("events array is empty");
      return { valid: false, errors };
    }

    if (body.events.length > 1000) {
      errors.push("events array too large (max 1000 events per request)");
      return { valid: false, errors };
    }

    // Validate each event
    for (let i = 0; i < body.events.length; i++) {
      const eventErrors = this.validateEvent(body.events[i], i);
      errors.push(...eventErrors);
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      errors: [],
      data: body as IngestRequest,
    };
  }

  // Valid event types
  private static readonly VALID_EVENT_TYPES = [
    "playerready",
    "viewstart",
    "playing",
    "pause",
    "seek",
    "stall_start",
    "stall_end",
    "ended",
    "error",
    "quartile",
    "heartbeat",
    "quality_change",
  ];

  /**
   * Validate individual event
   */
  private validateEvent(event: any, index: number): string[] {
    const errors: string[] = [];
    const prefix = `Event ${index}:`;

    // Required fields
    if (!event.event_type || typeof event.event_type !== "string") {
      errors.push(`${prefix} event_type is required and must be a string`);
    } else if (
      !ValidationService.VALID_EVENT_TYPES.includes(event.event_type)
    ) {
      errors.push(
        `${prefix} event_type "${event.event_type}" is not a valid event type. Valid types: ${ValidationService.VALID_EVENT_TYPES.join(", ")}`,
      );
    }

    if (!event.event_time || typeof event.event_time !== "number") {
      errors.push(`${prefix} event_time is required and must be a number`);
    }

    if (!event.viewer_time || typeof event.viewer_time !== "number") {
      errors.push(`${prefix} viewer_time is required and must be a number`);
    }

    if (!event.org_id || typeof event.org_id !== "string") {
      errors.push(`${prefix} org_id is required and must be a string`);
    }

    if (!event.player_id || typeof event.player_id !== "string") {
      errors.push(`${prefix} player_id is required and must be a string`);
    }

    if (!event.view_id || typeof event.view_id !== "string") {
      errors.push(`${prefix} view_id is required and must be a string`);
    }

    if (!event.session_id || typeof event.session_id !== "string") {
      errors.push(`${prefix} session_id is required and must be a string`);
    }

    if (!event.viewer_id || typeof event.viewer_id !== "string") {
      errors.push(`${prefix} viewer_id is required and must be a string`);
    }

    // Validate timestamps are reasonable (not in the future, not too old)
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const maxFuture = 5 * 60 * 1000; // 5 minutes

    if (event.event_time) {
      if (event.event_time > now + maxFuture) {
        errors.push(`${prefix} event_time is too far in the future`);
      }
      if (event.event_time < now - maxAge) {
        errors.push(`${prefix} event_time is too old (> 24 hours)`);
      }
    }

    return errors;
  }

  /**
   * Sanitize event (remove invalid data)
   */
  sanitizeEvent(event: BaseEvent): BaseEvent {
    // Remove null/undefined values
    const sanitized: any = {};

    for (const [key, value] of Object.entries(event)) {
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && !Array.isArray(value)) {
          // Recursively sanitize objects
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized as BaseEvent;
  }

  /**
   * Sanitize object recursively
   */
  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && !Array.isArray(value)) {
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }
}
