/**
 * Configuration Validation Script
 * Tests destination configuration logic without requiring actual deployment
 */

import { Env } from '../src/types';
import { DestinationManager } from '../src/destinations';

// Test Self-Hosted Configuration
function testSelfHostedConfig() {
  console.log('\n=== Testing Self-Hosted Configuration ===\n');

  const env: Env = {
    CARDINALITY_KV: {} as any,
    PROMETHEUS_URL: 'http://localhost:9090/api/v1/write',
    LOKI_URL: 'http://localhost:3100/loki/api/v1/push',
    PROMETHEUS_USERNAME: 'admin',
    PROMETHEUS_PASSWORD: 'secret'
  };

  const manager = new DestinationManager(env);
  const config = manager.getDestinationConfig();
  const validation = manager.validateConfig();

  console.log('Destination Type:', config.type);
  console.log('Metrics URL:', config.metrics.url);
  console.log('Logs URL:', config.logs.url);
  console.log('Has Auth:', !!config.metrics.username);
  console.log('Validation:', validation.valid ? '✓ Valid' : '✗ Invalid');

  if (!validation.valid) {
    console.log('Errors:', validation.errors);
  }

  // Assertions
  if (config.type !== 'self-hosted') {
    throw new Error('Expected self-hosted type');
  }
  if (!config.metrics.url.includes('prometheus')) {
    throw new Error('Expected Prometheus URL');
  }
  if (!validation.valid) {
    throw new Error('Configuration should be valid');
  }

  console.log('\n✓ Self-Hosted configuration test passed\n');
}

// Test Grafana Cloud Configuration
function testGrafanaCloudConfig() {
  console.log('\n=== Testing Grafana Cloud Configuration ===\n');

  const env: Env = {
    CARDINALITY_KV: {} as any,
    GRAFANA_CLOUD_INSTANCE_ID: '123456',
    GRAFANA_CLOUD_API_KEY: 'glc_test_key',
    GRAFANA_CLOUD_REGION: 'us-central1'
  };

  const manager = new DestinationManager(env);
  const config = manager.getDestinationConfig();
  const validation = manager.validateConfig();

  console.log('Destination Type:', config.type);
  console.log('Metrics URL:', config.metrics.url);
  console.log('Logs URL:', config.logs.url);
  console.log('Has Auth:', !!config.metrics.username);
  console.log('Has X-Scope-OrgID:', !!config.metrics.headers?.['X-Scope-OrgID']);
  console.log('Validation:', validation.valid ? '✓ Valid' : '✗ Invalid');

  if (!validation.valid) {
    console.log('Errors:', validation.errors);
  }

  // Assertions
  if (config.type !== 'grafana-cloud') {
    throw new Error('Expected grafana-cloud type');
  }
  if (!config.metrics.url.includes('grafana.net')) {
    throw new Error('Expected Grafana Cloud URL');
  }
  if (!config.metrics.url.includes('prom/push')) {
    throw new Error('Expected Mimir endpoint (prom/push)');
  }
  if (!validation.valid) {
    throw new Error('Configuration should be valid');
  }

  console.log('\n✓ Grafana Cloud configuration test passed\n');
}

// Test with custom Grafana Cloud URLs
function testGrafanaCloudCustomURLs() {
  console.log('\n=== Testing Grafana Cloud with Custom URLs ===\n');

  const env: Env = {
    CARDINALITY_KV: {} as any,
    GRAFANA_CLOUD_INSTANCE_ID: '789012',
    GRAFANA_CLOUD_API_KEY: 'glc_custom_key',
    GRAFANA_CLOUD_METRICS_URL: 'https://prometheus-prod-01-eu-west-0.grafana.net/api/prom/push',
    GRAFANA_CLOUD_LOGS_URL: 'https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push'
  };

  const manager = new DestinationManager(env);
  const config = manager.getDestinationConfig();
  const validation = manager.validateConfig();

  console.log('Destination Type:', config.type);
  console.log('Metrics URL:', config.metrics.url);
  console.log('Logs URL:', config.logs.url);
  console.log('Validation:', validation.valid ? '✓ Valid' : '✗ Invalid');

  if (!validation.valid) {
    console.log('Errors:', validation.errors);
  }

  // Assertions
  if (!config.metrics.url.includes('eu-west-0')) {
    throw new Error('Expected custom EU region URL');
  }
  if (!validation.valid) {
    throw new Error('Configuration should be valid');
  }

  console.log('\n✓ Custom URLs configuration test passed\n');
}

// Test invalid configuration
function testInvalidConfig() {
  console.log('\n=== Testing Invalid Configuration ===\n');

  const env: Env = {
    CARDINALITY_KV: {} as any,
    GRAFANA_CLOUD_INSTANCE_ID: '123456'
    // Missing API_KEY - should fail validation
  };

  const manager = new DestinationManager(env);
  const validation = manager.validateConfig();

  console.log('Validation:', validation.valid ? '✓ Valid' : '✗ Invalid');
  console.log('Errors:', validation.errors);

  // Assertions
  if (validation.valid) {
    throw new Error('Expected invalid configuration');
  }
  if (!validation.errors.includes('Grafana Cloud API Key is required')) {
    throw new Error('Expected API Key error');
  }

  console.log('\n✓ Invalid configuration test passed\n');
}

// Run all tests
async function runTests() {
  console.log('========================================');
  console.log('OpenQoE Worker Configuration Validator');
  console.log('========================================');

  try {
    testSelfHostedConfig();
    testGrafanaCloudConfig();
    testGrafanaCloudCustomURLs();
    testInvalidConfig();

    console.log('\n========================================');
    console.log('✓ All tests passed!');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
