# CountNow (즉카) - Real-Time Counting Web App

## Overview

CountNow is a mobile-first web application designed for spontaneous counting games and activities among family and friends. The app enables users to create instant counting sessions, track individual or group scores in real-time, and determine winners automatically. Key use cases include party games (English word ban, no-laughing challenges), fitness tracking (jump rope, push-ups), and casual family competitions.

The application prioritizes zero-friction onboarding - users can create a room and start counting within 10 seconds without registration. Sessions are shareable via simple room codes, support multiple simultaneous users, and provide automatic ranking and penalty suggestions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (routes: Home, SoloCount, QuickCount)
- React Query (TanStack Query) for server state management and data fetching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom playful utility design approach inspired by casual gaming interfaces (Kahoot, Jackbox) with productivity app precision
- Bright pastel color palette for player differentiation with neutral backgrounds
- Dark/light mode support through CSS variables

**State Management Strategy**
- Local storage for session persistence (recent rooms, player data)
- Component-level state with React hooks for UI interactions
- No centralized global state - leveraging React Query cache and local storage

**Key User Flows**
1. Solo counting: Single counter with increment/decrement, auto-saved to local storage
2. Multi-player setup: Quick player registration with preset labels (family members, numbers, animals)
3. Real-time counting: Player buttons with long-press for rapid increment, undo capability
4. Results & penalties: Automatic ranking, tie detection, random penalty wheel

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for REST API endpoints
- HTTP server foundation prepared for real-time upgrades
- Currently minimal backend - most logic client-side with local storage

**Session Management**
- Placeholder routes configured for future room/session endpoints
- In-memory storage interface (MemStorage) ready for database integration
- Room code generation using client-side random strings

**Real-Time Sync Strategy** (Planned)
- WebSocket support structure in place via HTTP server instance
- Intended for multi-device synchronization within game sessions
- Event-driven updates for count changes, player actions, timer events

### Data Storage

**Current Implementation**
- Browser localStorage for session persistence
- Client-side data structures:
  - SoloSession: room code, count, timestamp
  - MultiSession: room code, players array, counts, timestamp
  - Maximum 10 recent sessions cached

**Database Schema** (Drizzle ORM Ready)
- PostgreSQL dialect configured via Drizzle Kit
- Schema defined in `shared/schema.ts` with users table template
- Connection configured for Neon serverless Postgres
- Migration system ready (`drizzle-kit push`)

**Planned Data Models**
- Rooms/Sessions: code, mode, timer settings, created timestamp
- Players: name, emoji, color, counts per session
- Events: player actions, timestamps for activity logs

### External Dependencies

**UI Component Libraries**
- @radix-ui/* (20+ component primitives): Accordion, Dialog, Dropdown, Toast, etc.
- embla-carousel-react: Touch-friendly carousel for mobile UX
- lucide-react: Icon system
- class-variance-authority: Type-safe component variants
- tailwind-merge + clsx: Conditional className utilities

**Form & Validation**
- react-hook-form: Form state management
- @hookform/resolvers: Form validation integration
- zod: Runtime type validation
- drizzle-zod: Database schema to Zod schema conversion

**Database & ORM**
- drizzle-orm: TypeScript ORM for PostgreSQL
- @neondatabase/serverless: Serverless Postgres driver
- drizzle-kit: Schema migration toolkit

**Build & Development Tools**
- @vitejs/plugin-react: React Fast Refresh
- @replit/vite-plugin-runtime-error-modal: Development error overlay
- tsx: TypeScript execution for server
- esbuild: Production server bundling

**Styling**
- tailwindcss + autoprefixer: Utility CSS framework
- postcss: CSS processing
- Inter font family: Typography (via Google Fonts)

**Session Management** (Prepared)
- express-session (implied by connect-pg-simple)
- connect-pg-simple: PostgreSQL session store

**Utility Libraries**
- date-fns: Date formatting and manipulation
- nanoid: Unique ID generation
- wouter: Minimalist routing (< 2KB alternative to React Router)