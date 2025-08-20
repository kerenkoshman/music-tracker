// Spotify API Configuration
export const spotifyConfig = {
  clientId: process.env['SPOTIFY_CLIENT_ID'] || '',
  clientSecret: process.env['SPOTIFY_CLIENT_SECRET'] || '',
  redirectUri: process.env['SPOTIFY_REDIRECT_URI'] || 'http://localhost:3000/auth/spotify/callback',
  apiBaseUrl: 'https://api.spotify.com/v1',
  authBaseUrl: 'https://accounts.spotify.com',
};

// Spotify OAuth scopes
export const spotifyScopes = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',
  'user-read-currently-playing',
];

// Generate Spotify OAuth URL
export function generateSpotifyAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    response_type: 'code',
    redirect_uri: spotifyConfig.redirectUri,
    scope: spotifyScopes.join(' '),
    show_dialog: 'true', // Force user to authorize each time
  });

  if (state) {
    params.append('state', state);
  }

  return `${spotifyConfig.authBaseUrl}/authorize?${params.toString()}`;
}

// Validate Spotify configuration
export function validateSpotifyConfig() {
  const errors: string[] = [];

  if (!spotifyConfig.clientId) {
    errors.push('SPOTIFY_CLIENT_ID is required');
  }

  if (!spotifyConfig.clientSecret) {
    errors.push('SPOTIFY_CLIENT_SECRET is required');
  }

  if (errors.length > 0) {
    throw new Error(`Spotify configuration errors: ${errors.join(', ')}`);
  }
}
