import { OAuth2Client } from 'google-auth-library';

// Google OAuth Configuration
export const googleConfig = {
  clientId: process.env['GOOGLE_CLIENT_ID'] || '',
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
  redirectUri: process.env['GOOGLE_REDIRECT_URI'] || 'http://localhost:3000/auth/google/callback',
};

// JWT Configuration
export const jwtConfig = {
  secret: process.env['JWT_SECRET'] || 'fallback-secret-change-in-production',
  expiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
};

// Create Google OAuth client
export const googleOAuthClient = new OAuth2Client(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirectUri
);

// Validate configuration
export function validateAuthConfig() {
  const errors: string[] = [];

  if (!googleConfig.clientId) {
    errors.push('GOOGLE_CLIENT_ID is required');
  }

  if (!googleConfig.clientSecret) {
    errors.push('GOOGLE_CLIENT_SECRET is required');
  }

  if (jwtConfig.secret === 'fallback-secret-change-in-production') {
    console.warn('⚠️  Using fallback JWT secret. Set JWT_SECRET in production!');
  }

  if (errors.length > 0) {
    throw new Error(`Authentication configuration errors: ${errors.join(', ')}`);
  }
}

// Google OAuth scopes
export const googleScopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// Generate Google OAuth URL
export function generateGoogleAuthUrl(state?: string): string {
  const options: any = {
    access_type: 'offline',
    scope: googleScopes,
    prompt: 'consent',
  };
  
  if (state) {
    options.state = state;
  }
  
  return googleOAuthClient.generateAuthUrl(options);
}
