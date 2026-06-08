![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

# Dreamerz API

A RESTful API for hierarchical goal management, built around a three-tier model: **Dreams** (long-term ambitions) → **Goals** (milestones) → **Actions** (executable tasks). Users authenticate once and interact with their full goal tree through a single authenticated session.

The frontend counterpart lives at [dreamerz-front](https://github.com/YagoLagrottiBracco/dreamerz-front).

---

## Overview

Dreamerz exposes a token-secured REST API that lets users structure their aspirations into actionable units. A dream can have many goals; each goal can have many time-bound actions. The dashboard endpoint aggregates the entire tree in one round-trip, enabling efficient client rendering without multiple sequential fetches.

Authentication is stateless — every protected request carries a JWT Bearer token. The service runs as a Netlify serverless function, meaning there is no persistent server process to provision or scale.

---

## Architecture

```
dreamerz-api/
├── functions/
│   └── api.ts            # Serverless entry point (Netlify)
├── src/
│   ├── app/
│   │   ├── controllers/  # Route handlers (static class methods)
│   │   ├── helpers/      # JWT creation and extraction
│   │   ├── interfaces/   # TypeScript contracts for all domain types
│   │   ├── middlewares/  # Per-resource validation + shared error pipeline
│   │   └── models/       # Mongoose schema definitions
│   ├── configs/
│   │   ├── logger.config.ts   # Winston structured logging (dev-only)
│   │   └── mongo.config.ts    # MongoDB connection setup
│   ├── routes/
│   │   ├── public.routes.ts   # /register, /login (unauthenticated)
│   │   └── private.routes.ts  # /dashboard/** (JWT-protected)
│   └── server.ts         # Local dev entry point
└── tsconfig.json
```

### Key design decisions

**TypeScript end-to-end.** Interfaces (`IDream`, `IGoal`, `IAction`, `IUser`) are defined once and used by controllers, models, and middlewares alike. This eliminates entire classes of runtime type errors and makes refactoring safe — renaming a field surfaces every affected call site at compile time.

**Layered validation middleware.** Each resource has its own validation module (e.g., `dreamMiddleware.ts`) composed from `express-validator` chains. A shared `validationMiddleware` runs after each chain and short-circuits the request with a structured 422 if any rule fails. This keeps controller code free of validation logic and makes rules independently testable.

**Public/private route split.** Unauthenticated endpoints (`/register`, `/login`) and authenticated endpoints (`/dashboard/**`) live in separate router files. This makes the auth boundary explicit at the routing layer rather than burying it inside individual controller methods.

**Serverless deployment via `serverless-http`.** The same Express app is wrapped for Netlify Functions using `serverless-http`. The `functions/api.ts` entry point bootstraps the MongoDB connection and exports the handler — no process manager, no provisioned infrastructure.

**Environment-aware logging.** Winston is initialized only when `APP_ENV=development`. In production (serverless), the logger is `null` and all logger calls are guarded, avoiding cold-start overhead from file-transport setup and preventing log writes to a read-only serverless filesystem.

**Cascade delete on Dreams.** Deleting a dream triggers cascading deletes for all associated goals and actions. This is handled explicitly in `DreamController.deleteById` rather than relying on middleware hooks, keeping the side-effect visible and auditable.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Language | TypeScript 5.3 |
| Framework | Express 4 |
| Database | MongoDB (Mongoose 8 ODM) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Validation | `express-validator` |
| Logging | Winston (structured, multi-transport) |
| HTTP Logging | Morgan |
| Deployment | Netlify Functions (`serverless-http`) |
| Testing | Vitest + Supertest |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Installation

```bash
git clone https://github.com/YagoLagrottiBracco/dreamerz-api.git
cd dreamerz-api
npm install
```

### Running locally

```bash
npm start
```

The server starts with `ts-node-dev` in watch mode. Changes to any `.ts` file trigger an automatic restart.

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Server
API_PORT=          # Port for the local dev server
FRONT_PORT=        # Port of the frontend (used for CORS in local mode)
FRONT_URL=         # Full origin URL of the frontend (used in production CORS config)
APP_ENV=           # "development" enables Winston logging and Morgan HTTP logs

# Auth
JWT_SECRET=        # Secret key for signing and verifying JWT tokens

# MongoDB
DB_USER=           # MongoDB Atlas username
DB_PASSWORD=       # MongoDB Atlas password
DB_CLUSTER=        # Atlas cluster hostname (e.g. cluster0.xxxxx.mongodb.net)
DB_DATABASE=       # Database name
```

---

## API Endpoints

All private endpoints require the header:

```
Authorization: Bearer <token>
```

### Auth (public)

| Method | Path | Description |
|---|---|---|
| `POST` | `/register` | Create a new user account |
| `POST` | `/login` | Authenticate and receive a JWT |

### Dashboard (private)

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/dreams` | Fetch all dreams with nested goals and actions |

### Dreams (private)

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/dreams/find/:id` | Get a single dream by ID |
| `POST` | `/dashboard/dreams` | Create a dream (user resolved from token) |
| `PATCH` | `/dashboard/dreams/:id` | Update a dream |
| `DELETE` | `/dashboard/dreams/:id` | Delete a dream and cascade-delete its goals and actions |

### Goals (private)

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/goals/:idDream` | List all goals for a dream |
| `GET` | `/dashboard/goals/find/:id` | Get a single goal by ID |
| `POST` | `/dashboard/goals/:idDream` | Create a goal under a dream |
| `PATCH` | `/dashboard/goals/:id` | Update a goal |
| `DELETE` | `/dashboard/goals/:id` | Delete a goal |

### Actions (private)

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/actions/:idGoal` | List all actions for a goal |
| `GET` | `/dashboard/actions/find/:id` | Get a single action by ID |
| `POST` | `/dashboard/actions/:idGoal` | Create an action under a goal |
| `PATCH` | `/dashboard/actions/:id` | Update an action |
| `DELETE` | `/dashboard/actions/:id` | Delete an action |

### User (private)

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/user/profile` | Get the authenticated user's profile |
| `PATCH` | `/dashboard/user/profile/:id` | Update profile information |

---

## Data Model

```
User
 └── Dream (name, description, active)
      └── Goal (name, description, difficulty: easy|medium|hard, active)
           └── Action (name, description, difficulty, doneIn: Date, active)
```

Each entity carries `createdAt` and `updatedAt` timestamps via Mongoose's `{ timestamps: true }` option. Ownership is enforced by embedding a snapshot of the `user` object directly on Dream documents; all reads filter by `user._id` extracted from the JWT.
