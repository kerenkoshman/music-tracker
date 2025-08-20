import { Router, Request, Response } from 'express';
import { generateGoogleAuthUrl, googleOAuthClient } from '../config/auth.js';
import { getGoogleUserInfo, findOrCreateUser, getUserById } from '../services/authService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Initiate Google OAuth login
router.get('/google', (req: Request, res: Response) => {
  const state = req.query['redirect_uri'] as string;
  const authUrl = generateGoogleAuthUrl(state);
  
  res.json({
    success: true,
    data: {
      authUrl,
    },
  });
});

// Google OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query['code'] as string;
    const state = req.query['state'] as string;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Authorization code is required',
        },
      });
    }

    // Exchange code for tokens
    const { tokens } = await googleOAuthClient.getToken(code);
    
    if (!tokens.id_token) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Failed to get ID token from Google',
        },
      });
    }

    // Get user info from Google
    const googleUserInfo = await getGoogleUserInfo(tokens.id_token);
    
    // Find or create user
    const authResult = await findOrCreateUser(googleUserInfo);

    // Redirect to frontend with token
    const redirectUrl = state 
      ? `${state}?token=${authResult.token}`
      : `${process.env['FRONTEND_URL'] || 'http://localhost:5173'}?token=${authResult.token}`;

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    const errorUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:5173'}/auth/error`;
    return res.redirect(errorUrl);
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const user = await getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          googleId: user.googleId,
          name: user.name,
          picture: user.picture,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user profile',
      },
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Verify token endpoint
router.post('/verify', authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export { router as authRouter };
