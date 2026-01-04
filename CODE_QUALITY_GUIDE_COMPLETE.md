# Complete Code Quality Guide for Git Repositories

**Senior DevOps / Software Quality Engineer Guide**

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Tool 1: Snyk - Security & Vulnerability Scanning](#tool-1-snyk)
3. [Tool 2: ESLint - Code Quality & Standards](#tool-2-eslint)
4. [Tool 3: jscpd - Code Duplication Detection](#tool-3-jscpd)
5. [Tool 4: SonarQube - Comprehensive Analysis](#tool-4-sonarqube)
6. [Tool 5: Semgrep - Security Pattern Matching](#tool-5-semgrep)
7. [Setting Quality Gates](#quality-gates)
8. [CI/CD Integration](#cicd-integration)

---

## Prerequisites

**Required:**

- Git repository
- Docker installed
- Node.js/npm (for frontend projects)
- Basic CLI knowledge

**Verify installations:**

```bash
docker --version
git --version
node --version
npm --version
```

---

## Tool 1: Snyk - Security & Vulnerability Scanning

### What It Checks

- ✅ Dependency vulnerabilities (npm, pip, maven, etc.)
- ✅ Code security issues (injection, XSS, etc.)
- ✅ Container vulnerabilities
- ✅ Infrastructure as Code (IaC) misconfigurations
- ✅ License compliance

### Installation

```bash
# Option 1: npm (recommended)
npm install -g snyk

# Option 2: Homebrew (Mac)
brew install snyk

# Option 3: Download binary
curl -Lo snyk https://github.com/snyk/cli/releases/latest/download/snyk-linux
chmod +x snyk
sudo mv snyk /usr/local/bin/
```

### Authentication

```bash
# Login (opens browser)
snyk auth

# Or set token directly
export SNYK_TOKEN="your-token-here"
```

### Configuration File

Create `.snyk` in project root:

```yaml
# .snyk
version: v1.25.0
ignore:
  # Ignore specific vulnerabilities
  'SNYK-JS-AXIOS-1234567':
    - '*':
        reason: 'False positive - not exploitable in our context'
        expires: '2026-12-31'

exclude:
  # Exclude paths from scanning
  - test/**
  - node_modules/**
  - dist/**
  - build/**

language-settings:
  javascript:
    ignoreUnfixable: false
```

### CLI Commands

#### 1. Test Dependencies

```bash
# Scan dependencies in current directory
snyk test

# High severity only
snyk test --severity-threshold=high

# JSON output
snyk test --json > snyk-deps-result.json

# All projects (monorepo)
snyk test --all-projects
```

#### 2. Test Source Code

```bash
# Scan code for security issues
snyk code test

# Specific severity
snyk code test --severity-threshold=high

# JSON output
snyk code test --json > snyk-code-result.json
```

#### 3. Test Infrastructure as Code

```bash
# Scan IaC files (Kubernetes, Terraform, Docker)
snyk iac test

# Specific file
snyk iac test docker-compose.yml

# JSON output
snyk iac test --json > snyk-iac-result.json
```

#### 4. Test Container Images

```bash
# Scan Docker image
snyk container test nginx:latest

# With Dockerfile for better results
snyk container test myimage:tag --file=Dockerfile
```

#### 5. Fix Vulnerabilities

```bash
# Auto-fix dependencies (where possible)
snyk fix

# Monitor project (continuous monitoring)
snyk monitor
```

### Interpreting Results

```bash
# Example output:
✗ High severity vulnerability found in axios
  Description: Server-Side Request Forgery
  Info: https://snyk.io/vuln/SNYK-JS-AXIOS-1234567
  Introduced through: axios@0.21.0
  Fix: Upgrade to axios@0.21.2
```

**Severity Levels:**

- 🔴 **Critical**: Immediate action required
- 🟠 **High**: Fix soon
- 🟡 **Medium**: Plan to fix
- 🟢 **Low**: Fix when possible

### Quality Gate Example

```bash
#!/bin/bash
# Exit if high/critical vulnerabilities found
snyk test --severity-threshold=high || exit 1
```

---

## Tool 2: ESLint - Code Quality & Standards

### What It Checks

- ✅ Code style violations
- ✅ Potential bugs
- ✅ Best practices
- ✅ Accessibility issues (with plugins)
- ✅ React-specific issues

### Installation

```bash
cd your-project

# Install ESLint
npm install --save-dev eslint

# Initialize configuration
npx eslint --init
```

### Configuration File

Create `.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "react/prop-types": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

Create `.eslintignore`:

```
node_modules/
build/
dist/
coverage/
*.config.js
```

### CLI Commands

```bash
# Lint all files
npx eslint .

# Specific directory
npx eslint src/

# Specific file types
npx eslint src/ --ext .js,.jsx,.ts,.tsx

# Auto-fix issues
npx eslint src/ --fix

# JSON output
npx eslint src/ --format json > eslint-report.json

# Generate HTML report
npx eslint src/ --format html > eslint-report.html
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:report": "eslint src/ --format json > eslint-report.json"
  }
}
```

### Quality Gate Example

```bash
#!/bin/bash
# Fail build if linting errors exist
npm run lint || exit 1
```

---

## Tool 3: jscpd - Code Duplication Detection

### What It Checks

- ✅ Duplicated code blocks
- ✅ Copy-paste patterns
- ✅ Similar code structures
- ✅ Supports 150+ languages

### Installation

```bash
# Global
npm install -g jscpd

# Project-specific
npm install --save-dev jscpd
```

### Configuration File

Create `.jscpd.json`:

```json
{
  "threshold": 5,
  "reporters": ["html", "json", "console"],
  "ignore": [
    "**/node_modules/**",
    "**/build/**",
    "**/dist/**",
    "**/*.test.js",
    "**/*.spec.js"
  ],
  "format": ["javascript", "jsx", "typescript", "tsx"],
  "minLines": 5,
  "minTokens": 50,
  "output": "./jscpd-report"
}
```

### CLI Commands

```bash
# Scan entire project
npx jscpd .

# Specific directory
npx jscpd src/

# Custom thresholds
npx jscpd src/ --min-lines 10 --min-tokens 50

# Specific formats
npx jscpd src/ --format "javascript,jsx,typescript,tsx"

# JSON output
npx jscpd src/ --reporters json

# HTML report
npx jscpd src/ --reporters html,console

# Fail on threshold
npx jscpd src/ --threshold 5 --exitCode 1
```

### Interpreting Results

```
Clone found (javascript):
 - src/components/Header.jsx [10:1 - 25:3] (15 lines, 120 tokens)
   src/components/Footer.jsx [15:1 - 30:3]

┌────────────┬────────────────┬─────────────┬──────────────┬──────────────┐
│ Format     │ Files analyzed │ Clones found │ Duplicated % │ Status       │
├────────────┼────────────────┼──────────────┼──────────────┼──────────────┤
│ javascript │ 50             │ 8            │ 3.5%         │ ✅ Good      │
└────────────┴────────────────┴──────────────┴──────────────┴──────────────┘
```

**Thresholds:**

- < 3%: ✅ Excellent
- 3-5%: ✅ Good
- 5-10%: ⚠️ Needs improvement
- > 10%: ❌ Poor - refactor needed

### Quality Gate Example

```bash
#!/bin/bash
# Fail if duplication > 5%
npx jscpd src/ --threshold 5 --exitCode 1 || exit 1
```

---

## Tool 4: SonarQube - Comprehensive Analysis

### What It Checks

- ✅ Bugs and code smells
- ✅ Security vulnerabilities
- ✅ Code coverage
- ✅ Code complexity
- ✅ Maintainability ratings
- ✅ Technical debt

### Installation with Docker

```bash
# Start SonarQube server
docker run -d --name sonarqube \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:latest

# Wait for startup (30-60 seconds)
# Access: http://localhost:9000
# Default credentials: admin / admin
```

### Install SonarScanner

```bash
# Download
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip

# Extract
unzip sonar-scanner-cli-4.8.0.2856-linux.zip
sudo mv sonar-scanner-4.8.0.2856-linux /opt/sonar-scanner

# Add to PATH
export PATH="$PATH:/opt/sonar-scanner/bin"

# Verify
sonar-scanner --version
```

### Configuration File

Create `sonar-project.properties`:

```properties
# Project identification
sonar.projectKey=chloromaster
sonar.projectName=ChloroMaster
sonar.projectVersion=1.0

# Source code location
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.js,**/*.spec.js

# Exclusions
sonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/*.test.js
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js

# Language
sonar.language=js
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Server connection
sonar.host.url=http://localhost:9000
sonar.login=your-token-here

# Quality gate
sonar.qualitygate.wait=true
```

### CLI Commands

```bash
# Run analysis
sonar-scanner

# With custom properties
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your-token-here

# Check quality gate status
sonar-scanner -Dsonar.qualitygate.wait=true
```

### Generate Token

```bash
# 1. Login to SonarQube: http://localhost:9000
# 2. Go to: My Account > Security > Generate Tokens
# 3. Copy token and use in commands
```

### Quality Gate Configuration

In SonarQube UI:

1. Go to **Quality Gates**
2. Create/Edit gate:
   - **Bugs**: 0
   - **Vulnerabilities**: 0
   - **Code Smells**: < 50
   - **Coverage**: > 80%
   - **Duplications**: < 3%
   - **Maintainability Rating**: A

### Quality Gate Example

```bash
#!/bin/bash
# Run SonarQube analysis and check quality gate
sonar-scanner -Dsonar.qualitygate.wait=true || exit 1
```

---

## Tool 5: Semgrep - Security Pattern Matching

### What It Checks

- ✅ Security vulnerabilities (OWASP Top 10)
- ✅ Common bug patterns
- ✅ Code quality issues
- ✅ Custom rule matching
- ✅ Framework-specific issues

### Installation

```bash
# Pip (recommended)
pip3 install semgrep

# Homebrew
brew install semgrep

# Docker
docker pull returntocorp/semgrep

# Verify
semgrep --version
```

### Configuration File

Create `.semgrep.yml`:

```yaml
rules:
  - id: hardcoded-password
    pattern: password = "..."
    message: Hardcoded password detected
    severity: ERROR
    languages: [javascript, python]

  - id: sql-injection
    pattern: |
      db.query($SQL, ...)
    message: Possible SQL injection
    severity: WARNING
    languages: [javascript]

  - id: xss-vulnerability
    pattern: |
      innerHTML = $USER_INPUT
    message: XSS vulnerability
    severity: ERROR
    languages: [javascript]
```

### CLI Commands

```bash
# Scan with default rules
semgrep --config=auto .

# Security-focused scan
semgrep --config=p/security-audit .

# OWASP Top 10
semgrep --config=p/owasp-top-ten .

# JavaScript/TypeScript specific
semgrep --config=p/javascript .
semgrep --config=p/typescript .

# React specific
semgrep --config=p/react .

# Multiple rulesets
semgrep --config=p/security-audit --config=p/react .

# JSON output
semgrep --config=auto --json > semgrep-report.json

# Only show errors
semgrep --config=auto --severity ERROR .

# Exclude paths
semgrep --config=auto --exclude="test/*" --exclude="node_modules/*" .

# Custom rules
semgrep --config=.semgrep.yml .
```

### Pre-built Rule Sets

```bash
# List available rulesets
semgrep --config=auto --list

# Common rulesets:
# p/security-audit     - General security issues
# p/owasp-top-ten     - OWASP Top 10 vulnerabilities
# p/cwe-top-25        - CWE Top 25 vulnerabilities
# p/javascript        - JavaScript best practices
# p/react             - React-specific issues
# p/express           - Express.js security
# p/sql-injection     - SQL injection patterns
# p/xss               - Cross-site scripting
```

### Interpreting Results

```
severity:error rule:javascript.lang.security.audit.xss.direct-innerHTML.direct-innerHTML: XSS vulnerability
    Direct use of innerHTML detected
    File: src/components/Header.jsx:45
    
    43 | const content = userInput;
    44 | const element = document.getElementById('content');
    45 | element.innerHTML = content; // ❌ Vulnerable
    46 | 
```

### Quality Gate Example

```bash
#!/bin/bash
# Fail on any ERROR severity issues
semgrep --config=p/security-audit --severity ERROR . || exit 1
```

---

## Quality Gates

### Create Quality Gate Script

Create `scripts/quality-gate.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Running Code Quality Checks..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# 1. Dependency vulnerabilities
echo -e "\n${YELLOW}[1/6] Checking dependency vulnerabilities...${NC}"
if snyk test --severity-threshold=high; then
    echo -e "${GREEN}✓ No high/critical vulnerabilities${NC}"
else
    echo -e "${RED}✗ Vulnerabilities found${NC}"
    FAILED=1
fi

# 2. Code security
echo -e "\n${YELLOW}[2/6] Scanning code for security issues...${NC}"
if snyk code test --severity-threshold=high; then
    echo -e "${GREEN}✓ No security issues${NC}"
else
    echo -e "${RED}✗ Security issues found${NC}"
    FAILED=1
fi

# 3. ESLint
echo -e "\n${YELLOW}[3/6] Running ESLint...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ No linting errors${NC}"
else
    echo -e "${RED}✗ Linting errors found${NC}"
    FAILED=1
fi

# 4. Code duplication
echo -e "\n${YELLOW}[4/6] Checking code duplication...${NC}"
if npx jscpd src/ --threshold 5 --exitCode 1; then
    echo -e "${GREEN}✓ Duplication under threshold${NC}"
else
    echo -e "${RED}✗ Too much code duplication${NC}"
    FAILED=1
fi

# 5. Semgrep security scan
echo -e "\n${YELLOW}[5/6] Running Semgrep security scan...${NC}"
if semgrep --config=p/security-audit --severity ERROR .; then
    echo -e "${GREEN}✓ No security patterns detected${NC}"
else
    echo -e "${RED}✗ Security patterns found${NC}"
    FAILED=1
fi

# 6. Build check
echo -e "\n${YELLOW}[6/6] Building project...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    FAILED=1
fi

# Summary
echo -e "\n========================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All quality checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Quality checks failed${NC}"
    exit 1
fi
```

Make executable:

```bash
chmod +x scripts/quality-gate.sh
```

Run:

```bash
./scripts/quality-gate.sh
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/quality.yml`:

```yaml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check code duplication
        run: npx jscpd src/ --threshold 5 --exitCode 1

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit

      - name: Build
        run: npm run build

      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: quality-reports
          path: |
            eslint-report.json
            jscpd-report/
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - quality
  - build

variables:
  NODE_VERSION: "18"

quality:lint:
  stage: quality
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
  allow_failure: false

quality:duplication:
  stage: quality
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npx jscpd src/ --threshold 5 --exitCode 1
  allow_failure: false

quality:security:
  stage: quality
  image: returntocorp/semgrep
  script:
    - semgrep --config=p/security-audit --severity ERROR .
  allow_failure: false

quality:snyk:
  stage: quality
  image: snyk/snyk:node
  script:
    - npm ci
    - snyk test --severity-threshold=high
  allow_failure: false

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
```

---

## Complete Workflow Example

### Daily Development Workflow

```bash
# 1. Before committing
npm run lint:fix                    # Auto-fix style issues
npx jscpd src/                      # Check duplication

# 2. Before pushing
./scripts/quality-gate.sh           # Run all checks

# 3. Weekly security audit
snyk test --all-projects            # Check all dependencies
snyk code test                      # Scan code
semgrep --config=p/security-audit . # Pattern matching

# 4. Before release
npm audit                           # Dependency audit
npm run build                       # Production build
npx jscpd src/ --reporters html     # Generate duplication report
```

### Pre-commit Hook

Install husky:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

Create `package.json` config:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

---

## Summary: Quick Reference

### Essential Commands

```bash
# Security
snyk test --severity-threshold=high
snyk code test
semgrep --config=p/security-audit .

# Code Quality
npm run lint
npx jscpd src/ --threshold 5

# Build & Bundle
npm run build
ls -lh build/static/js/*.js

# Full Quality Gate
./scripts/quality-gate.sh
```

### Quality Thresholds

- **Security vulnerabilities**: 0 high/critical
- **Code duplication**: < 5%
- **ESLint errors**: 0
- **Bundle size**: < 500KB (main)
- **Test coverage**: > 80% (when implemented)

### Reports Location

- `eslint-report.json` - Linting issues
- `jscpd-report/` - Duplication analysis
- `snyk-*.json` - Security scans
- `semgrep-report.json` - Pattern matching

---

**✅ You now have a complete code quality pipeline!**
