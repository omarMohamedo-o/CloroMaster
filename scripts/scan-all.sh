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
           --exclude='bin' \
           --exclude='obj' \
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

# Check if Snyk is authenticated
if ! snyk auth --check &>/dev/null; then
  echo -e "${YELLOW}⚠ Snyk not authenticated. Run 'snyk auth' first.${NC}"
  echo -e "${YELLOW}  Skipping Snyk scans...${NC}"
else
  # Snyk Dependencies
  echo "  → Scanning dependencies..."
  if snyk test --all-projects --severity-threshold=high --json > snyk-deps-result.json 2>/dev/null; then
    echo -e "${GREEN}  ✓ No high/critical dependency vulnerabilities${NC}"
  else
    VULN_COUNT=$(cat snyk-deps-result.json | jq '[.vulnerabilities[]?] | length' 2>/dev/null || echo "unknown")
    echo -e "${RED}  ✗ Dependency vulnerabilities found: $VULN_COUNT${NC}"
    FAIL=1
  fi

  # Snyk Code
  echo "  → Scanning source code..."
  if snyk code test --json > snyk-code-result.json 2>/dev/null; then
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
fi
echo ""

# 3. SonarQube - Code Quality
echo -e "${YELLOW}[3/3] Running SonarQube analysis...${NC}"

# Check if SonarQube is running
if curl -s http://localhost:9000/api/system/status 2>/dev/null | grep -q "UP"; then
  if [ -z "$SONAR_TOKEN" ]; then
    echo -e "${YELLOW}⚠ SONAR_TOKEN not set. Generate token at http://localhost:9000${NC}"
    echo -e "${YELLOW}  Skipping SonarQube scan...${NC}"
  else
    if sonar-scanner \
         -Dsonar.host.url=http://localhost:9000 \
         -Dsonar.login=${SONAR_TOKEN} \
         -Dsonar.qualitygate.wait=true 2>/dev/null; then
      echo -e "${GREEN}✓ SonarQube analysis passed quality gate${NC}"
    else
      echo -e "${RED}✗ SonarQube quality gate failed${NC}"
      FAIL=1
    fi
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
