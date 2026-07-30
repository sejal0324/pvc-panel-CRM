# PVC Panel CRM / ERP Suite

A modern CRM-style web application for managing clients, lead discovery, task scheduling, and business operations for a PVC panel distribution enterprise. The project combines a React-based frontend with a Node.js/Express backend and a PostgreSQL data layer to provide a streamlined workflow for sales and operations teams.

## Overview

This platform is designed to help an organization:

- onboard and manage client accounts
- discover and qualify new leads
- convert approved leads into clients
- schedule follow-up visits and tasks
- track a simple inventory overview
- provide AI-assisted customer insights and recommendations

## Key Features

- Secure authentication with JWT-based access control
- Client dashboard for viewing, editing, and managing business accounts
- Lead pipeline with qualification, approval, and rejection workflows
- Lead discovery engine with scoring and enrichment logic
- Task management for visits and follow-ups
- Inventory overview UI for operational visibility
- Role-based user experience for investors and business users

## Technology Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS modules / component styling

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- CORS and dotenv support

## Architectural Flow

The application follows a layered, event-driven CRM architecture designed for clarity and maintainability:

```text
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                │
│  AuthForm  │  ClientDashboard  │  LeadDashboard  │  Tasks  │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                │ HTTP / Axios
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Express.js)                 │
│  Routes  →  Controllers  →  Services  →  Repositories     │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                │ SQL / PostgreSQL
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer (PostgreSQL)              │
│  users  │  investors  │  client  │  lead  │  task  │  zone │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```text
User Action
  ↓
React Component
  ↓
API Call (Axios)
  ↓
Express Route
  ↓
Controller
  ↓
Service Layer
  ↓
Repository Layer
  ↓
PostgreSQL Database
```

### Lead Discovery Flow

```text
Lead Discovery Request
  ↓
Discovery Engine
  ↓
Data Normalization
  ↓
Qualification Engine
  ↓
Lead Service
  ↓
PostgreSQL Storage
  ↓
Approval Workflow → Client Conversion
```

### Core Architectural Layers

- Frontend Layer: renders dashboards, forms, and navigation for users
- API Layer: exposes authenticated endpoints for clients, leads, tasks, and auth
- Service Layer: contains business rules such as validation, lead scoring, and task creation
- Repository Layer: handles all database queries and persistence operations
- Data Layer: stores business records and operational relationships

## Project Structure

```text
backend/
  app.js
  config/
  controllers/
  engines/
  middleware/
  repositories/
  routes/
  services/

frontend/
  src/
    apis/
    components/
    services/
```

## Backend Modules

- auth
  - user signup/login and JWT generation
- clients
  - create, read, update, delete, and schedule visits/follow-ups
- leads
  - create leads, retrieve them, approve or reject them, and discover new prospects
- tasks
  - fetch tasks assigned to the current investor
- engines
  - lead discovery and qualification logic

## Frontend Modules

- AuthForm
  - login and registration experience
- ClientDashboard
  - searchable client list and management actions
- ClientDetails
  - detailed client profile and AI-style insights panel
- LeadDashboard
  - lead pipeline with filtering and review actions
- TasksPage
  - task overview for visits and follow-ups
- InventoryPage
  - inventory snapshot and operational summary

## Setup Instructions

### Prerequisites

- Node.js installed
- PostgreSQL running locally
- npm or yarn available

### 1. Clone the repository

```bash
git clone <repo-url>
cd pvc-panel-CRM
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Configure the database

Update the PostgreSQL connection settings in:

- backend/config/db.js

The backend expects a PostgreSQL database with tables such as:

- users
- investors
- client
- lead
- task
- zone_assignment
- zone

### 4. Set environment variables

Create a .env file in the backend folder with at least:

```env
JWT_SECRET=your_secret_key
```

### 5. Run the application

Start the backend:

```bash
cd backend
node app.js
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend will usually run on the Vite dev server and the backend on port 3000.

## API Overview

### Authentication
- POST /auth/signup
- POST /auth/login

### Clients
- POST /clients
- GET /clients
- GET /clients/:id
- PUT /clients/:id
- DELETE /clients/:id
- POST /clients/:id/visit
- POST /clients/:id/followup

### Leads
- POST /leads
- GET /leads
- GET /leads/:id
- PATCH /leads/:id/approve
- PATCH /leads/:id/reject
- POST /leads/discover

### Tasks
- GET /tasks

## Current Project Notes

This repository is a strong MVP foundation for a sales-driven CRM platform. Some parts are still in a prototype stage, including:

- mocked lead discovery data in the discovery engine
- placeholder AI analysis in the client insight layer
- simple inventory UI without a full backend inventory module

## Future Enhancements

Possible next steps for the product include:

- real-time inventory management with persistence
- integration with external lead providers or search APIs
- AI-powered lead scoring with Gemini/OpenAI services
- role-based dashboards for sales, operations, and admins
- notifications, reminders, and reporting analytics

## License

This project is intended for internal business use and is currently distributed as a development prototype.

