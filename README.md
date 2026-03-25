# IQ Quest Hub

IQ Quest Hub is a modern, interactive Quiz platform built with React, Vite, and TypeScript. It features a robust authentication system using ADFS OIDC, a responsive UI built with Tailwind CSS and Shadcn UI, and distinct scopes for regular participants and administrators.

## 🚀 Tech Stack

- **Frontend Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Authentication**: `@axa-fr/react-oidc` (ADFS integration)
- **Routing**: React Router DOM (`react-router-dom`)
- **State Management & Data Fetching**: TanStack React Query (`@tanstack/react-query`)
- **Forms & Validation**: React Hook Form, Zod
- **Data Visualization**: Recharts, Embla Carousel

## 📁 Project Structure

```text
iq-quest-hub/
├── src/
│   ├── components/      # UI components (Shadcn UI, Admin components, Quiz specific views)
│   ├── contexts/        # React Contexts (e.g., UserContext)
│   ├── data/            # Static or mock data for quizzes
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── mon-backend/     # Backend service/mock layer
│   ├── pages/           # Application views (Index, AdminPage, QuizPage, LoginPage)
│   ├── test/            # Test configurations and utilities
│   ├── types/           # Global TypeScript interfaces and types
│   ├── App.tsx          # Main application component & Routing definitions
│   └── main.tsx         # React application entry point
├── public/              # Static assets and OIDC service worker
├── ...                  # Configuration files (vite.config.ts, tailwind.config.ts, etc.)
```

## ✨ Key Features

1. **Secure Authentication**
   - Seamless SSO authentication integrated with ADFS using `@axa-fr/react-oidc`.
   - Protected routes using `<OidcSecure>` wrapper to ensure privacy.

2. **Quiz Management (Admin)**
   - Dedicated `AdminPage` for managing quizzes.
   - Real-time statistics and data visualization using Recharts for administrative oversight.

3. **Interactive Quizzes**
   - Immersive quiz-taking experience on the `QuizPage`.
   - Dynamic UI with modular components like `QuizCard`, `QuizIntro`, `QuizQuestion`, and `QuizResults`.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+) or Bun

### Installation

1. Navigate to the project directory:
   ```bash
   cd iq-quest-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with bun
   bun install
   ```
   *(Note: The `postinstall` script will automatically copy the required OIDC service worker files to your `public` directory).*

### Running the Application

To start the development server:
```bash
npm run dev
# or
bun run dev
```

> **Note**: Authentication flows require running on specific domains/ports as registered in your ADFS configuration (e.g., the current redirect URI specifies `https://atl-svap21.cipeliagroup.com:8085`). Ensure your local development server is configured appropriately (using HTTPS plugin if needed) or test on the designated hosting environment.

### Available Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Compile the application for production.
- `npm run lint` - Run ESLint to identify and fix code quality issues.
- `npm run preview` - Preview the production build locally.
- `npm run test` - Run automated tests using Vitest.
- `npm run test:watch` - Run Vitest in watch mode.

## 🔒 Authentication Configuration
The authentication setup is centrally located in `src/App.tsx`. Make sure your `client_id`, `redirect_uri`, `client_secret`, and ADFS endpoints match your development and production environments correctly.
