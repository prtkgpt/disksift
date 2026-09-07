# DiskSift

A private, guided storage analyzer for Mac users, built with Next.js. DiskSift for iPhone is coming soon.

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

## Stripe setup

- Add the Stripe and license variables documented in `.env.example`.
- Configure the webhook endpoint as `https://www.disksift.com/api/stripe/webhook`.
- Subscribe it to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `charge.refunded`.
- Keep `ALLOW_LIVE_PAYMENTS=false` until the live price, webhook, Resend sender, and end-to-end purchase test are ready.

## Project structure

- `src/app` – App Router routes
- `src/components` – UI components
- `src/lib` – helpers and data access
- `prisma/schema.prisma` – database schema
