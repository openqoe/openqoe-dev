#!/bin/bash

# Load OpenQoE recording rules into Mimir
# Usage: ./load-rules.sh [mimir-url]

set -e

MIMIR_URL="${1:-http://localhost:9009}"
RULES_FILE="$(dirname "$0")/openqoe-recording-rules.yml"

echo "Loading OpenQoE recording rules into Mimir..."
echo "Mimir URL: $MIMIR_URL"
echo "Rules file: $RULES_FILE"

# For Mimir without multi-tenancy, use the default tenant
TENANT="anonymous"

# Load rules via Mimir Ruler API
# Note: Mimir expects rules in a specific format per namespace
curl -X POST \
  "${MIMIR_URL}/prometheus/config/v1/rules/${TENANT}" \
  -H "Content-Type: application/yaml" \
  --data-binary "@${RULES_FILE}"

if [ $? -eq 0 ]; then
  echo "✓ Recording rules loaded successfully"

  # Verify rules were loaded
  echo ""
  echo "Verifying loaded rules..."
  curl -s "${MIMIR_URL}/prometheus/config/v1/rules/${TENANT}" | head -20
else
  echo "✗ Failed to load recording rules"
  exit 1
fi
