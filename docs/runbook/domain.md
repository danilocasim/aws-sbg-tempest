# Domain runbook

Implements C0.10. The domain printed on NFC cards must be owned by the club before anything is printed (ADR-0003, mitigation 1).

1. Pick the registrar (Cloudflare Registrar keeps DNS and domain in one club account; at-cost pricing).
2. Register (or transfer in) the domain under the club account; enable registrar lock and 2FA.
3. Add two officers to the account; both log in and confirm. Record names and the renewal date in `handover.md`.
4. Set auto-renew with a club-held payment method, and a calendar reminder 60 days before expiry to the club inbox.

Status (2026-10-03): not started; blocks C0.5, C0.6, C0.8 and C1.11.
