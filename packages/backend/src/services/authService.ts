import { googleOAuthClient } from '../config/auth.js';
import { generateToken } from '../utils/jwt.js';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    googleId: string;
    name: string;
    picture?: string | null;
  };
  token: string;
}

// Get Google user info from access token
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const clientId = process.env['GOOGLE_CLIENT_ID'];
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: accessToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid Google token');
  }

  return {
    id: payload.sub!,
    email: payload.email!,
    name: payload.name!,
    picture: payload.picture || null,
  };
}

// Find or create user from Google info
export async function findOrCreateUser(googleInfo: GoogleUserInfo): Promise<AuthResult> {
  // Try to find existing user
  let [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleInfo.id))
    .limit(1);

  let user;

      if (existingUser) {
      // Update existing user info
      const updateData: any = {
        email: googleInfo.email,
        name: googleInfo.name,
        updatedAt: new Date(),
      };
      
      if (googleInfo.picture) {
        updateData.picture = googleInfo.picture;
      }
      
      [user] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, existingUser.id))
        .returning();
    } else {
      // Create new user
      const insertData: any = {
        googleId: googleInfo.id,
        email: googleInfo.email,
        name: googleInfo.name,
      };
      
      if (googleInfo.picture) {
        insertData.picture = googleInfo.picture;
      }
      
      [user] = await db
        .insert(users)
        .values(insertData)
        .returning();
    }

  if (!user) {
    throw new Error('Failed to create or update user');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    googleId: user.googleId,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      googleId: user.googleId,
      name: user.name,
      picture: user.picture || null,
    },
    token,
  };
}

// Get user by ID
export async function getUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user;
}

// Get user by Google ID
export async function getUserByGoogleId(googleId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
    .limit(1);

  return user;
}
