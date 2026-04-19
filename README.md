# SwiftCart UG

## Run today

```bash
npm start
```

Open: `http://localhost:3000`

## API

### Health
- `GET /api/health`

### Products
- `GET /api/products`
- `GET /api/products?category=Fashion&search=watch`
- `GET /api/products/:id`
- `POST /api/products` (create single product)
- `POST /api/products` with array body (full sync mode; backward compatible)
- `PUT /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

Product data is persisted in `data/products.json`.

## Quick health check

```bash
curl http://localhost:3000/api/health
```
