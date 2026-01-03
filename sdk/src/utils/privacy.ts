/**
 * Privacy utilities - Hashing and PII protection
 */

export class PrivacyModule {
  private salt: string;

  constructor(salt: string = "") {
    this.salt = salt;
  }

  /**
   * Hash a value using SHA-256
   */
  async hash(value: string): Promise<string> {
    if (!value) return "";

    const text = value + this.salt;

    // Use Web Crypto API if available (browser)
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Fallback for environments without Web Crypto
    return this.simpleSHA256();
  }

  /**
   * SHA-256 fallback - throws error as Web Crypto should always be available
   * Note: This SDK requires Web Crypto API which is available in all modern browsers
   */
  private simpleSHA256(): string {
    throw new Error(
      "Web Crypto API is not available. OpenQoE SDK requires a modern browser with crypto.subtle support. " +
        "If you are using this in a server-side environment, please use a proper crypto library.",
    );
  }

  /**
   * Generate a unique viewer ID
   */
  async generateViewerId(): Promise<string> {
    // Try to get from localStorage first
    if (typeof localStorage !== "undefined") {
      let viewerId = localStorage.getItem("openqoe_viewer_id");
      if (viewerId) {
        return await this.hash(viewerId);
      }

      // Generate new viewer ID
      viewerId = this.generateUUID();
      try {
        localStorage.setItem("openqoe_viewer_id", viewerId);
      } catch (e) {
        // localStorage might be disabled
      }
      return await this.hash(viewerId);
    }

    // Fallback: generate temporary ID
    return await this.hash(this.generateUUID());
  }

  /**
   * Generate UUID v4
   */
  generateUUID(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback UUID generation
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Sanitize URL - remove query params and hash
   */
  sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch (e) {
      return url;
    }
  }

  /**
   * Sanitize event data - remove potential PII
   */
  sanitizeEvent(event: any): any {
    const sanitized = { ...event };

    // Sanitize URLs
    if (sanitized.video?.source_url) {
      sanitized.video.source_url = this.sanitizeUrl(sanitized.video.source_url);
    }

    // Remove potentially sensitive data from error context
    if (sanitized.data?.error_context) {
      const context = { ...sanitized.data.error_context };
      if (context.url) {
        context.url = this.sanitizeUrl(context.url);
      }
      // Remove raw error stack traces
      delete context.stack;
      sanitized.data.error_context = context;
    }

    return sanitized;
  }
}
