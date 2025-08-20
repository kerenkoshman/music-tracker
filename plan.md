# Music Tracking Web App - Project Plan

## Project Overview
A web application to track users' music listening habits and display statistics on top artists and songs using Google OAuth and Spotify API integration.

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Google OAuth
- **Music API**: Spotify API
- **Testing**: Jest (unit) + Playwright (e2e)
- **Infrastructure**: GitHub, Vercel, Sentry
- **Package Manager**: pnpm
- **Linting**: ESLint

---

## Phase 1: Project Setup & Foundation
- [x] Initialize project structure and git repository
- [x] Set up pnpm workspace with monorepo structure
- [x] Configure ESLint and Prettier
- [x] Set up basic folder structure (frontend, backend, shared)
- [x] Create initial README.md with project description
- [x] Set up GitHub repository and initial commit
- [ ] Configure basic CI/CD pipeline

## Phase 2: Backend Foundation
- [x] Initialize Node.js/Express backend
- [x] Set up PostgreSQL database connection
- [x] Configure Drizzle ORM and create initial schema
- [x] Set up environment configuration (.env files)
- [x] Create basic health check endpoint
- [x] Set up logging and error handling middleware
- [x] Configure CORS for frontend communication

## Phase 3: Database Schema Design
- [ ] Design user table (Google OAuth integration)
- [ ] Design Spotify connection table
- [ ] Design listening history table
- [ ] Design artists and songs tables
- [ ] Create database migrations
- [ ] Set up seed data for development
- [ ] Write database connection tests

## Phase 4: Authentication System
- [ ] Set up Google OAuth configuration
- [ ] Create authentication middleware
- [ ] Implement login/logout endpoints
- [ ] Set up session management
- [ ] Create user profile endpoints
- [ ] Add authentication tests
- [ ] Set up protected route middleware

## Phase 5: Spotify Integration
- [ ] Set up Spotify API credentials
- [ ] Create Spotify OAuth flow
- [ ] Implement Spotify account connection
- [ ] Create endpoints to fetch user's Spotify data
- [ ] Implement recent tracks fetching
- [ ] Implement top artists/songs fetching
- [ ] Add Spotify API error handling
- [ ] Write Spotify integration tests

## Phase 6: Data Processing & Storage
- [ ] Create service to process Spotify data
- [ ] Implement data transformation logic
- [ ] Set up daily background job for Spotify data syncing
- [ ] Create data aggregation services
- [ ] Implement 1-week data retention policy
- [ ] Add data validation middleware
- [ ] Create data cleanup service for old records
- [ ] Write data processing unit tests

## Phase 7: Frontend Foundation
- [ ] Initialize React application with Vite
- [ ] Set up Tailwind CSS configuration
- [ ] Create basic component structure
- [ ] Set up routing with React Router
- [ ] Configure state management (Context API or Zustand)
- [ ] Set up API client for backend communication
- [ ] Create basic layout components

## Phase 8: Authentication UI
- [ ] Create login page with Google OAuth button
- [ ] Implement authentication context/provider
- [ ] Create protected route components
- [ ] Build user profile component
- [ ] Add logout functionality
- [ ] Create loading states for auth
- [ ] Style authentication pages

## Phase 9: Spotify Connection UI
- [ ] Create Spotify connection page
- [ ] Implement connection status indicator
- [ ] Add disconnect Spotify functionality
- [ ] Create connection error handling
- [ ] Style Spotify connection interface
- [ ] Add connection state management

## Phase 10: Dashboard & Statistics
- [ ] Create main dashboard layout
- [ ] Build top artists display component
- [ ] Build top songs display component
- [ ] Create listening statistics charts
- [ ] Implement data refresh functionality
- [ ] Add loading states for data fetching
- [ ] Style dashboard with warm, modern design
- [ ] Make dashboard responsive for mobile
- [ ] Add public profile view for sharing
- [ ] Implement share functionality (social media, direct links)

## Phase 11: Data Visualization
- [ ] Integrate charting library (Chart.js or Recharts)
- [ ] Create listening time charts
- [ ] Build artist popularity graphs
- [ ] Implement song play count visualizations
- [ ] Add interactive chart features
- [ ] Style charts to match app theme
- [ ] Make charts responsive

## Phase 12: User Experience & Polish
- [ ] Add loading spinners and skeleton screens
- [ ] Implement error boundaries
- [ ] Create toast notifications
- [ ] Add smooth transitions and animations
- [ ] Implement dark/light mode toggle
- [ ] Add keyboard navigation support
- [ ] Optimize for mobile experience
- [ ] Add accessibility features

## Phase 13: Testing Implementation
- [ ] Set up Jest for unit testing
- [ ] Write unit tests for business logic
- [ ] Set up Playwright for e2e testing
- [ ] Create e2e tests for user journeys:
  - [ ] User registration/login flow
  - [ ] Spotify connection flow
  - [ ] Dashboard data display
  - [ ] Statistics viewing
- [ ] Add API endpoint tests
- [ ] Set up test coverage reporting
- [ ] Configure CI/CD for automated testing

## Phase 14: Performance & Optimization
- [ ] Implement API response caching
- [ ] Add database query optimization
- [ ] Set up image optimization
- [ ] Implement code splitting
- [ ] Add service worker for offline support
- [ ] Optimize bundle size
- [ ] Add performance monitoring

## Phase 15: Deployment & Infrastructure
- [ ] Set up Vercel deployment for frontend
- [ ] Configure backend deployment
- [ ] Set up managed PostgreSQL database (Supabase/Railway)
- [ ] Configure environment variables
- [ ] Set up Sentry for error tracking
- [ ] Configure domain and SSL
- [ ] Set up monitoring and alerts
- [ ] Create deployment documentation
- [ ] Configure daily background job scheduling

## Phase 16: Documentation & Final Polish
- [ ] Write comprehensive README
- [ ] Create API documentation
- [ ] Add code documentation
- [ ] Create user guide
- [ ] Write deployment guide
- [ ] Add contributing guidelines
- [ ] Final testing and bug fixes
- [ ] Performance audit and optimization

---

## Project Decisions & Configuration

✅ **Database Hosting**: Managed PostgreSQL service (Supabase/Railway)
✅ **Authentication Flow**: Optional Spotify connection (users can browse first)
✅ **Data Sync Frequency**: Daily background sync from Spotify
✅ **Data Retention**: 1 week of listening history
✅ **Privacy Settings**: Public data (users can share their stats)
✅ **Mobile Strategy**: Responsive web app (no native app)
✅ **Social Features**: Sharing functionality for stats
✅ **Premium Features**: None required (focus on core functionality)

---

## Success Criteria
- [ ] Users can login with Google OAuth
- [ ] Users can connect their Spotify account
- [ ] App displays accurate listening statistics
- [ ] Dashboard shows top artists and songs
- [ ] All user journeys work end-to-end
- [ ] App is responsive and works on mobile
- [ ] Code has good test coverage
- [ ] App is deployed and accessible online
- [ ] Performance is optimized
- [ ] Error handling is robust

---

## Estimated Timeline
- **Phase 1-3**: 1-2 days (Foundation)
- **Phase 4-6**: 3-4 days (Backend & Data)
- **Phase 7-10**: 3-4 days (Frontend Core)
- **Phase 11-12**: 2-3 days (UI/UX Polish)
- **Phase 13-15**: 2-3 days (Testing & Deployment)
- **Phase 16**: 1 day (Documentation)

**Total Estimated Time**: 12-17 days

---

## Notes
- Each phase should be completed before moving to the next
- Commit frequently with descriptive messages
- Test each feature as it's built
- Keep the design minimal and functional as requested
- Focus on warm tones and modern social app inspiration
- Use pnpm for all package management
