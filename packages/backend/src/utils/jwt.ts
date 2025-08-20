import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/auth.js';

export interface JWTPayload {
  userId: string;
  email: string;
  googleId: string;
  iat?: number;
  exp?: number;
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, jwtConfig.secret as string, {
    expiresIn: jwtConfig.expiresIn as string,
  } as any);
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret as string) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader) {
    throw new Error('Authorization header is required');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with Bearer');
  }

  const token = authHeader.substring(7);
  if (!token) {
    throw new Error('Token is required');
  }

  return token;
}

// Generate refresh token (optional, for enhanced security)
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, jwtConfig.secret as string, {
    expiresIn: '30d',
  });
}
