# CitizenConnect 🇵🇰

> A modern civic engagement platform for Pakistani citizens - BS Software Engineering Semester Project

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E)

## 📌 Overview

CitizenConnect is a comprehensive civic platform designed to empower Pakistani citizens by providing:

- 📚 **Step-by-step Guides** - For government services (CNIC, Passport, License, etc.)
- 🩸 **Blood Donor Network** - Find and connect with blood donors in your city
- 🚨 **Emergency Help** - Quick access to emergency contacts and procedures
- 💝 **Donation Platform** - Verified donation campaigns with transparency
- 🤝 **Volunteer Network** - Connect with volunteers or offer your skills
- 📊 **Transparency Dashboard** - Real-time tracking of community contributions

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Supabase CLI installed (`npm install -g supabase`)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd citizenconnect
   npm install
   ```

2. **Set Up Supabase**
   
   Create a new project at [supabase.com](https://supabase.com) and get your credentials.

3. **Configure Environment Variables**
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run Database Migrations**
   ```bash
   # Link to your Supabase project
   supabase link --project-ref your-project-ref
   
   # Push database schema
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 📂 Project Structure

```
citizenconnect/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/              # About page
│   │   ├── admin/              # Admin dashboard
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify-email/
│   │   ├── blood-bank/         # Blood donor network
│   │   ├── contact/            # Contact page
│   │   ├── dashboard/          # Transparency dashboard
│   │   ├── donations/          # Donation campaigns
│   │   ├── emergency/          # Emergency help
│   │   ├── guides/             # Step-by-step guides
│   │   │   └── [id]/           # Individual guide page
│   │   ├── profile/            # User profile
│   │   ├── volunteers/         # Volunteer network
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── CTASection.tsx
│   ├── lib/
│   │   └── supabase/           # Supabase client config
│   │       ├── client.ts       # Browser client
│   │       ├── server.ts       # Server client
│   │       ├── middleware.ts   # Session middleware
│   │       └── database.types.ts
│   └── middleware.ts           # Next.js middleware
├── supabase/
│   └── migrations/             # Database migrations
│       └── 20231202000000_initial_schema.sql
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: `#009950` (Pakistani Green)
- **Accent**: `#27AE60`
- **Background**: `#F8F9FA`
- **Text**: `#333333`

### Typography
- Font: Inter (Google Fonts)

## 📋 Features

### 1. User Authentication
- Email/password signup and login
- Role-based access (Citizen, Donor, Volunteer, Admin)
- Email verification

### 2. Step-by-Step Guides
- Comprehensive guides for government services
- Progress tracking with checklists
- Community comments and tips
- Related documents and helpful links

### 3. Blood Donor Network
- Search donors by blood group and city
- Register as a donor
- Urgency-based filtering
- Contact donors directly

### 4. Emergency Help
- Emergency contact numbers (Rescue 1122, Edhi, Police)
- Step-by-step emergency procedures
- Preparedness checklists
- NGO contacts

### 5. Donation Platform
- Verified donation campaigns
- Multiple categories (Medical, Education, Flood Relief)
- Progress tracking
- Transparency dashboard

### 6. Volunteer Network
- Register as a volunteer
- Find volunteers by skill and location
- Skill categories (Medical, Education, Technical, etc.)
- Availability filtering

### 7. Transparency Dashboard
- Real-time statistics
- Donation tracking
- Leaderboard
- Impact stories

### 8. Admin Panel
- User management
- Content management
- Donation oversight
- Analytics

## 🔐 Database Schema

The database includes the following tables:
- `profiles` - User profiles
- `categories` - Guide categories
- `guides` - Step-by-step guides
- `guide_steps` - Individual guide steps
- `comments` - User comments
- `blood_donors` - Blood donor registry
- `donations` - Donation records
- `donation_cases` - Donation campaigns
- `volunteers` - Volunteer registry
- `emergency_contacts` - Emergency contact numbers
- `notifications` - User notifications

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
vercel
```

## 📝 Contributing

This is a semester project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Next.js](https://nextjs.org) - React Framework
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Vercel](https://vercel.com) - Deployment Platform

## 📄 License

This project is created for educational purposes as part of BS Software Engineering coursework.

---

**Made with ❤️ for Pakistan 🇵🇰**
