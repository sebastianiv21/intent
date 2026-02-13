# Intent

A modern personal finance application built with Next.js, helping you track transactions, manage budgets, and achieve financial wellness through the 50/30/20 budgeting method.

## Features

- **Transaction Tracking** - Log income and expenses with categories and descriptions
- **Smart Categories** - Organize spending into Needs, Wants, and Future buckets
- **Budget Harmony** - Visual 50/30/20 budget allocation with progress tracking
- **Recurring Transactions** - Set up automatic tracking for regular income and bills
- **Financial Insights** - View spending patterns and account balance at a glance
- **Mobile-First Design** - Swipeable interface optimized for on-the-go use
- **Authentication** - Secure user accounts with Better Auth

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [Better Auth](https://www.better-auth.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + shadcn/ui
- **Charts**: [Recharts](https://recharts.org)
- **Deployment**: Optimized for [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your `DATABASE_URL` and other required variables.

3. Run database migrations:

```bash
pnpm db:push
```

4. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio

## Project Structure

```
app/
  (app)/           # Authenticated routes (dashboard, transactions, etc.)
  (auth)/          # Authentication routes (login, register, onboarding)
  api/             # API routes
components/        # React components
lib/
  schema.ts        # Database schema
  api-client.ts    # API client utilities
types/             # TypeScript types
```

## License

MIT
