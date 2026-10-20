# 🛒 NexaCart — AI-verified online shopping

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

NexaCart is a full-stack e-commerce platform built like the big marketplaces — but with one
twist: **every product listing is automatically verified by an AI agent ("NexaGuard")** before
shoppers ever see it. The storefront scores each listing on ten checks (pricing, imagery,
description quality, stock sync with the warehouse, …) and shows the report right on the
product page.

- 🛍️ **Full shopping flow** — search, filters, sort, pagination, cart, checkout, orders
- 🤖 **NexaGuard agent** — a dedicated microservice that verifies every product and stores a score/report
- 💳 **Payments** — Razorpay (UPI/cards/netbanking) with server-side signature verification, plus cash on delivery
- 🔐 **Auth** — httpOnly cookie sessions with rotating refresh tokens, resolved once at the gateway
- 📱 **Responsive UI** — Tailwind v4 storefront, mobile drawer, sticky cart/search, admin console
- 🧱 **9 services behind one gateway** — each service owns its own MongoDB database

## Architecture

```
                      ┌──────────────────────────────┐
   Browser ──────────▶│  API Gateway  :5000          │  resolves identity once,
   Next.js :3000      │  (cors, cookie → x-user-id)  │  injects x-user-id / x-user-role
                      └──────────────┬───────────────┘
             ┌───────────┬───────────┼───────────┬───────────┬───────────┬───────────┐
             ▼           ▼           ▼           ▼           ▼           ▼           ▼
        auth :5001  product :5003 cart :5004 order :5005 payment :5006 inventory  notification
             │           │           │       └────┬──────┘   └────┬─────┘  :5007      :5008
             │           │           │            │               │                  │
             │           ▼           ▼            ▼               ▼                  │
             │      product DB   cart DB      order DB       payment DB              │
             │           ▲                                                       order DB
             │           │  fire-and-forget verification                           │
             │      ┌────┴──────────────┐                                         ▼
             └─────▶│  NexaGuard agent  │◀── inventory service ── reservation   notification
                    │      :5009        │        (reserve/confirm/release)        DB
                    │   agent DB        │
                    └───────────────────┘
```

| Service        | Port | Owns                                        | Talks to                                  |
| -------------- | ---- | ------------------------------------------- | ----------------------------------------- |
| gateway        | 5000 | identity resolution + routing               | auth (token verify), all services         |
| auth           | 5001 | users, refresh tokens, bcrypt + JWT         | —                                         |
| product        | 5003 | catalogue, categories, search               | agent (verify trigger)                    |
| cart           | 5004 | per-user cart                               | product (price/name enrichment)           |
| order          | 5005 | orders, fulfilment pipeline                 | inventory, payment, notification, auth    |
| payment        | 5006 | Razorpay payments, signature verification  | order (paid → confirm inventory)          |
| inventory      | 5007 | stock, reservations (reserve/confirm/release) | product, order                          |
| notification   | 5008 | per-user notifications (email/sms/push log) | order                                     |
| **agent**      | 5009 | NexaGuard verification reports              | product, inventory                        |

Every service is an independent TypeScript + Express 5 + Mongoose app with its own
`.env`, `Dockerfile` and MongoDB database.

### How the services stay connected

- **Identity at the edge** — the gateway reads the `accessToken` cookie, asks auth to verify
  it (with a small cache), and forwards `x-user-id` / `x-user-role` headers. No service talks
  to auth directly.
- **Cart enrichment** — cart asks the product service for live price/name/image before saving.
- **Order → inventory → payment loop** — creating an order reserves stock, a verified Razorpay
  payment marks the order *paid* and confirms the reservation, cancelling releases it.
- **Product → agent** — creating or updating a product fires a *fire-and-forget* `POST` to
  NexaGuard, which grades the listing against live inventory and upserts the report the
  storefront renders.

## 🚀 Getting started

### Prerequisites

- Node.js 20.9+ (Node 22 recommended)
- MongoDB (local or Atlas) — each service uses its own database
- optional: Docker + Docker Compose, Redis, Razorpay test keys

### 1. Environment

Every service ships a `.env.example` — copy each to `.env` and fill in values:

```bash
cd backend
for f in gateway services/*/; do cp "$f/.env.example" "$f/.env"; done   # then edit values
cd ../frontend && cp .env.example .env.local
```

Key values:

| Variable                     | Where             | Notes                                     |
| ---------------------------- | ----------------- | ----------------------------------------- |
| `MONGO_URI`                  | every service     | use a distinct database per service       |
| `JWT_SECRET`                 | auth              | must match across environments            |
| `ADMIN_INVITE_CODE`          | auth              | invite code required to register an admin account |
| `RAZORPAY_KEY_ID/SECRET`     | payment           | optional — COD works without them         |
| `NEXT_PUBLIC_API_URL`        | frontend          | gateway URL, default `http://localhost:5000` |

### 2. Install & seed demo data

```bash
# backend: install every service
for d in backend/gateway backend/services/*/; do (cd "$d" && npm install); done

# seed 24 demo products (product service DB) and an admin account (auth DB)
(cd backend/services/product && npm run seed)
(cd backend/services/auth && npm run seed:admin)
```

Seeded admin: **admin@nexacart.dev / Admin@123** (override with `SEED_ADMIN_*` in
`backend/services/auth/.env`).

### 3. Run in development

```bash
# terminal 1 — all services (each with tsx watch)
npm run dev:all        # from backend/: runs gateway + 8 services

# terminal 2 — storefront
cd frontend && npm run dev
```

Open **http://localhost:3000**. The gateway is on **http://localhost:5000/health**.

### 4. Run with Docker

```bash
cd backend
docker compose up --build
```

Compose starts MongoDB, Redis and all nine services with Docker-DNS service URLs
(`http://product-service:5003`, …). Run the frontend separately with `npm run dev`.

## 🖥️ Frontend

Next.js 16 (App Router, Turbopack) + Tailwind v4 + Redux Toolkit + react-hook-form/zod.

| Route                   | What it does                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| `/`                     | hero, category tiles, today's deals, top-rated grid                 |
| `/products`             | filters (category/price), sort, search, pagination                  |
| `/products/[id]`        | gallery, buy box, wishlist, **NexaGuard verification report**       |
| `/cart`                 | quantities, remove, free-shipping progress                          |
| `/checkout`             | validated address form, COD or Razorpay checkout modal              |
| `/orders`, `/orders/[id]` | status stepper, cancel, success banners                           |
| `/wishlist`             | saved items (persisted in localStorage)                             |
| `/login`, `/register`   | zod-validated auth forms                                            |
| `/admin`                | KPIs, product CRUD, one-click agent re-check, order fulfilment      |

State lives in Redux (auth, cart, wishlist); the axios client silently refreshes expired
access tokens by rotating the refresh cookie and replaying the request.

## 🔌 API (through the gateway)

```text
POST   /api/auth/register | login | refresh | logout      GET /api/auth/verify
GET    /api/products?search&category&minPrice&maxPrice&sort&page&limit
GET    /api/products/categories        GET/POST/PATCH/DELETE /api/products/:id
GET    /api/cart                       POST/PATCH/DELETE /api/cart/items[/:productId]   DELETE /api/cart/clear
POST   /api/orders                     GET /api/orders | /api/orders/:id
PATCH  /api/orders/:id/status|cancel
POST   /api/payments/create-order      POST /api/payments/verify     GET /api/payments/config
GET    /api/inventory/product/:productId      POST /api/inventory/product/:productId/reserve|release|confirm
GET    /api/notifications/user/:userId        PATCH /api/notifications/user/:userId/... 
POST   /api/agent/products/:id/verify   (internal, fired by product service)
GET    /api/agent/products/:id/report   (storefront badge)
GET    /api/agent/reports               (admin dashboard)
```

## 🤖 The NexaGuard agent

The product service triggers `POST /products/:id/verify` on every create/update (never
waiting on it). The agent:

1. pulls the live listing from the **product service** and stock from the **inventory service**,
2. runs 10 deterministic checks (title, description, price sanity, real discount, imagery,
   category, SKU format, stock, brand, warehouse sync),
3. scores 0–100 → verdict `verified` (≥85), `needs_review` (≥60) or `rejected`,
4. upserts the report, which the product page renders as a score ring, check grid, issues and
   improvement suggestions.

No LLM key is required — the engine is deterministic and offline-friendly.

## 🔐 Security notes

- bcrypt password hashing; JWT access tokens (15 min) + rotating opaque refresh tokens
- auth cookies are `httpOnly` + `sameSite=strict`; nothing sensitive in localStorage
- identity is resolved once at the gateway and forwarded as headers — services never parse JWTs
- Razorpay HMAC-SHA256 signature verification happens server-side before an order is confirmed
- CORS is restricted to the configured frontend origin

## 📂 Project structure

```text
NexaCart/
├── frontend/                 # Next.js 16 storefront + admin console
│   └── src/
│       ├── app/              # routes: (auth), (shop), admin, home
│       ├── components/       # layout (Navbar/Footer), product, ui kit
│       ├── features/         # typed API modules per domain (auth, cart, orders, agent…)
│       ├── redux/            # store + auth/cart/wishlist slices
│       ├── services/api.ts   # axios client with silent refresh
│       └── lib/              # constants + formatting helpers
└── backend/
    ├── gateway/              # :5000 identity + reverse proxy
    ├── services/
    │   ├── auth/  product/  cart/  order/  payment/  inventory/  notification/  agent/
    │   └── (each: src/{config,models,services,controllers,routes}, Dockerfile, .env)
    └── docker-compose.yml    # mongo, redis, all 9 services
```

## 🧪 Verification

```bash
# backend typechecks (every service has its own tsconfig)
for d in backend/gateway backend/services/*/; do (cd "$d" && ./node_modules/.bin/tsc --noEmit); done

# storefront production build
cd frontend && npm run build
```

## 🤝 Contributing

1. Fork and create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes and commit with a clear message
3. Run the typechecks + `npm run build` above
4. Open a pull request

## 📝 License

MIT — see [LICENSE](LICENSE).

## 🙏 Acknowledgments

- Inspired by Amazon, Flipkart and Meesho
- Built with ❤️ by [Gaurav Gautam](https://github.com/gauravgautam2003)
