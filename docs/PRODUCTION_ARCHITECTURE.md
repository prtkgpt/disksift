# DiskSift production architecture

## Recommended stack

- **Website/API:** Next.js on Vercel at `disksift.com`
- **Payments:** Stripe Checkout, one-time `payment` mode, $19.99
- **Database:** Neon Postgres through Prisma
- **Transactional email:** Resend from `licenses@disksift.com`
- **Downloads:** Cloudflare R2 for versioned, signed/notarized DMGs; the website redirects `/download` to the current release
- **macOS release:** Developer ID Application signing, Apple notarization, stapling, Sparkle updates

Neon is the better fit than Supabase here because DiskSift does not need customer accounts, realtime data, browser-side database access, or Supabase Auth. The server owns every database operation and the existing application already uses Prisma. Supabase becomes attractive later only if a signed-in customer portal is a near-term requirement.

## Purchase and fulfillment

1. `POST /api/checkout` creates a Stripe Checkout Session using a server-side Price ID, `mode: payment`, `customer_creation: always`, and a success URL containing `{CHECKOUT_SESSION_ID}`.
2. Stripe hosts payment entry and redirects to `/purchase/success`.
3. **The redirect never fulfills the order.** A verified `checkout.session.completed` webhook performs fulfillment.
4. The webhook is idempotent on Stripe event ID and Checkout Session ID.
5. In one database transaction it upserts the customer, purchase, and license. The license key is generated from 20 random bytes; only its SHA-256 hash and last four characters are stored.
6. Resend emails the raw key once, the download link, activation instructions, receipt link, and license-management link. Use the Stripe event ID as the Resend idempotency key.
7. The success page retrieves the fulfilled order by Checkout Session ID and can display the key once after verifying the session with Stripe.

## License format

Customer-facing key:

`DISKSIFT-PRO-XXXX-XXXX-XXXX-XXXX-XXXX`

The key is an opaque credential, not the entitlement itself. On activation the app sends it over TLS to `POST /api/licenses/activate` with:

- app version
- OS version and architecture
- a random installation UUID stored in Keychain
- no file names, paths, scan results, or hardware serial number

The server hashes the supplied key, finds an active license, enforces a three-device limit, and returns a compact Ed25519-signed receipt containing license ID, product, major-version entitlement, installation UUID, issue time, and next-check time. DiskSift ships only the Ed25519 public key, verifies receipts locally with CryptoKit, and stores the receipt in Keychain. The signing private key exists only in Vercel secrets.

Pro works offline. Refresh the receipt every 30 days and allow a 14-day grace period when the service is unreachable. Revoked or refunded licenses return to Free only after a successful server response confirms revocation.

## Required endpoints

- `POST /api/checkout`
- `POST /api/stripe/webhook`
- `GET /api/purchases/{checkoutSessionId}`
- `POST /api/licenses/activate`
- `POST /api/licenses/deactivate`
- `POST /api/licenses/refresh`
- `POST /api/licenses/recover` — emails active keys or a management link
- `GET /api/releases/latest` — signed update metadata

Rate-limit activation, refresh, and recovery endpoints. Never expose Stripe, Resend, database, or signing secrets to the browser or app binary.

## Core tables

- `Customer`: id, normalized email, Stripe customer ID, timestamps
- `Purchase`: id, customer ID, Stripe session/payment IDs, amount, currency, status, refundedAt
- `License`: id, purchase ID, keyHash, keyLast4, product, majorVersion, status, activationLimit
- `Activation`: id, license ID, installationIdHash, app/os metadata, activatedAt, lastSeenAt, deactivatedAt
- `WebhookEvent`: Stripe event ID, type, processedAt, outcome
- `EmailDelivery`: license ID, Resend message ID, type, sentAt

Unique indexes belong on normalized customer email, Stripe session ID, Stripe payment ID, license key hash, Stripe event ID, and `(licenseId, installationIdHash)`.

## Refunds and disputes

- `charge.refunded`: mark the purchase refunded and license revoked.
- `charge.dispute.created`: suspend new activations but preserve a short grace period for existing installations.
- `charge.dispute.closed`: reinstate or revoke according to Stripe's result.
- The app never deletes customer files or local scan data when a license changes; it simply returns to Free capabilities.

## Environment variables

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `RESEND_API_KEY`
- `LICENSE_SIGNING_PRIVATE_KEY`
- `NEXT_PUBLIC_SITE_URL=https://disksift.com`

Use separate Stripe, Neon, Resend, and signing credentials for preview and production environments.

## Launch order

1. Finish and test destructive-action safeguards.
2. Create Apple Developer ID certificates and notarized universal build.
3. Provision Neon and run migrations.
4. Configure Stripe product, one-time price, tax behavior, refund policy, and webhook.
5. Verify `disksift.com` in Resend and publish SPF/DKIM records.
6. Deploy Next.js to Vercel and attach `disksift.com`.
7. Test Stripe test-mode purchase, duplicate webhook delivery, email, activation, offline launch, device limit, deactivation, recovery, refund, and revocation.
8. Switch production credentials and perform one real low-value purchase followed by a refund.
