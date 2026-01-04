# Code Quality & Security Scanning Guide

**Complete guide for scanning code quality, security vulnerabilities, and duplications across your entire repository.**

---

## Table of Contents

1. [SonarQube/SonarScanner](#1-sonarqube--sonarscanner)
2. [Semgrep](#2-semgrep)
3. [Snyk](#3-snyk)
4. [Running All Checks Together](#4-running-all-checks-together)
5. [CI/CD Integration](#5-cicd-integration)
6. [Interpreting Results](#6-interpreting-results)

---

## 1. SonarQube / SonarScanner

**What it checks:**

- Code smells (maintainability issues)
- Bugs and potential runtime errors
- Security vulnerabilities and hotspots
- Code duplications
- Code coverage (if test reports provided)
- Technical debt
- Code complexity

### Installation

**Option A: Using Docker (Recommended for Local)**

```bash
# Start SonarQube server
docker run -d --name sonarqube \
  -p 9000:9000 \
  sonarqube:latest

# Wait ~60 seconds for startup, then access http://localhost:9000
# Default credentials: admin/admin (change on first login)
```

**Option B: SonarScanner CLI Only (requires existing SonarQube server)**

```bash
# Linux
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
unzip sonar-scanner-cli-5.0.1.3006-linux.zip
export PATH=$PATH:$(pwd)/sonar-scanner-5.0.1.3006-linux/bin

# macOS
brew install sonar-scanner

# Docker (no installation needed)
# Use: docker run --rm -v $(pwd):/usr/src sonarsource/sonar-scanner-cli
```

### Configuration

Create `sonar-project.properties` in your repository root:

```properties
# Project identification
sonar.projectKey=cloro-master
sonar.projectName=CloroMaster
sonar.projectVersion=1.0

# Source code location
sonar.sources=.
sonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/bin/**,**/obj/**,**/*.test.js,**/*.spec.js

# Encoding
sonar.sourceEncoding=UTF-8

# Language-specific settings
# Backend (.NET)
sonar.cs.opencover.reportsPaths=**/coverage.opencover.xml

# Frontend (JavaScript/React)
sonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info
sonar.typescript.lcov.reportPaths=frontend/coverage/lcov.info

# Quality gates
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300
```

### Generate Authentication Token

```bash
# Access SonarQube UI at http://localhost:9000
# Go to: My Account > Security > Generate Tokens
# Save the token (e.g., squ_abc123...)
```

### Run Analysis

```bash
# Set authentication token
export SONAR_TOKEN="your_token_here"

# Run scanner
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN

# Or using Docker
docker run --rm \
  --network host \
  -v $(pwd):/usr/src \
  -e SONAR_TOKEN=$SONAR_TOKEN \
  sonarsource/sonar-scanner-cli \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN
```

### View Results

```bash
# Access the web dashboard
open http://localhost:9000/dashboard?id=cloro-master

# Or view in terminal (basic info)
sonar-scanner -Dsonar.verbose=true
```

### Quality Gate Configuration

In SonarQube UI: `Quality Gates > Create`

Example thresholds:

- **Coverage:** < 80% = Failed
- **Duplications:** > 3% = Failed
- **Maintainability Rating:** Worse than A = Failed
- **Reliability Rating:** Worse than A = Failed
- **Security Rating:** Worse than A = Failed
- **Security Hotspots Reviewed:** < 100% = Failed

### Fail Build on Quality Gate

```bash
# The scanner will exit with non-zero code if quality gate fails
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN \
  -Dsonar.qualitygate.wait=true

# Check exit code
if [ $? -ne 0 ]; then
  echo "Quality gate failed!"
  exit 1
fi
```

---

## 2. Semgrep

**What it checks:**

- Security vulnerabilities (OWASP Top 10)
- Code patterns and anti-patterns
- Framework-specific issues (React, .NET, etc.)
- Custom rule violations
- API misuse
- Performance issues

### Installation

```bash
# Using pip (Python required)
pip install semgrep

# Using Homebrew (macOS)
brew install semgrep

# Using Docker (no installation)
# docker run --rm -v $(pwd):/src returntocorp/semgrep semgrep
```

### Configuration

Create `.semgreprc` or use CLI flags directly.

**Option 1: Use predefined rulesets**

```bash
# No config file needed - specify rules in command
```

**Option 2: Create `.semgrep.yml`** (custom rules)

```yaml
rules:
  - id: hardcoded-password
    pattern: password = "..."
    message: Hardcoded password detected
    severity: ERROR
    languages: [javascript, python, csharp]
    
  - id: sql-injection
    pattern: |
      $DB.query($USER_INPUT)
    message: Possible SQL injection
    severity: ERROR
    languages: [javascript, python, csharp]
```

### Run Analysis

**Scan entire repository with multiple rulesets:**

```bash
# Auto-scan with recommended rules
semgrep --config=auto .

# Security-focused scan
semgrep --config=p/security-audit \
        --config=p/owasp-top-ten \
        --config=p/cwe-top-25 \
        .

# Language-specific scans
semgrep --config=p/javascript \
        --config=p/react \
        --config=p/typescript \
        ./frontend

semgrep --config=p/csharp \
        --config=p/dotnet \
        ./backend

# Exclude files
semgrep --config=auto \
        --exclude='node_modules' \
        --exclude='*.test.js' \
        --exclude='build' \
        .

# Save results as JSON
semgrep --config=auto --json -o semgrep-results.json .

# Save results as SARIF (for GitHub integration)
semgrep --config=auto --sarif -o semgrep-results.sarif .
```

### Using Docker

```bash
docker run --rm -v $(pwd):/src returntocorp/semgrep \
  semgrep --config=p/security-audit --config=p/owasp-top-ten /src
```

### Fail Build on Issues

```bash
# Exit with non-zero code if issues found
semgrep --config=auto --error .

# Or check manually
semgrep --config=auto --json . > results.json
ERROR_COUNT=$(cat results.json | jq '.results | length')

if [ "$ERROR_COUNT" -gt 0 ]; then
  echo "Found $ERROR_COUNT security issues!"
  exit 1
fi
```

### View Results

```bash
# Terminal output (default)
semgrep --config=auto .

# Detailed output
semgrep --config=auto --verbose .

# Only show errors (not warnings)
semgrep --config=auto --severity=ERROR .

# Pretty format
semgrep --config=auto --output=json . | jq '.'
```

---

## 3. Snyk

**What it checks:**

- Dependency vulnerabilities (SCA - Software Composition Analysis)
- Security issues in code (SAST - Static Application Security Testing)
- Container image vulnerabilities
- Infrastructure as Code (IaC) misconfigurations
- License compliance issues

### Installation

```bash
# Using npm (Node.js required)
npm install -g snyk

# Using Homebrew (macOS)
brew install snyk

# Using curl (Linux)
curl -L https://static.snyk.io/cli/latest/snyk-linux -o snyk
chmod +x snyk
sudo mv snyk /usr/local/bin/

# Verify installation
snyk --version
```

### Authentication

```bash
# Authenticate with Snyk
snyk auth

# Or use API token
export SNYK_TOKEN="your-token-here"
snyk config set api=$SNYK_TOKEN
```

### Configuration

Create `.snyk` file (optional - for ignoring vulnerabilities):

```yaml
# Snyk configuration file
version: v1.22.0
ignore:
  # Example: Ignore a specific vulnerability until date
  'SNYK-JS-AXIOS-1234567':
    - '*':
        reason: 'Fix not available, risk accepted'
        expires: '2026-06-01'

# Language settings
language-settings:
  javascript:
    ignore-unmanaged: true
```

### Run Analysis

**1. Dependency Scanning (Open Source Vulnerabilities)**

```bash
# Scan dependencies - Frontend
cd frontend
snyk test --all-projects

# Scan dependencies - Backend
cd ../backend
snyk test --all-projects

# Scan entire repository recursively
cd ..
snyk test --all-projects --detection-depth=4

# Output as JSON
snyk test --json > snyk-deps-result.json

# Fail on high/critical severity only
snyk test --severity-threshold=high
```

**2. Code Scanning (SAST)**

```bash
# Scan source code for security issues
snyk code test

# Scan specific directory
snyk code test ./frontend/src
snyk code test ./backend/src

# Output as JSON
snyk code test --json > snyk-code-result.json
```

**3. Container Scanning**

```bash
# Scan Docker images
snyk container test cloro-master-backend:latest
snyk container test cloro-master-frontend:latest

# Scan Dockerfile
snyk container test --file=Dockerfile cloro-master-backend:latest
```

**4. Infrastructure as Code Scanning**

```bash
# Scan Kubernetes manifests
snyk iac test k8s/

# Scan Docker Compose
snyk iac test docker-compose.yml

# Scan Terraform (if applicable)
snyk iac test infrastructure/
```

### Comprehensive Scan Script

```bash
#!/bin/bash
# scan-snyk-all.sh

set -e

echo "=== Snyk Full Repository Scan ==="

# Dependencies
echo "Scanning dependencies..."
snyk test --all-projects --severity-threshold=high || true

# Code
echo "Scanning source code..."
snyk code test || true

# Docker images (if built)
echo "Scanning Docker images..."
if docker images | grep -q "cloro-master-backend"; then
  snyk container test cloro-master-backend:latest || true
fi

if docker images | grep -q "cloro-master-frontend"; then
  snyk container test cloro-master-frontend:latest || true
fi

# IaC
echo "Scanning Infrastructure as Code..."
snyk iac test k8s/ || true
snyk iac test docker-compose.yml || true

echo "=== Scan complete ==="
```

### Fail Build on Vulnerabilities

```bash
# Fail if any high/critical vulnerabilities found
snyk test --severity-threshold=high

# Fail if any vulnerabilities found
snyk test --severity-threshold=low

# Combine with code scan
snyk test --severity-threshold=high && snyk code test
```

### View Results

```bash
# View in terminal (default)
snyk test

# Open results in Snyk web UI
snyk monitor

# View detailed JSON
snyk test --json | jq '.'

# Count vulnerabilities
snyk test --json | jq '.vulnerabilities | length'

# Filter high severity
snyk test --json | jq '.vulnerabilities[] | select(.severity=="high")'
```

---

## 4. Running All Checks Together

### Complete Scan Script

Create `scripts/scan-all.sh`:

```bash
#!/bin/bash
# Complete code quality and security scan

set -e

FAIL=0
PROJECT_ROOT=$(pwd)

echo "======================================"
echo "   Full Repository Quality Scan"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Semgrep - Security patterns
echo -e "${YELLOW}[1/3] Running Semgrep security scan...${NC}"
if semgrep --config=p/security-audit \
           --config=p/owasp-top-ten \
           --config=p/cwe-top-25 \
           --exclude='node_modules' \
           --exclude='build' \
           --json -o semgrep-results.json \
           . ; then
  SEMGREP_COUNT=$(cat semgrep-results.json | jq '.results | length')
  echo -e "${GREEN}✓ Semgrep complete: $SEMGREP_COUNT issues found${NC}"
  if [ "$SEMGREP_COUNT" -gt 0 ]; then
    FAIL=1
    echo -e "${RED}✗ Security issues detected!${NC}"
  fi
else
  echo -e "${RED}✗ Semgrep scan failed${NC}"
  FAIL=1
fi
echo ""

# 2. Snyk - Dependencies & Code
echo -e "${YELLOW}[2/3] Running Snyk scans...${NC}"

# Snyk Dependencies
echo "  → Scanning dependencies..."
if snyk test --all-projects --severity-threshold=high --json > snyk-deps-result.json; then
  echo -e "${GREEN}  ✓ No high/critical dependency vulnerabilities${NC}"
else
  VULN_COUNT=$(cat snyk-deps-result.json | jq '[.vulnerabilities[]?] | length' 2>/dev/null || echo "unknown")
  echo -e "${RED}  ✗ Dependency vulnerabilities found: $VULN_COUNT${NC}"
  FAIL=1
fi

# Snyk Code
echo "  → Scanning source code..."
if snyk code test --json > snyk-code-result.json; then
  echo -e "${GREEN}  ✓ No code security issues${NC}"
else
  CODE_ISSUES=$(cat snyk-code-result.json | jq '[.runs[]?.results[]?] | length' 2>/dev/null || echo "unknown")
  echo -e "${RED}  ✗ Code security issues found: $CODE_ISSUES${NC}"
  FAIL=1
fi

# Snyk IaC
echo "  → Scanning Infrastructure as Code..."
if snyk iac test k8s/ docker-compose.yml --json > snyk-iac-result.json 2>/dev/null; then
  echo -e "${GREEN}  ✓ No IaC misconfigurations${NC}"
else
  echo -e "${YELLOW}  ⚠ IaC issues detected (check report)${NC}"
fi
echo ""

# 3. SonarQube - Code Quality
echo -e "${YELLOW}[3/3] Running SonarQube analysis...${NC}"

# Check if SonarQube is running
if curl -s http://localhost:9000/api/system/status | grep -q "UP"; then
  if sonar-scanner \
       -Dsonar.host.url=http://localhost:9000 \
       -Dsonar.login=${SONAR_TOKEN} \
       -Dsonar.qualitygate.wait=true; then
    echo -e "${GREEN}✓ SonarQube analysis passed quality gate${NC}"
  else
    echo -e "${RED}✗ SonarQube quality gate failed${NC}"
    FAIL=1
  fi
else
  echo -e "${YELLOW}⚠ SonarQube server not running (skipped)${NC}"
  echo "  Start with: docker run -d --name sonarqube -p 9000:9000 sonarqube:latest"
fi
echo ""

# Summary
echo "======================================"
echo "           Scan Summary"
echo "======================================"
echo "Results saved:"
echo "  • semgrep-results.json"
echo "  • snyk-deps-result.json"
echo "  • snyk-code-result.json"
echo "  • snyk-iac-result.json"
echo "  • SonarQube: http://localhost:9000"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ All quality checks passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Quality checks failed - see reports above${NC}"
  exit 1
fi
```

Make it executable:

```bash
chmod +x scripts/scan-all.sh
```

### Run All Scans

```bash
./scripts/scan-all.sh
```

---

## 5. CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/code-quality.yml`:

```yaml
name: Code Quality & Security

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for SonarQube
      
      # Semgrep
      - name: Semgrep Security Scan
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/cwe-top-25
      
      # Snyk
      - name: Run Snyk Dependency Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Run Snyk Code Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: code test
      
      # SonarQube
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
      
      - name: SonarQube Quality Gate
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - scan

semgrep:
  stage: scan
  image: returntocorp/semgrep
  script:
    - semgrep --config=p/security-audit --config=p/owasp-top-ten --error .

snyk:
  stage: scan
  image: snyk/snyk:node
  script:
    - snyk auth $SNYK_TOKEN
    - snyk test --severity-threshold=high
    - snyk code test

sonarqube:
  stage: scan
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
      -Dsonar.host.url=$SONAR_HOST_URL
      -Dsonar.login=$SONAR_TOKEN
      -Dsonar.qualitygate.wait=true
```

---

## 6. Interpreting Results

### SonarQube Results

**Bugs:** Actual code errors that will cause runtime issues

- **Critical/Blocker:** Fix immediately
- **Major:** Fix before release

**Code Smells:** Maintainability issues

- **Critical:** Significant technical debt
- **Major:** Should be refactored

**Security Vulnerabilities:** Known security issues

- **Critical/Blocker:** Immediate fix required
- **Major/Minor:** Schedule fixes

**Security Hotspots:** Code that requires security review

- Review each and mark as "Safe" or "Fix"

**Duplications:**

- `> 3%` duplication = refactoring needed

**Coverage:**

- `< 80%` = increase test coverage

### Semgrep Results

```json
{
  "results": [
    {
      "check_id": "javascript.express.security.audit.xss.template-href-var",
      "path": "frontend/src/component.js",
      "start": {"line": 42},
      "end": {"line": 42},
      "extra": {
        "message": "Potential XSS vulnerability",
        "severity": "ERROR"
      }
    }
  ]
}
```

**Severities:**

- `ERROR`: Must fix (security/bug)
- `WARNING`: Should fix (code smell)
- `INFO`: Consider fixing (best practice)

### Snyk Results

**Dependency Scan:**

```
✗ High severity vulnerability found in axios@0.21.1
  Path: frontend > axios@0.21.1
  Fix: Upgrade to axios@0.21.2
```

**Code Scan:**

```
✗ SQL Injection
  Path: backend/src/api/users.js:45
  Description: User input directly in SQL query
  CWE-89
```

**Priority:**

1. **Critical:** Patch immediately
2. **High:** Fix within days
3. **Medium:** Schedule for next sprint
4. **Low:** Technical debt

---

## Quick Reference Commands

### Daily Development Scan

```bash
# Fast local scan (5-10 minutes)
semgrep --config=auto . && \
snyk test && \
snyk code test
```

### Pre-Commit Scan

```bash
# Scan only changed files
git diff --name-only | xargs semgrep --config=auto
```

### Full Weekly Scan

```bash
# Complete deep scan (30-60 minutes)
./scripts/scan-all.sh
```

### CI/CD Scan (Fail Fast)

```bash
# Exit on first failure
semgrep --config=p/security-audit --error . && \
snyk test --severity-threshold=high && \
sonar-scanner -Dsonar.qualitygate.wait=true
```

---

## Troubleshooting

### SonarQube Not Starting

```bash
# Check logs
docker logs sonarqube

# Increase memory (Linux)
sudo sysctl -w vm.max_map_count=262144

# Restart
docker restart sonarqube
```

### Semgrep Too Slow

```bash
# Scan only specific languages
semgrep --config=auto --lang=javascript --lang=typescript .

# Exclude large directories
semgrep --config=auto --exclude='node_modules' --exclude='build' .
```

### Snyk Authentication Issues

```bash
# Re-authenticate
snyk auth

# Or use token directly
export SNYK_TOKEN="your-token"
snyk test
```

---

## Summary

| Tool | Primary Focus | Scan Time | Setup Effort |
|------|--------------|-----------|--------------|
| **SonarQube** | Code quality, duplications, complexity | Medium (5-15 min) | High (server required) |
| **Semgrep** | Security patterns, OWASP, custom rules | Fast (1-5 min) | Low (CLI only) |
| **Snyk** | Dependencies, vulnerabilities, licenses | Fast (2-5 min) | Low (CLI + auth) |

**Recommended Workflow:**

1. **Development:** Semgrep + Snyk (fast feedback)
2. **Pre-Commit:** Semgrep on changed files
3. **CI/CD:** All three tools with quality gates
4. **Weekly:** Full SonarQube scan with detailed review

---

## Next Steps

1. Run `./scripts/scan-all.sh` to see current status
2. Set up quality gates in SonarQube
3. Integrate into CI/CD pipeline
4. Schedule regular full scans (weekly)
5. Review and fix critical issues first
6. Track metrics over time

**Quality Targets:**

- 0 critical vulnerabilities
- 0 high security issues
- < 3% code duplication
- > 80% test coverage
- A-rating for maintainability
