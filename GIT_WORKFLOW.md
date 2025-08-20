# Git Workflow & Testing Guide

## 🚀 Quick Start Commands

### Development Workflow
```bash
# Start development server
npm run dev

# Run tests before committing
npm run test:quick

# Run all tests
npm test

# Run specific test suites
npm run test:spotify
npm run test:auth
npm run test:users

# Check code quality
npm run lint
npm run type-check
```

## 📝 Git Commit Workflow

### 1. Before Every Commit
Always run these commands before committing:
```bash
# Quick tests (fastest)
npm run test:quick

# Full code quality check
npm run lint
npm run type-check

# If everything passes, commit
git add .
git commit -m "feat: add spotify integration"
```

### 2. Commit Message Convention
Use conventional commits format:
```
type(scope): description

Examples:
feat(spotify): add OAuth flow and API integration
fix(auth): resolve JWT token validation issue
test(spotify): add comprehensive test coverage
docs(readme): update API documentation
refactor(services): improve error handling
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `style`: Code style changes
- `perf`: Performance improvements

### 3. Branch Strategy
```bash
# Create feature branch
git checkout -b feat/spotify-integration

# Work on your feature
# ... make changes ...

# Test your changes
npm run test:spotify

# Commit frequently
git add .
git commit -m "feat(spotify): add OAuth configuration"

# Push to remote
git push origin feat/spotify-integration

# Create pull request
# ... merge when approved ...
```

## 🧪 Testing Strategy

### Test Categories
1. **Quick Tests** (`npm run test:quick`): Fast tests for pre-commit
2. **Unit Tests** (`npm run test:unit`): Service layer tests
3. **Integration Tests** (`npm run test:integration`): Route/API tests
4. **Feature Tests**: Specific feature test suites
5. **Full Test Suite** (`npm test`): All tests

### Test Commands
```bash
# Quick pre-commit tests
npm run test:quick

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test files
npm test -- --testPathPattern=spotify
npm test -- --testNamePattern="should connect to spotify"

# Run tests for specific features
npm run test:spotify
npm run test:auth
npm run test:users
```

### Test File Naming
- `*.test.ts` - Test files
- `*.spec.ts` - Alternative test files
- Tests should be co-located with source files

## 🔧 Development Best Practices

### 1. Code Quality Checks
```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type checking
npm run type-check

# All quality checks
npm run precommit
```

### 2. Database Operations
```bash
# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open database studio
npm run db:studio
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Set up test environment
cp env.example env.test
```

## 📊 Testing Coverage Goals

- **Minimum Coverage**: 80%
- **Critical Paths**: 95%+
- **New Features**: 90%+

### Coverage Report
```bash
npm run test:coverage
```

## 🚨 Pre-commit Hooks

The project includes pre-commit checks:
```bash
# This runs automatically before commits
npm run precommit
```

This includes:
- Linting
- Type checking
- Quick tests

## 🔄 Continuous Integration

### GitHub Actions (Recommended)
Create `.github/workflows/ci.yml`:
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
```

## 📋 Daily Workflow Checklist

### Morning Setup
- [ ] Pull latest changes: `git pull origin main`
- [ ] Install dependencies: `npm install`
- [ ] Run quick tests: `npm run test:quick`

### During Development
- [ ] Write tests first (TDD)
- [ ] Run tests frequently: `npm run test:watch`
- [ ] Commit small, focused changes
- [ ] Use descriptive commit messages

### Before Pushing
- [ ] Run full test suite: `npm test`
- [ ] Check code quality: `npm run lint && npm run type-check`
- [ ] Update documentation if needed
- [ ] Create meaningful commit messages

### Code Review
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] No TypeScript errors
- [ ] Adequate test coverage
- [ ] Documentation updated

## 🎯 Phase 5 Completion Checklist

For Spotify Integration (Phase 5):
- [ ] All Spotify routes tested
- [ ] Spotify service functions tested
- [ ] OAuth flow working
- [ ] API endpoints functional
- [ ] Error handling implemented
- [ ] Database operations tested
- [ ] Documentation updated

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run test:watch            # Watch mode tests
npm run lint:fix              # Fix linting issues

# Testing
npm run test:quick            # Fast pre-commit tests
npm run test:spotify          # Spotify feature tests
npm run test:coverage         # Coverage report

# Quality
npm run lint                  # Check code style
npm run type-check            # TypeScript check
npm run precommit             # All pre-commit checks

# Database
npm run db:migrate            # Run migrations
npm run db:studio             # Database GUI

# Git
git add .                     # Stage changes
git commit -m "type: message" # Commit with convention
git push origin branch-name   # Push changes
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Remember**: Commit often, test frequently, and keep your code clean! 🎵
