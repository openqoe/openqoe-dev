# Contributing to OpenQoE

Thank you for your interest in contributing to OpenQoE! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Improving Documentation](#improving-documentation)
  - [Contributing Code](#contributing-code)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Conventions](#commit-message-conventions)
- [Community Guidelines](#community-guidelines)

---

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be collaborative**: Work together to achieve common goals
- **Be inclusive**: Welcome and support people of all backgrounds
- **Be constructive**: Provide helpful feedback and criticism
- **Be patient**: Remember that everyone is learning

We do not tolerate harassment, discrimination, or unprofessional behavior of any kind.

---

## How Can I Contribute?

### Reporting Bugs

Found a bug? Help us fix it by submitting a detailed bug report.

**Before submitting a bug report:**

- Check the [existing issues](https://github.com/openqoe/openqoe-dev/issues) to avoid duplicates
- Verify the bug exists in the latest version
- Collect relevant information (logs, screenshots, environment details)

**When submitting a bug report, include:**

- **Clear title**: Descriptive summary of the issue
- **Description**: Detailed explanation of what went wrong
- **Steps to reproduce**: Exact steps to trigger the bug
- **Expected behavior**: What should have happened
- **Actual behavior**: What actually happened
- **Environment**:
  - OpenQoE version
  - Node.js version
  - Go Version
  - Browser (if SDK-related)
  - Operating system
  - Deployment environment (self-hosted/Grafana Cloud)
- **Logs**: Relevant error messages or stack traces
- **Screenshots**: If applicable

**Example Bug Report:**

### Description

After deploying the Go worker, the Grafana dashboards show "No Data" despite events being sent from the SDK.

### Steps to Reproduce

1. Start all components: `docker compose up -d`
2. Configure SDK with worker URL
3. Generate test events
4. Open VOD Monitoring dashboard
5. All panels show "No Data"

### Expected Behavior

Dashboard panels should display metrics within 1-2 minutes

### Actual Behavior

All panels remain empty after 10 minutes

### Environment

- OpenQoE version: 2.0.0
- Go version: 1.25.x
- Deployment: Go Worker + Grafana Alloy + Mimir
- Browser: Chrome 120

### Logs

Worker logs show: `Sent 45 time series to Prometheus`
Mimir logs show: `Authentication failed`

### Additional Context

Using self-hosted Mimir with default configuration

````

---

### Suggesting Features

Have an idea to improve OpenQoE? We'd love to hear it!

**Before suggesting a feature:**
- Check [existing discussions](https://github.com/openqoe/openqoe-dev/discussions) to see if it's been proposed
- Consider whether it fits the project's scope and goals
- Think about how it would benefit other users

**When suggesting a feature, include:**
- **Clear title**: Brief description of the feature
- **Problem statement**: What problem does this solve?
- **Proposed solution**: How would this feature work?
- **Alternatives considered**: Other approaches you've thought about
- **Use case**: Real-world scenario where this would be valuable
- **Implementation ideas**: If you have technical suggestions

**Example Feature Request:**
```markdown
## Feature: Add support for YouTube IFrame API

### Problem Statement
Many video platforms use the YouTube IFrame API for embedded videos, but OpenQoE currently doesn't support it.

### Proposed Solution
Create a new player adapter (`adapters/youtube.ts`) that integrates with the YouTube IFrame API to capture QoE events.

### Use Case
A learning platform embeds YouTube videos and wants to monitor playback quality and engagement.

### Implementation Ideas
- Use `onStateChange` event to detect play/pause/buffer
- Track playback quality changes via `getPlaybackQuality()`
- Monitor errors through `onError` event
- Estimate startup time from `player.getDuration()` and first play event

### Alternatives Considered
- Using YouTube Analytics API (requires user OAuth, not suitable for real-time monitoring)
- Generic iframe monitoring (doesn't provide detailed QoE metrics)
````

---

### Improving Documentation

Documentation improvements are always welcome!

**Areas where you can help:**

- Fix typos, grammar, or formatting issues
- Clarify confusing sections
- Add missing examples or use cases
- Update outdated information
- Translate documentation to other languages
- Create tutorials or guides

**Documentation files:**

- `README.md` - Main project overview
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `SDK_INTEGRATION.md` - SDK integration guide
- `API_REFERENCE.md` - Worker API documentation
- `ARCHITECTURE.md` - System architecture
- `observability/GRAFANA_DASHBOARDS.md` - Dashboard documentation
- `observability/README.md` - Observability stack guide

**For documentation PRs:**

- Test any code examples you add
- Verify all hyperlinks work
- Follow the existing formatting style
- Run a spell-checker

---

### Contributing Code

Ready to write code? Awesome! Here's how to get started.

**Good first issues:**
Look for issues labeled `good first issue` or `help wanted` on our [issue tracker](https://github.com/openqoe/openqoe-dev/issues).

**Areas where we need help:**

- **SDK Adapters**: Support for additional video players
- **Worker Enhancements**: New features or optimizations
- **Dashboard Improvements**: New panels or visualizations
- **Testing**: Unit tests and integration tests
- **Performance**: Optimization and benchmarking
- **Security**: Security audits and improvements

---

## Development Setup

### Prerequisites

- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **Docker**: For running entire stack
- **Go**: v1.25.0 or higher
- **Git**: For version control

### Setup Instructions

1. **Fork and Clone**

   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/openqoe-dev.git
   cd openqoe-dev

   # Add upstream remote
   git remote add upstream https://github.com/openqoe/openqoe-dev.git
   ```

1. **Install Dependencies**

   ```bash
   # Build Go worker
   cd worker
   go mod download
   go build -o openqoe-worker

   # Install SDK dependencies
   cd ../sdk
   npm install
   ```

1. **Start Observability Stack**

   ```bash
   # From project root
   docker compose up -d
   ```

1. **Run Worker Locally**

   ```bash
   cd worker
   cp .env.example .env
   # Set OTEL_URL=http://localhost:4317
   ./openqoe-worker
   ```

1. **Test Your Changes**

   ```bash
   # Run TypeScript type checking
   npm run type-check

   # Run pre-deployment validation
   ./validate.sh

   # Test with demo pages
   cd ../demo
   npx http-server -p 8080
   # Visit http://localhost:8080 and test each player
   ```

1. **Access Grafana**
   ```bash
   # Open http://localhost:3000
   # Login: admin / admin
   # Navigate to Dashboards to see metrics
   ```

---

## Pull Request Process

### Before Submitting

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow coding standards (see below)
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**

   ```bash
   # TypeScript compilation
   npm run type-check

   # Validation script (for worker)
   ./validate.sh

   # Manual testing with demo pages
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add support for YouTube IFrame API"
   ```

5. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Submitting the PR

1. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**
   - Use a clear, descriptive title
   - Reference related issues (e.g., "Fixes #123")
   - Provide detailed description of changes
   - Include screenshots or examples if applicable
   - Mark as draft if work is in progress

3. **PR Template**

   ```markdown
   ## Description

   Brief description of what this PR does

   ## Related Issues

   Fixes #123
   Related to #456

   ## Type of Change

   - [ ] Bug fix (non-breaking change that fixes an issue)
   - [ ] New feature (non-breaking change that adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update

   ## Testing Done

   - [ ] Tested locally with demo pages
   - [ ] Verified TypeScript compilation passes
   - [ ] Ran validation script
   - [ ] Tested with self-hosted stack
   - [ ] Verified dashboards show data correctly

   ## Screenshots (if applicable)

   ## Checklist

   - [ ] My code follows the project's coding standards
   - [ ] I have updated documentation accordingly
   - [ ] I have added/updated tests (if applicable)
   - [ ] All new and existing tests pass
   - [ ] My commits follow the commit message conventions
   ```

### PR Review Process

- **Automated checks**: CI will run TypeScript compilation and validation
- **Code review**: Maintainers will review your code and provide feedback
- **Revisions**: Address feedback by pushing additional commits
- **Approval**: Once approved, a maintainer will merge your PR
- **Recognition**: Your contribution will be acknowledged in release notes

---

## Coding Standards

### TypeScript

- **Strict mode**: Always use TypeScript strict mode
- **Type safety**: Avoid `any` types; use proper type definitions
- **Interfaces**: Define interfaces for all data structures
- **Naming conventions**:
  - Classes: PascalCase (`PrometheusService`)
  - Functions/methods: camelCase (`transformEvents`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
  - Interfaces: PascalCase (`BaseEvent`)
  - Files: kebab-case (`prometheus-service.ts`)

### Code Style

- **Indentation**: 2 spaces (no tabs)
- **Line length**: Max 120 characters
- **Semicolons**: Always use semicolons
- **Quotes**: Use single quotes for strings (except JSON)
- **Async/await**: Prefer async/await over promises
- **Error handling**: Always handle errors gracefully

### Documentation

- **Function comments**: Use JSDoc for public functions

  ```typescript
  /**
   * Transform events to Prometheus metrics
   * @param events Array of BaseEvent objects
   * @returns Array of PrometheusTimeSeries
   */
  async transformEvents(events: BaseEvent[]): Promise<PrometheusTimeSeries[]> {
    // Implementation
  }
  ```

- **Inline comments**: Explain complex logic
  ```typescript
  // Use histogram for accurate percentile calculations (P50, P95, P99)
  // Buckets: 0.5s, 1s, 2s, 3s, 5s, 10s, 15s, 30s
  const vstHistogram = await this.createHistogram(
    "openqoe_video_startup_seconds",
    baseLabels,
    event.data.video_startup_time / 1000,
    timestamp,
    [0.5, 1, 2, 3, 5, 10, 15, 30],
  );
  ```

### Security

- **Input validation**: Always validate and sanitize user input
- **Authentication**: Use secure authentication methods (header-based, not query params)
- **Secrets**: Never commit secrets or API keys to git
- **XSS prevention**: Escape user-generated content
- **Timeouts**: Add timeouts to all HTTP requests (10 seconds)
- **Rate limiting**: Implement rate limiting where appropriate

### Example Code

```typescript
/**
 * Example of well-formatted code following our standards
 */
export class VideoMetricsService {
  private config: Config;
  private readonly TIMEOUT_MS = 10000;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Calculate video startup time percentile
   * @param events Array of playing events
   * @param percentile Percentile to calculate (0-1)
   * @returns Percentile value in seconds
   */
  async calculateVSTPercentile(
    events: PlayingEvent[],
    percentile: number,
  ): Promise<number> {
    if (events.length === 0) {
      throw new Error("No events provided");
    }

    // Sort by video startup time
    const sortedTimes = events
      .filter((e) => e.data?.video_startup_time)
      .map((e) => e.data.video_startup_time / 1000)
      .sort((a, b) => a - b);

    // Calculate percentile index
    const index = Math.ceil(sortedTimes.length * percentile) - 1;

    return sortedTimes[index];
  }
}
```

---

## Testing Guidelines

### Manual Testing

**For SDK changes:**

1. Test with all 5 player demo pages
2. Verify all 12 event types are captured
3. Check browser console for errors
4. Verify events reach worker (check worker logs)
5. Confirm metrics appear in Grafana dashboards

**For Worker changes:**

1. Run validation script: `./validate.sh`
2. Test with sample events via curl:
   ```bash
   curl -X POST http://localhost:8787/v1/events \
     -H "Content-Type: application/json" \
     -H "X-API-Key: test-key" \
     -d @test-event.json
   ```
3. Verify metrics in Mimir:
   ```bash
   curl 'http://localhost:9009/prometheus/api/v1/query?query=openqoe_events_total'
   ```
4. Check dashboard data in Grafana

**For Dashboard changes:**

1. Load rules: `./load-rules.sh`
2. Generate test data
3. Open dashboard in Grafana
4. Verify all panels populate correctly
5. Test template variables (org_id, video_id, etc.)
6. Check query performance (Query Inspector)

### Unit Testing

We use standard testing frameworks:

- **Worker**: Vitest
- **SDK**: Jest

**Example unit test:**

```typescript
import { describe, it, expect } from "vitest";
import { PrometheusService } from "./prometheus";

describe("PrometheusService", () => {
  it("should transform viewstart event to metric", async () => {
    const service = new PrometheusService(config, cardinalityService);
    const event: BaseEvent = {
      event_type: "viewstart",
      org_id: "test-org",
      player_id: "test-player",
      event_time: Date.now(),
      // ... other fields
    };

    const metrics = await service.eventToMetrics(event);

    expect(metrics).toHaveLength(2); // events_total + views_started_total
    expect(metrics[1].labels.find((l) => l.name === "__name__")?.value).toBe(
      "openqoe_views_started_total",
    );
  });
});
```

### Integration Testing

**Full end-to-end test:**

1. Start observability stack
2. Start worker locally
3. Load SDK in browser (demo page)
4. Play video and trigger events
5. Verify data flows through entire pipeline:
   - SDK → Worker → Mimir → Grafana
6. Check dashboard metrics match expected values

---

## Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear git history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, config, etc.)
- `ci`: CI/CD changes
- `revert`: Revert previous commit

### Scope

Optional, indicates what area of code is affected:

- `sdk`: SDK changes
- `worker`: Worker changes
- `dashboards`: Dashboard changes
- `docs`: Documentation
- `config`: Configuration files
- `deps`: Dependencies

### Examples

```bash
# Feature
feat(sdk): add YouTube IFrame API adapter

Implements full YouTube IFrame API integration with support for all 12 QoE events.
Includes state tracking, quality change detection, and error handling.

Closes #123

# Bug fix
fix(worker): resolve histogram bucket calculation error

Histogram buckets were not incrementing correctly for values at bucket boundaries.
Changed comparison from < to <= to match Prometheus histogram semantics.

Fixes #456

# Documentation
docs(readme): update quick start guide with Docker commands

Added missing docker compose commands and verification steps.

# Refactoring
refactor(worker): extract cardinality logic to separate service

Moved cardinality governance logic from prometheus.ts to dedicated
CardinalityService for better separation of concerns.

# Performance
perf(worker): optimize label extraction for high-volume events

Reduced label processing time by 40% through caching and deduplication.
```

---

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions, ideas, and general discussion
- **Pull Requests**: Code contributions and reviews

### Getting Help

- **Documentation**: Start with our comprehensive docs
- **Search first**: Check existing issues and discussions
- **Be specific**: Provide detailed context and examples
- **Be patient**: Maintainers are volunteers

### Recognition

We value all contributions and recognize contributors through:

- **Contributors list**: All contributors listed in README
- **Release notes**: Contributions acknowledged in release notes
- **Shoutouts**: Recognition in project updates

---

## Questions?

If you have questions about contributing, feel free to:

- Open a [GitHub Discussion](https://github.com/openqoe/openqoe-dev/discussions)
- Check our [FAQ](https://github.com/openqoe/openqoe-dev/wiki/FAQ)
- Review existing [Pull Requests](https://github.com/openqoe/openqoe-dev/pulls) for examples

Thank you for contributing to OpenQoE! Your help makes this project better for everyone.
