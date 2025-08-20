#!/bin/bash

# Pre-commit hook script
# This script runs before every commit to ensure code quality

echo "🔍 Running pre-commit checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in a Node.js project directory"
    exit 1
fi

# 1. Type checking
echo "📝 Running TypeScript type check..."
if npm run type-check > /dev/null 2>&1; then
    print_status "TypeScript type check passed"
else
    print_error "TypeScript type check failed"
    npm run type-check
    exit 1
fi

# 2. Linting
echo "🔧 Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    print_status "ESLint check passed"
else
    print_warning "ESLint found issues. Attempting to fix..."
    if npm run lint:fix > /dev/null 2>&1; then
        print_status "ESLint issues auto-fixed"
        # Re-run lint to make sure everything is clean
        if npm run lint > /dev/null 2>&1; then
            print_status "ESLint check passed after fixes"
        else
            print_error "ESLint issues remain after auto-fix"
            npm run lint
            exit 1
        fi
    else
        print_error "ESLint issues could not be auto-fixed"
        npm run lint
        exit 1
    fi
fi

# 3. Quick tests
echo "🧪 Running quick tests..."
if npm run test:quick > /dev/null 2>&1; then
    print_status "Quick tests passed"
else
    print_error "Quick tests failed"
    npm run test:quick
    exit 1
fi

# 4. Check for console.log statements (optional)
echo "🔍 Checking for console.log statements..."
if grep -r "console\.log" src/ --exclude-dir=node_modules > /dev/null 2>&1; then
    print_warning "Found console.log statements in source code"
    echo "Consider removing them before production:"
    grep -r "console\.log" src/ --exclude-dir=node_modules
else
    print_status "No console.log statements found"
fi

# 5. Check for TODO comments
echo "📋 Checking for TODO comments..."
if grep -r "TODO" src/ --exclude-dir=node_modules > /dev/null 2>&1; then
    print_warning "Found TODO comments in source code"
    echo "Consider addressing them:"
    grep -r "TODO" src/ --exclude-dir=node_modules
else
    print_status "No TODO comments found"
fi

# 6. Check file size (optional)
echo "📏 Checking for large files..."
find src/ -name "*.ts" -size +100k 2>/dev/null | while read file; do
    print_warning "Large file detected: $file"
done

print_status "All pre-commit checks passed! 🎉"
echo "You can now commit your changes safely."

exit 0
