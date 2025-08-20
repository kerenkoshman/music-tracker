import { db } from './connection.js';
import { users, artists, songs, spotifyConnections, listeningHistory } from './schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(listeningHistory);
    await db.delete(songs);
    await db.delete(artists);
    await db.delete(spotifyConnections);
    await db.delete(users);

    // Insert sample users
    console.log('👥 Creating sample users...');
    const [sampleUser] = await db.insert(users).values({
      googleId: 'sample_google_id_123',
      email: 'demo@musictracker.com',
      name: 'Demo User',
      picture: 'https://avatars.githubusercontent.com/u/1?v=4',
    }).returning();

    // Insert sample artists
    console.log('🎤 Creating sample artists...');
    const sampleArtists = await db.insert(artists).values([
      {
        spotifyId: 'spotify_artist_1',
        name: 'Taylor Swift',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb26f36915c5c7b84b54b8a69c',
        popularity: 95,
        genres: ['pop', 'country'],
      },
      {
        spotifyId: 'spotify_artist_2',
        name: 'Drake',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
        popularity: 92,
        genres: ['hip-hop', 'rap'],
      },
      {
        spotifyId: 'spotify_artist_3',
        name: 'Billie Eilish',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb6ce6114b4c4fae5ff40ddfbd',
        popularity: 89,
        genres: ['pop', 'alternative'],
      },
      {
        spotifyId: 'spotify_artist_4',
        name: 'The Weeknd',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebc02c5c3a60dea5fc35e41db8',
        popularity: 91,
        genres: ['r&b', 'pop'],
      },
      {
        spotifyId: 'spotify_artist_5',
        name: 'Dua Lipa',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebf3c9eb378d9a6e43e70e6b7c',
        popularity: 87,
        genres: ['pop', 'dance'],
      },
    ]).returning();

    // Insert sample songs
    console.log('🎵 Creating sample songs...');
    const sampleSongs = await db.insert(songs).values([
      {
        spotifyId: 'spotify_song_1',
        name: 'Anti-Hero',
        artistId: sampleArtists[0]!.id,
        albumName: 'Midnights',
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b2737b3b3b5c8b8b0b0b0b0b0b0b',
        duration: 200800,
        popularity: 95,
      },
      {
        spotifyId: 'spotify_song_2',
        name: 'God\'s Plan',
        artistId: sampleArtists[1]!.id,
        albumName: 'Scorpion',
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273747c0e0bda6eb6b6e8b8d8d8',
        duration: 198973,
        popularity: 92,
      },
      {
        spotifyId: 'spotify_song_3',
        name: 'Bad Guy',
        artistId: sampleArtists[2]!.id,
        albumName: 'When We All Fall Asleep, Where Do We Go?',
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273b3b3b5c8b8b0b0b0b0b0b0b0b',
        duration: 194088,
        popularity: 89,
      },
      {
        spotifyId: 'spotify_song_4',
        name: 'Blinding Lights',
        artistId: sampleArtists[3]!.id,
        albumName: 'After Hours',
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273c1e9b3b0b0b0b0b0b0b0b0b0b',
        duration: 200040,
        popularity: 91,
      },
      {
        spotifyId: 'spotify_song_5',
        name: 'Levitating',
        artistId: sampleArtists[4]!.id,
        albumName: 'Future Nostalgia',
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273d8d8d8d8d8d8d8d8d8d8d8d8',
        duration: 203064,
        popularity: 87,
      },
      {
        spotifyId: 'spotify_song_6',
        name: 'Lavender Haze',
        artistId: sampleArtists[0]!.id,
        albumName: 'Midnights',
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b2737b3b3b5c8b8b0b0b0b0b0b0b',
        duration: 202521,
        popularity: 88,
      },
    ]).returning();

    // Insert sample Spotify connection
    console.log('🎧 Creating sample Spotify connection...');
    await db.insert(spotifyConnections).values({
      userId: sampleUser.id,
      spotifyId: 'sample_spotify_user_123',
      accessToken: 'sample_access_token',
      refreshToken: 'sample_refresh_token',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      isActive: true,
    });

    // Insert sample listening history (last 7 days)
    console.log('📊 Creating sample listening history...');
    const now = new Date();
    const listeningData = [];

    // Generate random listening history for the past week
    for (let i = 0; i < 50; i++) {
      const randomSong = sampleSongs[Math.floor(Math.random() * sampleSongs.length)]!;
      const randomDaysAgo = Math.floor(Math.random() * 7);
      const randomHoursAgo = Math.floor(Math.random() * 24);
      const randomMinutesAgo = Math.floor(Math.random() * 60);
      
      const playedAt = new Date(
        now.getTime() - 
        randomDaysAgo * 24 * 60 * 60 * 1000 - 
        randomHoursAgo * 60 * 60 * 1000 - 
        randomMinutesAgo * 60 * 1000
      );

      listeningData.push({
        userId: sampleUser.id,
        songId: randomSong.id,
        playedAt,
        duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
      });
    }

    await db.insert(listeningHistory).values(listeningData);

    console.log('✅ Database seeded successfully!');
    console.log(`📈 Created:`);
    console.log(`   - 1 user`);
    console.log(`   - ${sampleArtists.length} artists`);
    console.log(`   - ${sampleSongs.length} songs`);
    console.log(`   - 1 Spotify connection`);
    console.log(`   - ${listeningData.length} listening history entries`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('🌱 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seed;
