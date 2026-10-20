# NexaCart Backend

The backend is organized as an API gateway with independent services:

- `gateway`: routes `/api/*` requests to service URLs from `gateway/.env`.
- `services/auth`: authentication and authorization (users, JWT, refresh tokens).
- `services/product`: product catalog.
- `services/cart`: shopping carts.
- `services/order`: order management.
- `services/payment`: Razorpay payments and signature verification.
- `services/inventory`: stock and order reservations (reserve/confirm/release).
- `services/notification`: notifications.
- `services/agent`: NexaGuard listing verification (scoring and reports).
- `shared`: common types, constants, and utilities.

## Configuration

Set service URLs in `gateway/.env` using the variables consumed by the gateway:

```env
AUTH_SERVICE=http://localhost:5001
PRODUCT_SERVICE=http://localhost:5003
CART_SERVICE=http://localhost:5004
ORDER_SERVICE=http://localhost:5005
PAYMENT_SERVICE=http://localhost:5006
INVENTORY_SERVICE=http://localhost:5007
NOTIFICATION_SERVICE=http://localhost:5008
AGENT_SERVICE=http://localhost:5009
```

When running the gateway inside Docker Compose, use the Compose service names instead of `localhost`, for example `http://auth-service:5001`.

## Gateway

```bash
cd gateway
npm install
npm run dev
```

The gateway listens on port `5000` by default. Service routes are mounted under `/api` and the health endpoint is `/health`.

## Everything at once

```bash
npm run dev:all            # gateway + all 8 services, one terminal
npm run dev:all -- product agent   # only selected services
```

## Seed data

```bash
(cd services/product && npm run seed)        # 24 demo products + warehouse stock
(cd services/auth && npm run seed:admin)     # admin@nexacart.dev / Admin@123
```

## Docker Compose

The root `docker-compose.yml` runs the complete backend stack (MongoDB, Redis and
all nine services):

```bash
docker compose up --build
```
