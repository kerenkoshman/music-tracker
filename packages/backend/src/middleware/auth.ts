import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        googleId: string;
        name: string;
        picture?: string;
      };
    }
  }
}

// Authentication middleware
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    // Verify token
    const payload = verifyToken(token);
    
    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      googleId: user.googleId,
      name: user.name,
      picture: user.picture || undefined,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
      },
    });
  }
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    const token = extractTokenFromHeader(authHeader);
    const payload = verifyToken(token);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        googleId: user.googleId,
        name: user.name,
        picture: user.picture || undefined,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
