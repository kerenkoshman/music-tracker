import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserById } from '../services/authService.js';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
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

    res.json({
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user profile',
      },
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const { name, picture } = req.body;

    // Validate input
    if (name && typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Name must be a string',
        },
      });
    }

    if (picture && typeof picture !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Picture must be a string',
        },
      });
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(picture && { picture }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          googleId: updatedUser.googleId,
          name: updatedUser.name,
          picture: updatedUser.picture,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update user profile',
      },
    });
  }
});

// Get user by ID (public profile)
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    // Return public profile (no sensitive data)
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          picture: user.picture,
          createdAt: user.createdAt,
        },
      },
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user',
      },
    });
  }
});

export { router as usersRouter };
