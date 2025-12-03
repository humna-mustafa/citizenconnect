# CitizenConnect - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Docker Desktop (for local Supabase instance)

### Installation Steps

1. **Clone and Install Dependencies**
```bash
npm install
```

2. **Start Local Supabase Instance**
```bash
npm run supabase:start
```

This will start a local Supabase instance with:
- PostgreSQL database
- Authentication server
- Realtime server
- Storage server
- Edge Functions

3. **Update Environment Variables**

After Supabase starts, it will display connection details. Update `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Run Database Migrations**
```bash
npm run supabase:reset
```

This will:
- Create all database tables
- Set up Row Level Security policies
- Add database functions and triggers
- Insert seed data

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📊 Database Schema

### Core Tables

#### **profiles**
- User profiles extending Supabase Auth
- Fields: full_name, phone, city, role, badges, bio
- Roles: citizen, donor, volunteer, admin

#### **guides**
- Civic issue guides with step-by-step solutions
- Full-text search enabled
- Upvotes and ratings system
- Views tracking

#### **blood_donors & blood_requests**
- Blood donor registration
- Urgent blood request broadcasts
- Real-time notifications to matching donors
- Location-based filtering

#### **donation_cases & donations**
- Verified fundraising campaigns
- Transparent donation tracking
- Payment method support (JazzCash, EasyPaisa, Bank)
- Progress updates

#### **volunteers**
- Volunteer registration with skills
- Availability tracking
- Task completion metrics

#### **notifications**
- Real-time notification system
- Type-based filtering
- Read/unread status

### Advanced Features

#### **Full-Text Search**
```sql
SELECT * FROM search_guides('healthcare');
```

#### **Dashboard Analytics**
```sql
SELECT * FROM get_dashboard_stats();
```

#### **Leaderboards**
```sql
SELECT * FROM get_top_contributors(10);
SELECT * FROM get_top_blood_donors(10);
```

## 🔒 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only modify their own data
- Public read access for published content
- Admin-only operations protected

### Authentication
- Email/Password signup
- Email verification
- Password reset
- Protected routes

## 🎯 Key Features

### 1. **Issue Guides System**
- Create and browse step-by-step guides
- Category-based organization
- Search functionality
- Upvote and rating system
- Community comments and tips

### 2. **Blood Bank Module**
- Register as blood donor
- Create urgent blood requests
- Real-time notifications to nearby donors
- Filter by blood group and city
- Track donation history

### 3. **Donation Platform**
- Verified fundraising campaigns
- Multiple payment methods
- Transparent progress tracking
- Anonymous donation option
- Campaign updates with images

### 4. **Volunteer Network**
- Register with skills and availability
- Browse volunteers by location/skills
- Discussion forums
- Task tracking

### 5. **Emergency Help**
- Emergency contact directory
- Step-by-step emergency guides
- NGO contacts
- Preparedness checklists

### 6. **Admin Dashboard**
- Real-time statistics
- User management
- Content moderation
- Analytics charts

## 📱 Pages and Functionality

### Public Pages
- **Homepage** - Hero, features, statistics
- **Guides** - Browse and search guides
- **Guide Detail** - View guide with comments
- **Blood Bank** - Find donors, create requests
- **Donations** - Browse campaigns, donate
- **Volunteers** - Find volunteers, register
- **Emergency** - Emergency contacts and guides
- **About** - Platform information
- **Contact** - Contact form

### Protected Pages
- **Dashboard** - Personal stats and quick actions
- **Profile** - Edit profile, view badges, activity
- **Admin** - Admin panel (admin role only)

### Authentication Pages
- **Login** - Email/password login
- **Signup** - New user registration
- **Verify Email** - Email verification

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Supabase
npm run supabase:start     # Start local Supabase
npm run supabase:stop      # Stop local Supabase
npm run supabase:status    # Check Supabase status
npm run supabase:reset     # Reset database with migrations
npm run db:types           # Generate TypeScript types
```

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── guides/            # Guides pages
│   ├── blood-bank/        # Blood bank
│   ├── donations/         # Donations
│   ├── volunteers/        # Volunteers
│   ├── emergency/         # Emergency help
│   ├── dashboard/         # User dashboard
│   ├── profile/           # User profile
│   ├── admin/             # Admin panel
│   └── auth/              # Authentication
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   └── ...
├── lib/
│   └── supabase/          # Supabase configuration
│       ├── client.ts      # Client-side Supabase client
│       ├── server.ts      # Server-side Supabase client
│       ├── middleware.ts  # Middleware for auth
│       ├── helpers.ts     # Database helper functions
│       └── database.types.ts  # Generated TypeScript types
└── middleware.ts          # Route middleware

supabase/
├── config.toml            # Supabase configuration
└── migrations/            # Database migrations
    ├── 20231202000000_initial_schema.sql
    └── 20241202000001_advanced_features.sql
```

## 🎨 Design System

### Colors
- **Primary**: Emerald 600 (`#059669`)
- **Secondary**: Slate 900 (`#0f172a`)
- **Background**: Slate 50 (`#f8fafc`)
- **Text**: Slate 900 (`#0f172a`)
- **Muted**: Slate 500 (`#64748b`)

### Components
- Modern glassmorphism effects
- Smooth animations and transitions
- Responsive design (mobile-first)
- Accessible components
- Icon library: Lucide React

## 📈 Performance Optimizations

- Server-side rendering (SSR)
- Static site generation where applicable
- Database indexes on common queries
- Real-time subscriptions for live updates
- Lazy loading of images and components

## 🔐 Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Your Supabase anon key
NEXT_PUBLIC_SITE_URL=              # Your site URL
```

## 🚢 Deployment

### Deploy to Vercel

1. **Connect Supabase Project**
   - Create a project at https://supabase.com
   - Note your project URL and anon key

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   Add the following to Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

4. **Run Migrations**
   Use Supabase Dashboard to run migrations or use Supabase CLI:
   ```bash
   npx supabase db push
   ```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User Registration & Login
- [ ] Create and view guides
- [ ] Upvote and comment on guides
- [ ] Register as blood donor
- [ ] Create blood request (verify notifications)
- [ ] Browse and filter donation campaigns
- [ ] Make a donation
- [ ] Register as volunteer
- [ ] View dashboard statistics
- [ ] Update user profile
- [ ] Admin panel access (admin role)
- [ ] Real-time notifications
- [ ] Search functionality

## 🎓 For Your Professor

### Impressive Features to Highlight

1. **Complete Backend Implementation**
   - Fully functional Supabase database
   - Row Level Security for data protection
   - Real-time notifications
   - Advanced search capabilities

2. **Modern Tech Stack**
   - Next.js 16 with App Router
   - TypeScript for type safety
   - Server-side rendering
   - Real-time subscriptions

3. **Comprehensive Features**
   - Authentication system
   - Multi-module platform (Guides, Blood Bank, Donations, Volunteers)
   - Admin dashboard with analytics
   - Notification system
   - Leaderboards and gamification

4. **Professional Design**
   - Modern, responsive UI
   - Accessibility considered
   - Smooth animations
   - Mobile-friendly

5. **Scalability**
   - Database indexing for performance
   - Optimized queries
   - Modular architecture
   - Type-safe database operations

## 📞 Support

For issues or questions:
1. Check database logs: `npm run supabase:status`
2. Reset database: `npm run supabase:reset`
3. View Supabase Studio: http://localhost:54323

## 📝 License

This project is for educational purposes as part of a civics project.

---

**Built with ❤️ for Pakistani communities**
