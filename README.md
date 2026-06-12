<p align="center">
  <h1 align="center">🦷 UniDent Care</h1>
  <p align="center">
    A comprehensive dental healthcare management platform connecting <b>Patients</b>, <b>Doctors</b>, <b>Students</b>, and <b>Clinical Doctors</b> — featuring AI-powered assistance, interactive dental charting, session tracking, role-based dashboards, and more.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-1.4-161618?logo=radixui" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer" alt="Framer Motion" />
</p>

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Mariam-Huussein/UniDent-Care.git
cd UniDent-Care

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API base URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start development server   |
| `npm run build` | Create production build    |
| `npm run start` | Start production server    |
| `npm run lint`  | Run ESLint code analysis   |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td><b>Category</b></td>
    <td><b>Technology</b></td>
  </tr>
  <tr>
    <td><b>Framework</b></td>
    <td>Next.js 16 (App Router) with React Compiler</td>
  </tr>
  <tr>
    <td><b>Language</b></td>
    <td>TypeScript 5</td>
  </tr>
  <tr>
    <td><b>Styling</b></td>
    <td>Tailwind CSS 4 · tw-animate-css · tailwind-merge · clsx · class-variance-authority (CVA)</td>
  </tr>
  <tr>
    <td><b>UI Components</b></td>
    <td>Radix UI (via shadcn/ui) — Dialog, Calendar, Progress, Badge, Separator, and more</td>
  </tr>
  <tr>
    <td><b>State Management</b></td>
    <td>Redux Toolkit + React Redux</td>
  </tr>
  <tr>
    <td><b>Server State</b></td>
    <td>TanStack React Query (+ DevTools)</td>
  </tr>
  <tr>
    <td><b>Forms & Validation</b></td>
    <td>React Hook Form + @hookform/resolvers + Zod</td>
  </tr>
  <tr>
    <td><b>Animations</b></td>
    <td>Framer Motion</td>
  </tr>
  <tr>
    <td><b>Charts</b></td>
    <td>Recharts</td>
  </tr>
  <tr>
    <td><b>Calendar</b></td>
    <td>FullCalendar (Day Grid, Time Grid, List, Interaction plugins)</td>
  </tr>
  <tr>
    <td><b>Carousels / Sliders</b></td>
    <td>Swiper · Embla Carousel</td>
  </tr>
  <tr>
    <td><b>Dental Charting</b></td>
    <td>react-odontogram</td>
  </tr>
  <tr>
    <td><b>HTTP Client</b></td>
    <td>Axios</td>
  </tr>
  <tr>
    <td><b>Auth Utilities</b></td>
    <td>js-cookie</td>
  </tr>
  <tr>
    <td><b>Date Utilities</b></td>
    <td>date-fns · react-day-picker</td>
  </tr>
  <tr>
    <td><b>Icons</b></td>
    <td>Lucide React · Font Awesome (via @fortawesome) · React Icons</td>
  </tr>
  <tr>
    <td><b>Theming</b></td>
    <td>next-themes (Dark / Light / System)</td>
  </tr>
  <tr>
    <td><b>Notifications</b></td>
    <td>React Hot Toast</td>
  </tr>
  <tr>
    <td><b>Typography</b></td>
    <td>Plus Jakarta Sans · Geist (via next/font)</td>
  </tr>
</table>

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Multi-role signup (Doctor, Student, Patient)
- JWT-based authentication with token persistence via cookies
- Route-level **Role-Based Access Control (RBAC)** — each route is restricted to permitted roles
- Forgot password & reset password flows

### 👥 Four Distinct User Roles

| Role               | Capabilities                                                               |
| ------------------ | -------------------------------------------------------------------------- |
| **Patient**        | Submit cases, track treatments, view dashboard analytics, AI chatbot       |
| **Student**        | Browse available cases, manage assigned cases, track academic progress      |
| **Doctor**         | Supervise students, review pending requests, manage student cases          |
| **Clinical Doctor** | Create clinical cases, browse case library, manage platform settings      |

### 📋 Case Management
- Create, view, and manage dental cases with rich media (images/videos via Swiper gallery)
- Interactive **dental odontogram** for tooth-level diagnosis charting
- Multi-tab case detail view: Clinical data, Tracking timeline, and more
- Case progress tracking with visual progress indicators
- Student ↔ Doctor case assignment & approval workflow

### 🩺 Session Tracking
- Activity timeline for clinical sessions
- Session-by-session note-taking and media attachments
- Doctor evaluation and feedback system for student sessions

### 📊 Role-Based Dashboards
- **Patient Dashboard**: Stats cards, treatment charts (Recharts), upcoming appointments, recent cases, calendar widget
- **Student Dashboard**: Academic progress, current cases, upcoming deadlines & sessions, request analytics
- **Doctor Dashboard**: Stat cards, interactive calendar (FullCalendar) with day-detail drawer, supervision overview

### 🤖 AI-Powered Chatbot
- Available to patients for dental health guidance

### 🌍 Internationalization (i18n)
- Custom language provider with full dictionary support
- UI adapts based on selected language

### 🌙 Dark Mode
- System-aware theming via `next-themes`
- Smooth transitions between light, dark, and system themes

### ⚙️ Settings
- User preference management accessible to all roles

---

## 📁 Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (fonts, providers, theming)
│   ├── page.tsx                      # Landing page
│   ├── not-found.tsx                 # Custom 404 page
│   │
│   ├── (authentication)/             # Public auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   └── student/
│   │   ├── forget-password/
│   │   └── reset-password/
│   │
│   ├── (protected)/                  # Authenticated routes (with Sidebar layout)
│   │   ├── layout.tsx                # Sidebar + main content wrapper
│   │   ├── dashboard/                # Role-based dashboard
│   │   ├── profile/                  # User profile
│   │   ├── settings/                 # User settings
│   │   ├── cases/                    # Browse all cases
│   │   ├── my-cases/                 # User's own cases
│   │   ├── add-case/                 # Create case (Clinical Doctor)
│   │   ├── add-my-case/              # Submit case (Patient)
│   │   ├── my-students-cases/        # Doctor's student cases
│   │   ├── pending-request/          # Pending case requests (Doctor)
│   │   ├── ai-chatbot/              # AI chatbot (Patient)
│   │   ├── forbidden/               # 403 unauthorized page
│   │   └── unauthorized/
│
├── features/                         # Feature-based modules
│   ├── auth/                         # Authentication (schemas, services, store, types)
│   ├── cases/                        # Case management
│   │   ├── components/
│   │   │   ├── AvailableCases/       # Case browsing
│   │   │   ├── CaseCard/            # Case card component
│   │   │   ├── CaseDetails/         # Rich case detail view
│   │   │   │   ├── Clinical/        # Odontogram + dental image gallery
│   │   │   │   ├── Layout/          # Top bar, info panel, progress tracker, actions
│   │   │   │   ├── Shared/          # Reusable detail/info cards
│   │   │   │   ├── Tabs/            # Tab navigation
│   │   │   │   └── Tracking/        # Activity timeline
│   │   │   ├── MyCasesStudent/      # Student case view
│   │   │   └── Request/             # Case requests
│   │   ├── context/                 # Case-level context providers
│   │   ├── hooks/                   # Data-fetching & mutation hooks
│   │   ├── schemas/                 # Zod validation schemas
│   │   ├── screens/                 # Page-level components
│   │   ├── server/                  # Server actions
│   │   ├── services/                # API service layer
│   │   ├── types/                   # TypeScript interfaces
│   │   └── utils/                   # Case-specific helpers
│   ├── dashboard/                   # Dashboard feature
│   │   ├── components/
│   │   │   ├── doctor/              # Doctor dashboard widgets
│   │   │   ├── patient/             # Patient dashboard widgets
│   │   │   └── student/             # Student dashboard widgets
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── server/                  # Server-side data fetching
│   │   └── services/
│   ├── session/                     # Session tracking
│   │   ├── components/
│   │   │   ├── MainSession/
│   │   │   └── SessionTimeLine/     # Activity timeline
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── Screens/
│   │   ├── server/
│   │   ├── services/
│   │   └── types/
│   ├── profile/                     # Profile management
│   ├── add-case/                    # Case creation flow
│   └── settings/                    # User settings
│
├── components/                       # Shared/global components
│   ├── ui/                          # shadcn/ui primitives (Button, Card, Dialog, Calendar, etc.)
│   ├── common/                      # Reusable business components (DataTable, Pagination, StatCard, etc.)
│   ├── shared/                      # Layout components (Sidebar)
│   ├── providers/                   # Context providers (Theme, Language, Store, StoreInitializer)
│   └── types/                       # Component type definitions
│
├── store/                           # Redux store configuration
├── server/                          # Server actions (case types, universities, users)
├── services/                        # Global service layer
├── lib/                             # Utility functions (cn, animations)
├── config/                          # Nav links & route permissions (RBAC)
├── constants/                       # App constants
├── types/                           # Global TypeScript types
├── utils/                           # Global utilities (Axios instance, i18n dictionaries, helpers)
├── styles/                          # Global CSS styles
└── assets/                          # Static assets (images, icons)
```

---

## 🧩 Feature Module Pattern

Each feature follows a consistent, scalable structure:

```
feature/
├── components/      # UI components (further organized by sub-feature)
├── hooks/           # Custom React hooks (data fetching, mutations)
├── schemas/         # Zod validation schemas
├── screens/         # Page-level screen components
├── context/         # React context providers
├── server/          # Next.js server actions
├── services/        # API service functions (Axios)
├── store/           # Redux slice (if needed)
├── types/           # TypeScript interfaces & types
└── utils/           # Feature-specific helper functions
```

---

## 🔗 Routes & Permissions

| Route                | Description              | Allowed Roles                    |
| -------------------- | ------------------------ | -------------------------------- |
| `/`                  | Landing page             | Public                           |
| `/login`             | Login                    | Public                           |
| `/signup/*`          | Registration             | Public                           |
| `/forget-password`   | Password recovery        | Public                           |
| `/reset-password`    | Password reset           | Public                           |
| `/dashboard`         | Role-based dashboard     | Doctor, Student, Patient         |
| `/profile`           | User profile             | Doctor, Student, Patient         |
| `/settings`          | User settings            | All roles                        |
| `/cases`             | Browse all cases         | Doctor, Student, Clinical Doctor |
| `/my-cases`          | My cases                 | Student, Patient                 |
| `/add-case`          | Create clinical case     | Clinical Doctor                  |
| `/add-my-case`       | Submit patient case      | Patient                          |
| `/my-students-cases` | Supervised student cases | Doctor                           |
| `/pending-request`   | Pending case requests    | Doctor                           |
| `/ai-chatbot`        | AI dental assistant      | Patient                          |

---

## 📦 Dependencies

### Production

| Package                      | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `next`                       | React framework (App Router, Server Actions) |
| `react` / `react-dom`        | UI library (v19)                             |
| `@reduxjs/toolkit`           | Global state management                      |
| `react-redux`                | React bindings for Redux                     |
| `@tanstack/react-query`      | Server state & data fetching                 |
| `@tanstack/react-query-devtools` | Query debugging tools                    |
| `react-hook-form`            | Performant form handling                     |
| `@hookform/resolvers`        | Form validation resolvers                    |
| `zod`                        | Schema-based validation                      |
| `axios`                      | HTTP client                                  |
| `radix-ui`                   | Headless UI primitives                       |
| `shadcn`                     | UI component scaffolding                     |
| `framer-motion`              | Declarative animations                       |
| `recharts`                   | Dashboard charts & analytics                 |
| `@fullcalendar/*`            | Interactive calendar (6 plugins)             |
| `swiper`                     | Touch-friendly carousels & media sliders     |
| `embla-carousel-react`       | Lightweight carousel engine                  |
| `react-odontogram`           | Interactive dental chart                     |
| `lucide-react`               | Modern icon set                              |
| `@fortawesome/*`             | Font Awesome icons (5 packages)              |
| `react-icons`                | Additional icon library                      |
| `next-themes`                | Dark / light / system theme support          |
| `react-hot-toast`            | Toast notifications                          |
| `js-cookie`                  | Cookie management                            |
| `date-fns`                   | Date utility library                         |
| `react-day-picker`           | Date picker component                        |
| `class-variance-authority`   | Component variant management (CVA)           |
| `clsx`                       | Conditional className utility                |
| `tailwind-merge`             | Tailwind class conflict resolution           |
| `tw-animate-css`             | Tailwind animation utilities                 |

### Development

| Package                   | Purpose                        |
| ------------------------- | ------------------------------ |
| `typescript`              | Type checking                  |
| `tailwindcss`             | Utility-first CSS framework    |
| `@tailwindcss/postcss`    | PostCSS integration            |
| `eslint` / `eslint-config-next` | Code linting             |
| `babel-plugin-react-compiler` | React Compiler support     |
| `@types/*`                | TypeScript type definitions    |

---

## 🏗️ Architecture Highlights

- **App Router** — Leverages Next.js 16 App Router with route groups (`(authentication)`, `(protected)`) for clean layout separation
- **React Compiler** — Enabled via `babel-plugin-react-compiler` for automatic memoization
- **Feature-Based Architecture** — Code is organized by domain features, not file types, improving scalability and maintainability
- **Server Actions** — Next.js server actions for secure server-side data fetching
- **RBAC Middleware** — Route permissions are defined in a centralized config and enforced at the layout level
- **Provider Stack** — Composable provider hierarchy: Theme → Language → Store → StoreInitializer
- **Responsive Design** — Mobile-first layouts with sidebar navigation that adapts to all screen sizes

---

## 👥 Team Members & Contributors

### This platform was designed and developed as a graduation project by:

* ### [Mariam Hussein](https://github.com/Mariam-Huussein)

* ### [Ibrahim Nour Eldeen](https://github.com/IbrahimNourEldeen)

* ### [Ziad Mohamed](https://github.com/ziad-mohamed-mern)

---

<p align="center">
  Made for a better dental healthcare !
</p>