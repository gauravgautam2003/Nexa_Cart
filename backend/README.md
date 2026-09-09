# NexaCart Backend

The backend is organized as an API gateway with independent services:

- `gateway`: routes `/api/*` requests to service URLs from `gateway/.env`.
- `services/auth`: authentication and authorization.
- `services/user`: user profiles and addresses.
- `services/product`: product catalog.
- `services/cart`: shopping carts.
- `services/order`: order management.
- `services/payment`: payment processing.
- `services/inventory`: stock management.
- `services/notification`: notifications.
- `shared`: common types, constants, and utilities.

## Configuration

Set service URLs in `gateway/.env` using the variables consumed by the gateway:

```env
AUTH_SERVICE=http://localhost:5001
USER_SERVICE=http://localhost:5002
PRODUCT_SERVICE=http://localhost:5003
CART_SERVICE=http://localhost:5004
ORDER_SERVICE=http://localhost:5005
PAYMENT_SERVICE=http://localhost:5006
INVENTORY_SERVICE=http://localhost:5007
NOTIFICATION_SERVICE=http://localhost:5008
```

When running the gateway inside Docker Compose, use the Compose service names instead of `localhost`, for example `http://auth-service:5001`.

## Gateway

```powershell
cd gateway
npm install
npm run dev
```

The gateway listens on port `5000` by default. Service routes are mounted under `/api` and the health endpoint is `/health`.

## Docker Compose

The root `docker-compose.yml` is the place to run the complete backend stack once its service definitions are configured:

```powershell
docker compose up --build
```
