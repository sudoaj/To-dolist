# Todo List Application

## Overview

This is a full-stack todo list application built with React frontend and Express backend. The application uses modern web technologies including TypeScript, Tailwind CSS, and Radix UI components for a polished user experience. It features user authentication via Replit Auth, persistent data storage with PostgreSQL, and a comprehensive todo management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas for API request/response validation
- **Error Handling**: Centralized error handling middleware

## Key Components

### Database Schema
- **Users Table**: Stores user profile information (mandatory for Replit Auth)
- **Sessions Table**: Manages user sessions (mandatory for Replit Auth)
- **Todos Table**: Main application data with user relationships
- **Migrations**: Managed through Drizzle Kit

### Authentication System
- **Replit Auth Integration**: Handles OAuth flow with Replit's identity provider
- **Session Management**: Persistent sessions stored in PostgreSQL
- **Route Protection**: Middleware to protect API endpoints
- **User Management**: Automatic user creation and profile updates

### API Endpoints
- **Authentication**: `/api/auth/user` - Get current user info
- **Todos CRUD**: 
  - `GET /api/todos` - List user's todos
  - `POST /api/todos` - Create new todo
  - `GET /api/todos/:id` - Get specific todo
  - `PATCH /api/todos/:id` - Update todo
  - `DELETE /api/todos/:id` - Delete todo

### Frontend Components
- **TodoForm**: Form for creating new todos
- **TodoList**: Display and manage todos with filtering
- **TodoItem**: Individual todo component with actions
- **TodoFilters**: Filter todos by status (all/active/completed)
- **Edit/Delete Dialogs**: Modal interfaces for todo management

## Data Flow

1. **User Authentication**: User authenticates via Replit Auth, session stored in PostgreSQL
2. **Todo Operations**: Frontend makes API calls to Express backend
3. **Database Operations**: Backend uses Drizzle ORM to interact with PostgreSQL
4. **State Management**: TanStack Query manages cache and synchronization
5. **Real-time Updates**: Optimistic updates with automatic cache invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **react-hook-form**: Form handling
- **zod**: Runtime type validation
- **framer-motion**: Animation library

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast bundling for production

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR
- **Backend**: Node.js server with auto-restart
- **Database**: PostgreSQL connection via environment variables

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Process**: Single Node.js process serves both frontend and API

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Allowed domains for Replit Auth
- **ISSUER_URL**: OAuth issuer endpoint

The application follows a modern monolithic architecture with clear separation between frontend and backend concerns, while maintaining simplicity for development and deployment.