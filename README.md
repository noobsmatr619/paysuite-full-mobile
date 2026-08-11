# PaySuite Mobile (Expo)

Expo / React Native client for **PaySuite**, converted from the original Flutter app (`paysuite/main/PaySuite`).

> Source Laravel/Flutter code in `paysuite/` is **never modified**.

## Features

- Auth gate (demo local store or remote Wasp API)
- Dashboard: revenue, paid, due, expenses, counts, recent payments
- Customers (list + create)
- Invoices, estimates, products, expenses, tickets
- Billing / plan tiers
- Profile + sign out
- Dark / light theme

## Run

```bash
npm install
npm start
```

### Demo mode (default)

No backend required. Seeded local data is used.

### Remote Wasp API

Point the app at your Wasp **server** (not the web client, and **not** port 3000):

```bash
# Example: Wasp server on 3001
export EXPO_PUBLIC_API_URL="http://YOUR_HOST:3001"
npm start
```

Login hits `POST /api/mobile/auth/login` and stores a **JWT**.

- Dev: password length ≥ 4 for an existing user email  
- Or set `MOBILE_SHARED_PASSWORD` on the server  
- Or paste a token from Wasp **Settings → Issue mobile token** as password with matching email  

Invoice rows open a print-ready HTML document from `GET /api/mobile/invoices/:id/document`.

## Project map

| Path | Role |
|------|------|
| `src/api/` | Remote client + offline local store |
| `src/app/(auth)` | Login |
| `src/app/(tabs)` | Dashboard + menu |
| `src/app/customers` … | Domain screens (mirrors Flutter modules) |
| `src/types/paysuite.ts` | Shared domain types |

## Pairing backend

Use the sibling project:

`../paysuite_wasp/app`
