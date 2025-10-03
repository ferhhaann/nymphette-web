# Nymphette Travel - Project Architecture

## Overview

Nymphette Travel is a modern web application built for a travel agency, offering travel packages, group tours, and destination information. The application is built using **React 18**, **TypeScript**, **Vite**, and **Supabase** as the backend-as-a-service platform.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Supabase)    │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Build/Deploy  │    │   File Storage  │
│   (Vite Build)  │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router DOM v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library built on Radix UI

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Row Level Security (RLS)

### State Management & Data Fetching
- **TanStack React Query** - Server state management and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Runtime type validation

### UI & Styling
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Tailwind Animate** - Animation utilities
- **Next Themes** - Theme management

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Bun** - Package manager and runtime
- **Lovable Tagger** - Development component tagging

## 📁 Project Structure

### Root Directory
```
nymphette-web/
├── public/                 # Static assets
├── src/                   # Source code
├── server/                # Server-side code (if any)
├── supabase/             # Supabase configuration
├── docs/                 # Documentation
├── vite-project/         # Additional Vite configuration
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

### Source Code Structure (`src/`)
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── common/          # Common shared components
│   ├── admin/           # Admin-specific components
│   └── regions/         # Region-specific components
├── pages/               # Page components (route components)
│   ├── admin/          # Admin dashboard pages
│   ├── regions/        # Region-specific pages
│   ├── country/        # Country detail pages
│   └── ...             # Other page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── data/                # Static data and mock data
├── config/              # Configuration files
├── integrations/        # Third-party integrations
│   └── supabase/       # Supabase client and types
├── routes/              # Route definitions
├── scripts/             # Build and utility scripts
├── ssr/                 # Server-side rendering setup
└── assets/              # Static assets (images, etc.)
```

## 🎯 Core Features & Architecture

### 1. **Routing Architecture**
- **React Router v6** for client-side routing
- Nested routing structure for regions and countries
- Dynamic route parameters for package and country details
- Protected admin routes with authentication

### 2. **Component Architecture**
- **Atomic Design** principles
- Reusable UI components with consistent props interface
- Component composition pattern
- HOCs and render props where appropriate

### 3. **State Management**
- **TanStack React Query** for server state
- Local component state with `useState` and `useReducer`
- Context API for global state (themes, user preferences)
- Custom hooks for business logic encapsulation

### 4. **Data Layer Architecture**
```
┌─────────────────┐
│   Components    │
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Custom Hooks   │ (usePackages, useCountries, etc.)
└─────────┬───────┘
          │
┌─────────▼───────┐
│  React Query    │ (Caching, Background Updates)
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Supabase SDK   │ (API Client)
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Supabase API   │ (REST/GraphQL)
└─────────────────┘
```

### 5. **Authentication & Authorization**
- Supabase Auth for user authentication
- Row Level Security (RLS) in PostgreSQL
- Role-based access control for admin features
- JWT tokens for secure API communication

## 🗂️ Key Application Areas

### 1. **Public Website**
- **Home Page** (`Index.tsx`) - Landing page with hero section
- **Packages** (`Packages.tsx`) - Travel package listings
- **Group Tours** (`GroupTours.tsx`) - Group tour offerings
- **Regions** - Continental travel destinations
- **Countries** - Country-specific travel information
- **Blog** - Travel blog and articles
- **About/Contact** - Company information

### 2. **Admin Dashboard**
- **Package Management** - CRUD operations for travel packages
- **Content Management** - Blog posts, static content
- **User Management** - Customer and booking management
- **Analytics** - Business metrics and reporting

### 3. **Booking System**
- **Modal-based booking** - `BookingModal.tsx`
- **Form validation** - Zod schemas with React Hook Form
- **Payment integration** - (To be implemented)

## 🔧 Configuration Files

### Build Configuration
- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`eslint.config.js`** - ESLint rules and plugins

### Styling Configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`postcss.config.js`** - PostCSS plugins
- **`components.json`** - Shadcn/ui component configuration

### Database Configuration
- **`supabase/config.toml`** - Supabase project configuration
- **`supabase/migrations/`** - Database schema migrations

## 🚀 Development Workflow

### Scripts
```json
{
  "dev": "vite --mode development",      // Development server
  "build": "vite build --mode production", // Production build
  "build:dev": "vite build --mode development", // Development build
  "lint": "eslint .",                    // Code linting
  "preview": "vite preview"              // Preview production build
}
```

### Development Server
- Runs on `http://localhost:8080`
- Hot module replacement (HMR)
- TypeScript checking in development

## 📊 Data Models

### Core Entities
1. **Packages** - Travel packages with itineraries
2. **Countries** - Destination countries with details
3. **Regions** - Continental groupings
4. **Group Tours** - Scheduled group tours
5. **Blog Posts** - Content management
6. **Users** - Customer accounts
7. **Bookings** - Reservation records

### Type Safety
- TypeScript interfaces for all data models
- Zod schemas for runtime validation
- Supabase generated types for database entities

## 🔐 Security Considerations

### Frontend Security
- Input validation with Zod
- XSS prevention with proper escaping
- CSRF protection via Supabase
- Environment variable management

### Backend Security (Supabase)
- Row Level Security (RLS) policies
- JWT token authentication
- Role-based access control
- API rate limiting

## 🎨 UI/UX Architecture

### Design System
- **Shadcn/ui** components for consistency
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible primitives
- **Responsive design** with mobile-first approach

### Theme Management
- Light/dark mode support with `next-themes`
- CSS custom properties for dynamic theming
- Consistent color palette and typography

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`
- **Large Desktop**: `> 1400px`

### Mobile-First Approach
- Progressive enhancement
- Touch-friendly interfaces
- Optimized images and assets

## 🧪 Testing Strategy

### Testing Tools (Future Implementation)
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **MSW** - API mocking

## 🚀 Deployment Architecture

### Build Process
1. TypeScript compilation
2. Vite bundling and optimization
3. Asset optimization
4. Static file generation

### Hosting Options
- **Vercel** (Recommended for React apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

## 🔮 Future Enhancements

### Planned Features
1. **Payment Integration** - Stripe/PayPal integration
2. **Real-time Chat** - Customer support
3. **Progressive Web App** - Offline functionality
4. **Multi-language Support** - i18n implementation
5. **Advanced Search** - Elasticsearch integration
6. **Mobile App** - React Native companion app

### Performance Optimizations
1. **Code Splitting** - Route-based splitting
2. **Image Optimization** - Next.js Image component equivalent
3. **Caching Strategy** - Service worker implementation
4. **Bundle Analysis** - Bundle size optimization

## 📖 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Git

### Setup Steps
1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables
4. Configure Supabase project
5. Run development server: `bun dev`

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

### Code Standards
- Follow TypeScript strict mode
- Use ESLint configuration
- Follow component naming conventions
- Write meaningful commit messages

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Critical fixes

---

This architecture document serves as the foundation for understanding and contributing to the Nymphette Travel project. For specific implementation details, refer to the individual component and page documentation within the codebase.