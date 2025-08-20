# Music Tracker 🎵

A web application to track users' music listening habits and display statistics on top artists and songs using Google OAuth and Spotify API integration.

## Features

- 🔐 **Google OAuth Authentication** - Secure login without passwords
- 🎧 **Spotify Integration** - Connect your Spotify account to track listening habits
- 📊 **Listening Analytics** - View your top artists, songs, and listening statistics
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔗 **Social Sharing** - Share your music stats with friends
- 🎨 **Modern UI** - Clean, warm-toned interface inspired by modern social apps

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Google OAuth
- **Music API**: Spotify Web API
- **Testing**: Jest (unit) + Playwright (e2e)
- **Infrastructure**: Vercel, Supabase/Railway, Sentry
- **Package Manager**: pnpm

## Project Structure

```
music-tracker/
├── packages/
│   ├── frontend/          # React application
│   ├── backend/           # Node.js/Express API
│   └── shared/            # Shared types and utilities
├── plan.md               # Project plan and progress
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database (local or managed)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   ```

4. **Configure your environment variables**
   - Google OAuth credentials
   - Spotify API credentials
   - Database connection string
   - JWT secret

5. **Set up the database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Development

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm clean` - Clean build artifacts

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Testing

- **Unit Tests**: Jest for business logic testing
- **E2E Tests**: Playwright for user journey testing
- **API Tests**: Supertest for backend endpoint testing

## Deployment

### Frontend (Vercel)
- Automatic deployment from main branch
- Environment variables configured in Vercel dashboard

### Backend
- Deployed to Vercel Functions or Railway
- Database hosted on Supabase or Railway

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@musictracker.com or create an issue in the repository.
