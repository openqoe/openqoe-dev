#!/bin/bash

# Pre-deployment Validation Script
# Run this before deploying to catch configuration issues early

set -e  # Exit on error

echo "🔍 OpenQoE Worker - Pre-Deployment Validation"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Helper functions
error() {
    echo -e "${RED}✗ ERROR: $1${NC}"
    ((errors++))
}

warn() {
    echo -e "${YELLOW}⚠ WARNING: $1${NC}"
    ((warnings++))
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

info() {
    echo "ℹ $1"
}

echo "1. Checking wrangler.toml configuration..."
echo "-------------------------------------------"

# Check if wrangler.toml exists
if [ ! -f "wrangler.toml" ]; then
    error "wrangler.toml not found"
else
    success "wrangler.toml exists"

    # Check for placeholder values
    if grep -q "your-worker-name" wrangler.toml; then
        error "wrangler.toml contains placeholder worker name 'your-worker-name'"
    fi

    if grep -q "your_kv_namespace_id" wrangler.toml; then
        error "wrangler.toml contains placeholder KV namespace ID 'your_kv_namespace_id'"
    fi

    if grep -q "example.com" wrangler.toml; then
        warn "wrangler.toml contains example.com route (update for production)"
    fi
fi

echo ""
echo "2. Checking environment configuration..."
echo "-------------------------------------------"

# Check if .dev.vars exists for local development
if [ -f ".dev.vars" ]; then
    success ".dev.vars file exists for local development"

    # Parse .dev.vars and check for required variables
    if grep -q "^GRAFANA_CLOUD_INSTANCE_ID=" .dev.vars && \
       grep -q "^GRAFANA_CLOUD_API_KEY=" .dev.vars && \
       grep -q "^GRAFANA_CLOUD_METRICS_URL=" .dev.vars && \
       grep -q "^GRAFANA_CLOUD_LOGS_URL=" .dev.vars; then
        info "Grafana Cloud configuration detected in .dev.vars"
    elif grep -q "^MIMIR_URL=" .dev.vars || grep -q "^PROMETHEUS_URL=" .dev.vars; then
        info "Self-hosted configuration detected in .dev.vars"
    else
        warn "No destination configuration found in .dev.vars (worker may fail to start)"
    fi
else
    warn ".dev.vars not found - create from .dev.vars.example for local testing"
fi

# Check for example files
if [ -f ".dev.vars.grafanacloud.example" ]; then
    success "Grafana Cloud example configuration exists"
fi

echo ""
echo "3. Running TypeScript type checking..."
echo "-------------------------------------------"

if npm run type-check; then
    success "TypeScript type checking passed"
else
    error "TypeScript type checking failed"
fi

echo ""
echo "4. Checking dependencies..."
echo "-------------------------------------------"

if [ ! -d "node_modules" ]; then
    warn "node_modules not found - run 'npm install'"
else
    success "Dependencies installed"
fi

# Check for outdated critical dependencies
info "Checking for security vulnerabilities..."
if npm audit --audit-level=high 2>/dev/null; then
    success "No high-severity vulnerabilities found"
else
    warn "Security vulnerabilities detected - run 'npm audit' for details"
fi

echo ""
echo "5. Validating source files..."
echo "-------------------------------------------"

required_files=(
    "src/index.ts"
    "src/config.ts"
    "src/destinations.ts"
    "src/prometheus.ts"
    "src/loki.ts"
    "src/validation.ts"
    "src/auth.ts"
    "src/cardinality.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "$file exists"
    else
        error "$file is missing"
    fi
done

echo ""
echo "=============================================="
echo "Validation Summary"
echo "=============================================="

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Validation completed with $warnings warning(s).${NC}"
    echo "  Review warnings before deploying."
    exit 0
else
    echo -e "${RED}✗ Validation failed with $errors error(s) and $warnings warning(s).${NC}"
    echo "  Fix errors before deploying."
    exit 1
fi
