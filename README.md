# 🌍 WorldPulse News

A modern, secure news aggregation platform built with React, TypeScript, and Supabase. Features comprehensive authentication, role-based access control, and real-time news updates across multiple categories.

![WorldPulse News](https://img.shields.io/badge/WorldPulse-News-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.38.4-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 📰 News Aggregation
- **Real-time News Updates**: Automated news fetching via Supabase Edge Functions
- **Multi-Category Support**: World, Technology, Sports, Business, and Politics
- **Rich Article Content**: Full articles with images, excerpts, and metadata
- **Search Functionality**: Find articles by keywords and categories
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔐 Security & Authentication
- **User Authentication**: Secure login/signup with Supabase Auth
- **Role-Based Access Control**: Admin and public user roles
- **Row Level Security (RLS)**: Database-level access control policies
- **PKCE OAuth Flow**: Enhanced security for authentication
- **Session Management**: Automatic token refresh and session monitoring
- **Protected Routes**: Admin-only access to sensitive features

### 👑 Admin Features
- **Article Management**: Create, edit, and delete news articles
- **Content Moderation**: Publish/draft article status control
- **Subscriber Management**: View and manage email subscribers
- **Analytics Dashboard**: Monitor site usage and engagement

### 📧 Subscription System
- **Email Subscriptions**: Users can subscribe to newsletters
- **Automated Notifications**: Notify subscribers of new articles
- **Subscriber Analytics**: Track subscription metrics

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Powerful data fetching and caching
- **React Router** - Client-side routing
- **shadcn/ui** - Modern UI components

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Supabase Auth** - Authentication and authorization
- **Supabase Edge Functions** - Serverless functions
- **Row Level Security** - Database access control

### Development Tools
- **ESLint** - Code linting and formatting
- **Vitest** - Unit testing framework
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd world-pulse-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
world-pulse-news/
├── public/                    # Static assets
│   └── robots.txt
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AdminForm.tsx    # Article creation/editing form
│   │   ├── ArticleCard.tsx  # News article card component
│   │   ├── Navbar.tsx       # Main navigation
│   │   └── SessionMonitor.tsx # Session expiry warnings
│   ├── hooks/               # Custom React hooks
│   │   ├── useArticles.ts   # Article CRUD operations
│   │   ├── useAuth.ts       # Authentication state management
│   │   └── useSubscribe.ts  # Email subscription handling
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── AdminPage.tsx    # Admin dashboard
│   │   ├── ArticleDetail.tsx # Individual article view
│   │   ├── CategoryPage.tsx # Category-specific articles
│   │   ├── Index.tsx        # Homepage
│   │   ├── LoginPage.tsx    # Authentication page
│   │   └── SearchPage.tsx   # Search results page
│   └── test/                # Test files
├── supabase/
│   ├── config.toml          # Supabase project configuration
│   ├── functions/           # Edge functions
│   │   ├── fetch-news/      # News aggregation function
│   │   └── notify-subscribers/ # Email notification function
│   └── migrations/          # Database migrations
└── dist/                    # Production build output
```

## 🔒 Security Implementation

### Authentication Flow
1. **PKCE OAuth**: Secure authentication using Proof Key for Code Exchange
2. **JWT Tokens**: JSON Web Tokens for session management
3. **Auto Refresh**: Automatic token renewal before expiry
4. **Session Monitoring**: Real-time session expiry warnings

### Authorization & Access Control
- **Role-Based Access**: Admin vs. public user permissions
- **Protected Routes**: Route-level access control with redirects
- **API Security**: Server-side validation and authentication checks
- **Database Security**: Row Level Security policies

### Data Protection
- **Input Validation**: Comprehensive client and server-side validation
- **SQL Injection Prevention**: Parameterized queries and prepared statements
- **XSS Protection**: Content sanitization and safe rendering
- **CSRF Protection**: Built-in Supabase security measures

## 🗄️ Database Schema

### Articles Table
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  author TEXT,
  cover_image_url TEXT,
  excerpt TEXT,
  body TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Subscribers Table
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security Policies
- **Articles**: Admin-only CRUD operations, public read access for published articles
- **Subscribers**: Admin-only read access, anonymous insert for subscriptions

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment
The built files in the `dist/` directory can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure all tests pass before submitting PR
- Follow the existing code style and structure
- Update documentation for API changes

## 📄 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/session` - Get current session

### Article Endpoints
- `GET /articles` - List articles (with filtering)
- `GET /articles/:id` - Get single article
- `POST /articles` - Create article (admin only)
- `PUT /articles/:id` - Update article (admin only)
- `DELETE /articles/:id` - Delete article (admin only)

### Subscription Endpoints
- `POST /subscribers` - Subscribe to newsletter
- `GET /subscribers` - List subscribers (admin only)

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Supabase Configuration
- Enable Row Level Security on all tables
- Configure authentication providers
- Set up Edge Functions for news fetching
- Configure SMTP for email notifications

## 📊 Performance

- **Fast Loading**: Optimized with Vite's build system
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Responsive images with lazy loading
- **Caching**: React Query for efficient data caching
- **Bundle Analysis**: Monitor bundle size and optimize

## 🐛 Troubleshooting

### Common Issues

**Authentication Issues**
- Verify Supabase credentials in `.env`
- Check network connectivity
- Clear browser cache and cookies

**Database Connection**
- Ensure Supabase project is active
- Verify RLS policies are applied
- Check migration status

**Build Issues**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check Node.js version compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [React](https://reactjs.org) for the powerful frontend library

---

**Built with ❤️ using modern web technologies**
