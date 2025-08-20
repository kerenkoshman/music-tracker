import { Router, Request, Response } from 'express';
import { generateSpotifyAuthUrl } from '../config/spotify.js';
import {
  exchangeCodeForTokens,
  getSpotifyUserProfile,
  saveSpotifyConnection,
  getSpotifyConnection,
  getValidAccessToken,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  saveArtist,
  saveSong,
  saveListeningHistory,
  disconnectSpotify,
} from '../services/spotifyService.js';
import { authenticateToken } from '../middleware/auth.js';
import { getUserById } from '../services/authService.js';

const router = Router();

// Initiate Spotify OAuth connection
router.get('/connect', authenticateToken, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const state = req.query['redirect_uri'] as string;
    const authUrl = generateSpotifyAuthUrl(state);
    
    res.json({
      success: true,
      data: {
        authUrl,
      },
    });
  } catch (error) {
    console.error('Spotify connect error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to generate Spotify auth URL',
      },
    });
  }
});

// Spotify OAuth callback
router.get('/callback', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

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
    const tokens = await exchangeCodeForTokens(code);
    
    // Get Spotify user profile
    const spotifyUser = await getSpotifyUserProfile(tokens.access_token);
    
    // Save Spotify connection
    await saveSpotifyConnection(req.user.id, spotifyUser, tokens);

    // Redirect to frontend
    const redirectUrl = state 
      ? `${state}?connected=true`
      : `${process.env['FRONTEND_URL'] || 'http://localhost:5173'}/dashboard?connected=true`;

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('Spotify OAuth callback error:', error);
    
    const errorUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:5173'}/spotify/error`;
    return res.redirect(errorUrl);
  }
});

// Get Spotify connection status
router.get('/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const connection = await getSpotifyConnection(req.user.id);
    
    res.json({
      success: true,
      data: {
        connected: !!connection?.isActive,
        spotifyId: connection?.spotifyId,
        expiresAt: connection?.expiresAt,
      },
    });
  } catch (error) {
    console.error('Get Spotify status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get Spotify connection status',
      },
    });
  }
});

// Disconnect Spotify account
router.post('/disconnect', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    await disconnectSpotify(req.user.id);
    
    res.json({
      success: true,
      message: 'Spotify account disconnected successfully',
    });
  } catch (error) {
    console.error('Disconnect Spotify error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to disconnect Spotify account',
      },
    });
  }
});

// Get recently played tracks
router.get('/recently-played', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const accessToken = await getValidAccessToken(req.user.id);
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Spotify account not connected or token expired',
        },
      });
    }

    const limit = parseInt(req.query['limit'] as string) || 50;
    const tracks = await getRecentlyPlayed(accessToken, limit);
    
    res.json({
      success: true,
      data: {
        tracks,
      },
    });
  } catch (error) {
    console.error('Get recently played error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get recently played tracks',
      },
    });
  }
});

// Get top artists
router.get('/top-artists', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const accessToken = await getValidAccessToken(req.user.id);
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Spotify account not connected or token expired',
        },
      });
    }

    const timeRange = (req.query['time_range'] as 'short_term' | 'medium_term' | 'long_term') || 'short_term';
    const limit = parseInt(req.query['limit'] as string) || 20;
    const artists = await getTopArtists(accessToken, timeRange, limit);
    
    res.json({
      success: true,
      data: {
        artists,
      },
    });
  } catch (error) {
    console.error('Get top artists error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get top artists',
      },
    });
  }
});

// Get top tracks
router.get('/top-tracks', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const accessToken = await getValidAccessToken(req.user.id);
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Spotify account not connected or token expired',
        },
      });
    }

    const timeRange = (req.query['time_range'] as 'short_term' | 'medium_term' | 'long_term') || 'short_term';
    const limit = parseInt(req.query['limit'] as string) || 20;
    const tracks = await getTopTracks(accessToken, timeRange, limit);
    
    res.json({
      success: true,
      data: {
        tracks,
      },
    });
  } catch (error) {
    console.error('Get top tracks error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get top tracks',
      },
    });
  }
});

// Sync Spotify data (save to database)
router.post('/sync', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const accessToken = await getValidAccessToken(req.user.id);
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Spotify account not connected or token expired',
        },
      });
    }

    // Get recently played tracks
    const recentTracks = await getRecentlyPlayed(accessToken, 50);
    
    let syncedCount = 0;
    for (const track of recentTracks) {
      try {
        // Save artist
        const artist = await saveArtist({
          id: track.artists[0].id,
          name: track.artists[0].name,
          images: [],
          popularity: track.popularity,
          genres: [],
        });

        // Save song
        const song = await saveSong(track, artist.id);

        // Save listening history
        if (track.played_at) {
          await saveListeningHistory(req.user.id, song.id, track.played_at);
        }

        syncedCount++;
      } catch (error) {
        console.error('Error syncing track:', track.name, error);
      }
    }
    
    res.json({
      success: true,
      data: {
        syncedCount,
        totalTracks: recentTracks.length,
      },
      message: `Successfully synced ${syncedCount} tracks`,
    });
  } catch (error) {
    console.error('Sync Spotify data error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to sync Spotify data',
      },
    });
  }
});

export { router as spotifyRouter };
