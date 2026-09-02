# DiskSift

A private, guided storage checkup for Mac and iPhone users, built with Next.js.

## Getting started

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in values.

3. Run Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start the dev server

```bash
npm run dev
```

## Auth setup

- Create a GitHub OAuth app and set the callback URL to `http://localhost:3000/api/auth/callback/github`.
- Fill in `GITHUB_ID`, `GITHUB_SECRET`, and `NEXTAUTH_SECRET` (or `AUTH_SECRET`).

## Stripe setup

- Add your Stripe keys to `.env`.
- Configure the webhook endpoint: `/api/stripe/webhook`.

## Project structure

- `src/app` – App Router routes
- `src/components` – UI components
- `src/lib` – helpers and data access
- `prisma/schema.prisma` – database schema
