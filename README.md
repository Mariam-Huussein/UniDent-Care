<p align="center">
  <h1 align="center">🦷 UniDent Care</h1>
  <p align="center">
    A modern dental healthcare management platform connecting patients, doctors, and students
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
</p>

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td><b>Framework</b></td>
    <td>Next.js 16 (App Router)</td>
  </tr>
  <tr>
    <td><b>Language</b></td>
    <td>TypeScript 5</td>
  </tr>
  <tr>
    <td><b>Styling</b></td>
    <td>Tailwind CSS 4</td>
  </tr>
  <tr>
    <td><b>State</b></td>
    <td>Redux Toolkit + React Query</td>
  </tr>
  <tr>
    <td><b>Forms</b></td>
    <td>React Hook Form + Zod</td>
  </tr>
  <tr>
    <td><b>HTTP</b></td>
    <td>Axios</td>
  </tr>
  <tr>
    <td><b>Icons</b></td>
    <td>Font Awesome</td>
  </tr>
  <tr>
    <td><b>Toasts</b></td>
    <td>React Hot Toast</td>
  </tr>
</table>

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (authentication)/         # Auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   └── student/
│   │   ├── forget-password/
│   │   └── reset-password/
│   │
│   ├── dashboard/                # Dashboard
│   ├── profile/                  # User profile
│   ├── cases/[id]/               # All cases
│   ├── my-cases/[id]/            # User's cases
│   ├── add-case/                 # Create case
│   ├── my-student/[id]/          # Doctor's students
│   └── pending-cases/[id]/       # Pending review
│
├── features/                     # Feature modules
│   ├── auth/
│   ├── cases/
│   ├── dashboard/
│   └── profile/
│
├── components/                   # Shared components
├── hooks/                        # Global hooks
├── store/                        # Redux store
├── types/                        # Global types
├── utils/                        # Utilities
├── config/                       # Configuration
├── constants/                    # Constants
├── assets/                       # Static assets
└── styles/                       # Global styles
```

---

## 🧩 Feature Module Structure

Each feature follows a consistent pattern:

```
feature/
├── components/      # UI components
├── hooks/           # Custom hooks
├── schemas/         # Zod validation
├── screens/         # Page components
├── store/           # Redux slice
├── types/           # TypeScript types
└── utils/           # Helpers
```

---

## 🔗 Routes

| Route                 | Description          |
| --------------------- | -------------------- |
| `/`                   | Home                 |
| `/dashboard`          | Dashboard            |
| `/profile`            | User profile         |
| `/cases`              | All cases            |
| `/cases/[id]`         | Case details         |
| `/my-cases`           | My cases             |
| `/my-cases/[id]`      | My case details      |
| `/add-case`           | Create case          |
| `/my-student`         | Students list        |
| `/my-student/[id]`    | Student details      |
| `/pending-cases`      | Pending cases        |
| `/pending-cases/[id]` | Pending case details |

---

## 📦 Key Dependencies

| Package                 | Purpose          |
| ----------------------- | ---------------- |
| `next`                  | React framework  |
| `@reduxjs/toolkit`      | State management |
| `@tanstack/react-query` | Server state     |
| `react-hook-form`       | Form handling    |
| `zod`                   | Validation       |
| `axios`                 | HTTP client      |
| `tailwindcss`           | Styling          |

---

## 📜 Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```
