# AI Content Platform - Multi-Workspace Collaborative Environment

A comprehensive multi-workspace AI content platform built with the MERN stack (MongoDB, Express, React, Node.js) that enables teams to collaborate on AI-powered content generation.

## Project Overview

This project aims to create a full-stack application where users can create multiple workspaces, invite team members with different permission levels, and generate AI content using OpenAI's API. The platform supports role-based access control, subscription management, and collaborative content creation.

## Implementation Checklist

### 1. Backend Setup (Node.js & Express)

- [x] Initialize Express project
- [ ] Set up MongoDB connection
- [ ] Configure middleware (CORS, body parser, error handling)
- [ ] Implement JWT authentication
- [ ] Integrate Clerk authentication
- [ ] Set up environment variables

### 2. Database Models (MongoDB)

- [ ] User model (synced with Clerk)
- [ ] Workspace model
- [ ] WorkspaceMember model (with roles)
- [ ] Content model
- [ ] Subscription model
- [ ] APIKey model
- [ ] Template model

### 3. Authentication & Authorization

- [ ] Implement Clerk authentication integration
- [ ] Create webhooks for Clerk user events
- [ ] Set up user synchronization between Clerk and MongoDB
- [ ] Implement JWT middleware for API routes
- [ ] Create role-based access control middleware
- [ ] Implement subscription tier limitations

### 4. API Endpoints

#### Authentication Endpoints
- [ ] User registration and login (via Clerk)
- [ ] Current user information retrieval
- [ ] Session management

#### Workspace Endpoints
- [ ] Create, read, update, delete workspaces
- [ ] List user's workspaces
- [ ] Workspace statistics

#### Workspace Member Endpoints
- [ ] Invite members to workspace
- [ ] Update member roles
- [ ] Remove members
- [ ] List workspace members

#### Content Endpoints
- [ ] Create, read, update, delete content
- [ ] List workspace content
- [ ] Content version history

#### AI Generation Endpoints
- [ ] Generate content using OpenAI
- [ ] Save and manage templates
- [ ] Track API usage

#### Subscription Endpoints
- [ ] Create, update subscriptions
- [ ] Check subscription limits
- [ ] Subscription status and features

### 5. Frontend Setup (React)

- [ ] Initialize React project with Create React App
- [ ] Set up folder structure
- [ ] Configure routing with React Router
- [ ] Set up Clerk authentication components
- [ ] Implement Redux Toolkit for state management
- [ ] Set up RTK Query for API integration
- [ ] Configure Tailwind CSS for styling

### 6. Frontend Components & Pages

#### Authentication
- [ ] Signup/Login pages
- [ ] User profile page
- [ ] Account settings

#### Dashboard
- [ ] Main dashboard with stats
- [ ] Workspace selection
- [ ] Recent activity

#### Workspace Management
- [ ] Workspace creation form
- [ ] Workspace settings page
- [ ] Workspace member management

#### Content Creation
- [ ] Content editor
- [ ] AI generation interface
- [ ] Template selection and management
- [ ] Content history and versioning

#### Subscription Management
- [ ] Subscription plans display
- [ ] Upgrade/downgrade interface
- [ ] Usage tracking and limits display

#### Administration
- [ ] Admin dashboard
- [ ] User management
- [ ] System settings

### 7. Redux Implementation

- [ ] Auth slice
- [ ] Workspace slice
- [ ] Content slice
- [ ] Subscription slice
- [ ] API key slice
- [ ] UI state slice
- [ ] RTK Query API definitions

### 8. OpenAI Integration

- [ ] API key management
- [ ] Content generation service
- [ ] Template-based generation
- [ ] Rate limiting and usage tracking
- [ ] Error handling for API requests

### 9. Subscription Features

- [ ] Define subscription tiers (Free, Basic, Pro, Enterprise)
- [ ] Implement feature limitations based on tier
- [ ] Track usage against subscription limits
- [ ] Implement upgrade/downgrade logic

### 10. Role-Based Access Control

- [ ] Define roles (Admin, Editor, Viewer)
- [ ] Implement permission checks in components
- [ ] Secure API endpoints with role middleware
- [ ] Role-based UI rendering

### 11. Testing

- [ ] Backend unit tests
- [ ] API integration tests
- [ ] Frontend component tests
- [ ] End-to-end tests

### 12. Deployment

- [ ] Set up Docker configuration
- [ ] Configure CI/CD pipeline
- [ ] Prepare production environment
- [ ] Deploy application

## Tech Stack Details

### Backend
- **Node.js & Express**: Server runtime and framework
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: ODM for MongoDB interaction
- **Clerk**: Authentication provider
- **JWT**: Token-based API authorization
- **OpenAI API**: AI content generation
- **Express Middleware**: Custom middleware for auth, validation, etc.

### Frontend
- **React**: UI library
- **Redux Toolkit**: State management
- **RTK Query**: Data fetching and caching
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Clerk React**: Authentication components
- **React Hook Form**: Form validation and handling
- **React Toastify**: Notifications
- **React Icons**: Icon library
- **Chart.js**: Data visualization

## Database Schema

### User
{
_id: ObjectId,
clerkId: String,
email: String,
firstName: String,
lastName: String,
imageUrl: String,
defaultWorkspace: ObjectId (ref: Workspace),
subscription: {
plan: String (enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE']),
status: String (enum: ['ACTIVE', 'INACTIVE', 'PAST_DUE']),
currentPeriodEnd: Date,
usageThisMonth: Number
},
apiKeys: [ObjectId (ref: APIKey)],
createdAt: Date,
updatedAt: Date
}



### Workspace
{
_id: ObjectId,
name: String,
description: String,
ownerId: ObjectId (ref: User),
members: [ObjectId (ref: WorkspaceMember)],
contentCount: Number,
createdAt: Date,
updatedAt: Date
}



### WorkspaceMember
{
_id: ObjectId,
workspaceId: ObjectId (ref: Workspace),
userId: ObjectId (ref: User),
role: String (enum: ['ADMIN', 'EDITOR', 'VIEWER']),
status: String (enum: ['ACTIVE', 'PENDING', 'INACTIVE']),
invitedBy: ObjectId (ref: User),
inviteEmail: String,
joinedAt: Date,
createdAt: Date,
updatedAt: Date
}



### Content
{
_id: ObjectId,
workspaceId: ObjectId (ref: Workspace),
title: String,
description: String,
type: String (enum: ['ARTICLE', 'BLOG', 'SOCIAL', 'EMAIL', 'CUSTOM']),
content: String,
prompt: String,
tags: [String],
creator: ObjectId (ref: User),
lastEditor: ObjectId (ref: User),
versions: [{
content: String,
timestamp: Date,
editor: ObjectId (ref: User)
}],
isPublic: Boolean,
createdAt: Date,
updatedAt: Date
}



### APIKey
{
_id: ObjectId,
userId: ObjectId (ref: User),
provider: String (enum: ['OPENAI']),
key: String (encrypted),
name: String,
isDefault: Boolean,
isActive: Boolean,
lastUsed: Date,
createdAt: Date,
updatedAt: Date
}



### Template
{
_id: ObjectId,
workspaceId: ObjectId (ref: Workspace),
name: String,
description: String,
promptTemplate: String,
creator: ObjectId (ref: User),
isPublic: Boolean,
category: String,
usageCount: Number,
createdAt: Date,
updatedAt: Date
}


Collapse

## API Routes Documentation

### Authentication
- `POST /api/auth/webhook` - Clerk webhook handler
- `GET /api/auth/me` - Get current user

### Workspaces
- `GET /api/workspaces` - Get user's workspaces
- `POST /api/workspaces` - Create a new workspace
- `GET /api/workspaces/:id` - Get workspace details
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Workspace Members
- `GET /api/workspaces/:id/members` - Get workspace members
- `POST /api/workspaces/:id/members` - Add member to workspace
- `PUT /api/workspaces/:id/members/:userId` - Update member role
- `DELETE /api/workspaces/:id/members/:userId` - Remove member

### Content
- `GET /api/workspaces/:id/content` - Get workspace content
- `POST /api/workspaces/:id/content` - Create new content
- `GET /api/workspaces/:id/content/:contentId` - Get content details
- `PUT /api/workspaces/:id/content/:contentId` - Update content
- `DELETE /api/workspaces/:id/content/:contentId` - Delete content
- `GET /api/workspaces/:id/content/:contentId/versions` - Get content versions

### AI Generation
- `POST /api/ai/generate` - Generate content using AI
- `GET /api/ai/templates` - Get AI templates
- `POST /api/ai/templates` - Create AI template
- `PUT /api/ai/templates/:id` - Update AI template
- `DELETE /api/ai/templates/:id` - Delete AI template

### API Keys
- `GET /api/api-keys` - Get user's API keys
- `POST /api/api-keys` - Add new API key
- `PUT /api/api-keys/:id` - Update API key
- `DELETE /api/api-keys/:id` - Delete API key
- `POST /api/api-keys/:id/verify` - Verify API key

### Subscriptions
- `GET /api/subscriptions/me` - Get user's subscription
- `POST /api/subscriptions/upgrade` - Upgrade subscription
- `POST /api/subscriptions/downgrade` - Downgrade subscription
- `GET /api/subscriptions/usage` - Get usage statistics

## Implementation Challenges

1. **Clerk Authentication Integration**:
   - Configure Clerk webhooks correctly
   - Synchronize user data between Clerk and MongoDB
   - Handle user updates and deletions

2. **Role-Based Access Control**:
   - Implement middleware to check role permissions
   - Create UI components that adapt to user roles
   - Ensure proper workspace security

3. **OpenAI API Integration**:
   - Securely store and manage API keys
   - Implement rate limiting and usage tracking
   - Handle OpenAI API errors gracefully

4. **Multi-Workspace Architecture**:
   - Design database schema to support multiple workspaces
   - Implement proper data isolation between workspaces
   - Create UI for switching between workspaces

5. **Subscription Management**:
   - Implement feature limitations based on subscription tier
   - Track and limit usage based on subscription
   - Create upgrade/downgrade flows

## Development Environment Setup

1. **Required Software**:
   - Node.js (v14+)
   - MongoDB (local or Atlas)
   - npm or yarn
   - Git

2. **Service Accounts**:
   - Clerk developer account
   - OpenAI API account
   - MongoDB Atlas account (for production)

3. **Environment Variables**:
   - Create `.env` files as specified in the installation section
   - Never commit environment files to Git repositories

## Testing Strategy

1. **Unit Tests**:
   - Test MongoDB models
   - Test utility functions
   - Test Redux reducers and actions

2. **Integration Tests**:
   - Test API endpoints
   - Test authentication flows
   - Test database operations

3. **E2E Tests**:
   - Test user registration and login
   - Test workspace creation and management
   - Test content generation and management

## Future Enhancements

1. **Real-time Collaboration**:
   - Implement WebSockets for live editing
   - Add commenting system on content
   - Create activity feeds

2. **Advanced AI Features**:
   - Multiple AI provider support
   - Fine-tuning options for models
   - More content types and templates

3. **Analytics Dashboard**:
   - Content performance metrics
   - Usage statistics and trends
   - Team productivity insights

4. **Export and Integration Options**:
   - Export content to various formats
   - Integrate with CMS platforms
   - Implement API for third-party integrations

5. **Mobile Support**:
   - Responsive design improvements
   - Progressive Web App features
   - Mobile notifications

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [Clerk](https://clerk.dev/) - Authentication provider
- [OpenAI](https://openai.com/) - AI services
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend library
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
