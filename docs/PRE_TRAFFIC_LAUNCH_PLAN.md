# DiskSift pre-traffic launch plan

## Positioning

DiskSift is a paid beta at a $12.99 one-time launch price. We should not claim that unfinished features exist. The promise is: find meaningful reclaimable space quickly, explain risk clearly, and complete reviewed cleanup without making the Mac feel stuck.

## P0 — required before intentional traffic

- [ ] Cleanup plan aggregates candidates by safe category and shows total reclaimable GB.
- [ ] Multi-select and batch Move to Trash with one confirmation and progress.
- [ ] Permission-aware actions route users to Finder, Xcode, or the owning app when direct cleanup is unsafe.
- [ ] Duplicate groups recommend a keeper and support selecting redundant copies in bulk.
- [ ] Scan results appear progressively; cancel always responds and UI stays usable.
- [ ] A cleanup receipt shows bytes moved, failed items, and how to recover from Trash.
- [ ] License purchase, email delivery, activation, three-device limit, and refund revocation pass end-to-end production tests.
- [ ] Support response process exists for activation resets and refund requests.

## P1 — needed to defend and grow the price

- [ ] Safe developer cleanup at the owning-folder level: Derived Data, obsolete archives, dependency folders, and unused simulators.
- [ ] App size inventory plus guided uninstall and leftover review.
- [ ] Saved scan comparison so users can see what changed.
- [ ] Recommendations ranked by confidence, recoverability, and impact—not size alone.

## P2 — differentiation

- [ ] Local cleanup rules that explain why each candidate is safe or risky.
- [ ] Scheduled reminders and storage-pressure alerts without background resource abuse.
- [ ] External-drive analysis and project-level cleanup profiles.
- [ ] iPhone companion only after the Mac workflow consistently creates value.

## Quality gates

- Median Downloads scan reaches useful results in under 3 seconds on the supported test Macs.
- Full Home scan never blocks the main thread and can be canceled within 1 second.
- A first-time tester can reclaim at least 1 GB without instructions or a failed permission dialog.
- No automatic permanent deletion; recoverable Trash is the default.
- Crash-free sessions exceed 99.5% before paid traffic is scaled.
- Purchase-to-license email success exceeds 99%; activation success exceeds 98%.
- Refund rate is reviewed internally even though it is not displayed publicly.

## Traffic stages

1. **Founder testing:** 10–20 Macs and direct observation. No paid acquisition.
2. **Paid beta:** 50–100 buyers from existing audiences; publish limitations and collect structured feedback.
3. **Organic launch:** ship all P0 gates, publish comparison pages and practical guides, then start SEO distribution.
4. **Paid acquisition:** only after activation, cleanup success, retention, and refund metrics meet the quality gates.

## Public metrics definitions

- Free/Pro downloads are download starts, not guaranteed completed installations.
- Active Pro licenses exclude fully refunded purchases.
- Net product sales sum active live purchases; refund counts are not published.
- Cleaned GB is opt-in, anonymous, self-reported space moved to Trash.
- Storage equivalent is illustrative: cleaned GB × $0.02/GB/month × 12, not guaranteed cash savings.
