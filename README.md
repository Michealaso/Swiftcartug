# SwiftCart UG

## Run today

```bash
npm start
```

Open: `http://localhost:3000`

## What is shared across devices?

- Product catalog is shared through `data/products.json` via:
  - `GET /api/products`
  - `POST /api/products`
- Cart remains per-device/per-browser in localStorage.

## Quick health check

```bash
curl http://localhost:3000/api/health
```
