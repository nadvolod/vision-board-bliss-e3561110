# Vision Board Bliss - Requirements Document

## Overview
Vision Board Bliss is a web-based application that allows users to create, manage, and track personal goals through visual vision boards. The application combines goal management with achievement tracking and social sharing capabilities.

## Core Features

### 1. User Authentication & Management
- **Sign Up/Login**: Email-based authentication via Supabase Auth
- **User Sessions**: Persistent authentication with secure session management
- **Protected Routes**: Authentication-required sections of the application
- **User Preferences**: Customizable settings for notifications and sharing

### 2. Goal Management
- **Create Goals**: Users can add new goals with:
  - Visual image representation
  - Goal description
  - Personal "why" statement (motivation)
  - Target deadline
- **Edit Goals**: Modify existing goal details
- **Delete Goals**: Remove goals from vision board
- **Mark as Achieved**: Toggle goal completion status with timestamp
- **Goal Filtering**: View active vs. achieved goals
- **Goal Details View**: Expanded view with navigation between goals

### 3. Vision Board Display
- **Grid Layout**: Visual display of goal cards in responsive grid
- **Goal Cards**: Individual cards showing goal image, description, and status
- **Interactive Navigation**: Click to view detailed goal information
- **Empty State Handling**: Appropriate messaging when no goals exist
- **Loading States**: Skeleton loading while data is fetched

### 4. Achievement System
- **Automatic Achievement Creation**: Auto-generated achievements when goals are completed
- **Achievement Types**: Support for different achievement categories
- **Achievement Data**: Structured data storage for achievement details
- **Impact Metrics**: Tracking of achievement-related metrics
- **Featured Achievements**: Ability to highlight notable achievements
- **Achievement Counter**: Display total count of achieved goals

### 5. Feedback & Analytics
- **NPS Survey System**: Net Promoter Score feedback collection
  - 0-10 rating scale
  - Optional feedback text
  - Configurable frequency (default: 30 days)
  - Smart timing based on user activity
- **User Preferences**: Control over survey frequency and notifications
- **Analytics Dashboard**: NPS analytics viewing (admin feature)

### 6. Social Features
- **Sharing Opt-in**: User consent for sharing achievements
- **Published Wins**: System for sharing achievements on social platforms
- **Success Stories**: Carousel of featured user achievements on landing page
- **Social Share Preview**: Optimized sharing previews for social media

### 7. Performance & Offline Support
- **Optimized Loading**: Performance-optimized components and lazy loading
- **Offline Indicator**: Visual indication of connection status
- **Offline Storage**: Local storage capabilities for offline functionality
- **Progressive Web App**: PWA features with service worker

### 8. User Interface
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Mode**: Theme switching capabilities
- **Modern UI Components**: Radix UI-based component library
- **Toast Notifications**: User feedback for actions and errors
- **Modal Dialogs**: Various modal types for different interactions
- **Loading Skeletons**: Improved perceived performance during loading

## Technical Requirements

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API with custom hooks
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state management
- **Routing**: React Router DOM for navigation

### Backend & Database
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **Database Tables**:
  - `user_goals`: Goal storage and management
  - `user_achievements`: Achievement tracking
  - `nps_feedback`: User feedback collection
  - `user_preferences`: User settings and preferences
  - `published_wins`: Social sharing data
- **Row Level Security**: Comprehensive RLS policies for data protection
- **Database Functions**: Custom PostgreSQL functions for business logic

### Performance Features
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized image handling and display
- **Caching**: Strategic caching with TanStack Query
- **Bundle Optimization**: Minimized bundle sizes
- **Performance Monitoring**: Lighthouse CI integration

## User Workflows

### 1. New User Onboarding
1. User visits landing page
2. Creates account or logs in
3. Views empty vision board with call-to-action
4. Adds first goal with image, description, why, and deadline
5. Views populated vision board

### 2. Goal Management Workflow
1. User views vision board with existing goals
2. Can add new goals via floating action button
3. Can click on goals to view details
4. Can edit or delete goals from detail view
5. Can mark goals as achieved
6. Automatic achievement creation upon goal completion

### 3. Achievement Tracking
1. Goals marked as achieved trigger achievement creation
2. Achievements stored with metadata and timestamps
3. Users can view achievements in dedicated achievements page
4. Optional sharing and testimonial features

### 4. Feedback Collection
1. Smart NPS survey triggering based on user activity
2. Survey presentation with rating and optional feedback
3. Frequency control through user preferences
4. Data collection for product improvement

## Pages & Navigation

### Public Pages
- **Landing Page** (`/`): Marketing page with features and success stories
- **Authentication** (`/auth`): Login and signup forms
- **Demo** (`/demo`): Demo version of the application

### Protected Pages
- **Vision Board** (`/app`): Main application interface
- **Achievements** (`/achievements`): Achievement tracking and display
- **Wins** (`/wins`): Carousel of user achievements
- **NPS Analytics** (`/nps-analytics`): Admin analytics dashboard
- **Optimized Version** (`/optimized`): Performance-optimized variant

### Error Pages
- **404 Not Found** (`/404`): Custom error page for invalid routes

## Data Models

### Goal
```typescript
{
  id: string;
  image: string;
  description: string;
  why?: string;
  deadline: string;
  createdAt: string;
  achieved: boolean;
  achievedAt?: string;
}
```

### User Achievement
```typescript
{
  id: string;
  user_id: string;
  goal_id?: string;
  achievement_type: string;
  achievement_data?: Record<string, unknown>;
  impact_metrics?: Record<string, unknown>;
  testimonial?: string;
  is_featured: boolean;
  opt_in_sharing: boolean;
  created_at: string;
  updated_at: string;
}
```

### NPS Feedback
```typescript
{
  id: string;
  user_id: string;
  score: '0' | '1' | '2' | ... | '10';
  feedback_text?: string;
  created_at: string;
  updated_at: string;
}
```

## Security Requirements
- **Row Level Security**: All database tables protected with RLS policies
- **User Isolation**: Users can only access their own data
- **Secure Authentication**: Supabase Auth with secure session management
- **Input Validation**: Zod schema validation for all forms
- **HTTPS**: Secure communication in production

## Performance Requirements
- **Load Time**: Initial page load under 3 seconds
- **Responsive**: Smooth interaction on mobile and desktop
- **Offline Capability**: Basic functionality available offline
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Optimized for search engines

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App capabilities

## Deployment & Hosting
- **Frontend**: Deployable to Vercel, Netlify, or similar platforms
- **Backend**: Hosted on Supabase infrastructure
- **CDN**: Static assets served via CDN
- **Domain**: Custom domain support available
- **SSL**: HTTPS encryption for all connections

## Monitoring & Analytics
- **Error Tracking**: Runtime error monitoring
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: NPS feedback collection and analysis
- **Database Monitoring**: Supabase built-in monitoring

## Future Enhancements (Not Currently Implemented)
- Email notifications for goal deadlines
- Goal categories and tagging
- Goal sharing with other users
- Advanced analytics and reporting
- Mobile app version
- Integration with calendar applications
- Goal template library