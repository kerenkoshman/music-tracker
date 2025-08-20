// Test setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: 'env.test' });

// Global test timeout - increased for database operations
jest.setTimeout(30000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock database connection for quick tests
jest.mock('../db/connection.js', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  client: {
    end: jest.fn(),
  },
}));
