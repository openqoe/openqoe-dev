/**
 * OpenQoE Cloudflare Worker
 * Main entry point for event ingestion and forwarding
 */

import { Env, IngestResponse } from './types';
import { Config } from './config';
import { AuthService } from './auth';
import { ValidationService } from './validation';
import { CardinalityService } from './cardinality';
import { PrometheusService } from './prometheus';
import { LokiService } from './loki';
import { DestinationManager } from './destinations';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS handling
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Route handling
    const url = new URL(request.url);

    if (url.pathname === '/v1/events' && request.method === 'POST') {
      return await handleIngest(request, env, ctx);
    }

    if (url.pathname === '/health' && request.method === 'GET') {
      return handleHealth();
    }

    if (url.pathname === '/stats' && request.method === 'GET') {
      return await handleStats(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

/**
 * Handle CORS preflight requests
 */
function handleCORS(request: Request): Response {
  const origin = request.headers.get('Origin') || '*';

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400'
    }
  });
}

/**
 * Handle event ingestion
 */
async function handleIngest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const startTime = Date.now();

  try {
    // Initialize services
    const config = new Config(env);
    const authService = new AuthService(config);
    const validationService = new ValidationService();
    const cardinalityService = new CardinalityService(config, env);
    const prometheusService = new PrometheusService(config, cardinalityService);
    const lokiService = new LokiService(config, cardinalityService);

    // Authenticate
    if (!authService.authenticate(request)) {
      return authService.createUnauthorizedResponse();
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return jsonResponse({
        success: false,
        message: 'Invalid JSON in request body'
      }, 400);
    }

    // Validate request
    const validation = validationService.validateRequest(body);
    if (!validation.valid) {
      return jsonResponse({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      }, 400);
    }

    const events = validation.data!.events;

    // Sanitize events
    const sanitizedEvents = events.map(e => validationService.sanitizeEvent(e));

    // Process events in background (don't block response)
    ctx.waitUntil(processEvents(sanitizedEvents, prometheusService, lokiService));

    // Return success response immediately
    const processingTime = Date.now() - startTime;

    return jsonResponse({
      success: true,
      message: 'Events accepted',
      events_received: events.length,
      processing_time_ms: processingTime
    }, 202); // 202 Accepted

  } catch (error) {
    console.error('Error handling ingest:', error);

    return jsonResponse({
      success: false,
      message: 'Internal server error',
      errors: [String(error)]
    }, 500);
  }
}

/**
 * Process events and send to Prometheus and Loki
 */
async function processEvents(
  events: any[],
  prometheusService: PrometheusService,
  lokiService: LokiService
): Promise<void> {
  try {
    // Transform and send to Prometheus
    const prometheusPromise = (async () => {
      try {
        const timeSeries = await prometheusService.transformEvents(events);
        if (timeSeries.length > 0) {
          await prometheusService.sendToPrometheus(timeSeries);
        }
      } catch (error) {
        console.error('Error sending to Prometheus:', error);
      }
    })();

    // Transform and send to Loki
    const lokiPromise = (async () => {
      try {
        const streams = await lokiService.transformEvents(events);
        if (streams.length > 0) {
          await lokiService.sendToLoki(streams);
        }
      } catch (error) {
        console.error('Error sending to Loki:', error);
      }
    })();

    // Wait for both to complete
    await Promise.all([prometheusPromise, lokiPromise]);

    console.log(`Successfully processed ${events.length} events`);
  } catch (error) {
    console.error('Error processing events:', error);
  }
}

/**
 * Handle health check
 */
function handleHealth(): Response {
  return jsonResponse({
    status: 'healthy',
    timestamp: Date.now(),
    service: 'openqoe-worker',
    version: '1.0.0'
  });
}

/**
 * Handle stats endpoint (admin only)
 */
async function handleStats(request: Request, env: Env): Promise<Response> {
  try {
    const config = new Config(env);
    const authService = new AuthService(config);

    // Require authentication for stats
    if (!authService.authenticate(request)) {
      return authService.createUnauthorizedResponse();
    }

    const cardinalityService = new CardinalityService(config, env);

    // Get query parameters
    const url = new URL(request.url);
    const dimension = url.searchParams.get('dimension');

    if (dimension) {
      // Get stats for specific dimension
      const stats = await cardinalityService.getCardinalityStats(dimension);
      return jsonResponse({
        dimension,
        cardinality: stats.count,
        values: stats.values.slice(0, 100) // Limit to 100 values
      });
    }

    // Return general stats
    const limits = config.getAllCardinalityLimits();
    return jsonResponse({
      cardinality_limits: limits,
      worker_version: '1.0.0'
    });

  } catch (error) {
    console.error('Error handling stats:', error);
    return jsonResponse({
      success: false,
      message: 'Error retrieving stats',
      error: String(error)
    }, 500);
  }
}

/**
 * Helper to create JSON response with CORS headers
 */
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key'
    }
  });
}
