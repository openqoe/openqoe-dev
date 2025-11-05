/**
 * Authentication Module
 */

import { Config } from './config';

export class AuthService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Authenticate incoming request
   */
  authenticate(request: Request): boolean {
    if (!this.config.isAuthEnabled()) {
      // Authentication disabled
      return true;
    }

    const apiKey = this.config.getApiKey();
    if (!apiKey) {
      return true;
    }

    // Check Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      // Support both "Bearer <token>" and "<token>" formats
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

      if (token === apiKey) {
        return true;
      }
    }

    // Check X-API-Key header
    const apiKeyHeader = request.headers.get('X-API-Key');
    if (apiKeyHeader === apiKey) {
      return true;
    }

    return false;
  }

  /**
   * Create unauthorized response
   */
  createUnauthorizedResponse(): Response {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Unauthorized: Invalid or missing API key'
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer realm="OpenQoE"'
        }
      }
    );
  }
}
