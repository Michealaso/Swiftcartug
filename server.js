const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function safeReadProducts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function normalizeProduct(input, keepId = false) {
  if (!input || typeof input !== 'object') return null;
  const id = keepId ? String(input.id || '').trim() : String(input.id || `p_${Date.now()}_${Math.random().toString(16).slice(2)}`).trim();
  const name = String(input.name || '').trim();
  const category = String(input.category || 'General').trim() || 'General';
  const img = String(input.img || '').trim();
  const price = Number(input.price);
  const featured = Boolean(input.featured);

  if (!id || !name || !img || Number.isNaN(price) || price <= 0) return null;
  return { id, name, category, img, price, featured };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') return send(res, 204, '');

  if (url.pathname === '/api/health' && req.method === 'GET') {
    return send(res, 200, JSON.stringify({ ok: true, service: 'swiftcart-api' }), MIME['.json']);
  }

  // GET /api/products (optional ?category=&search=)
  if (url.pathname === '/api/products' && req.method === 'GET') {
    const products = safeReadProducts();
    const category = (url.searchParams.get('category') || '').trim().toLowerCase();
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();

    let filtered = [...products];
    if (category) filtered = filtered.filter((p) => String(p.category || '').toLowerCase() === category);
    if (search) {
      filtered = filtered.filter((p) =>
        String(p.name || '').toLowerCase().includes(search) ||
        String(p.category || '').toLowerCase().includes(search)
      );
    }

    return send(res, 200, JSON.stringify(filtered), MIME['.json']);
  }

  // POST /api/products (create one product OR sync whole array for backward compatibility)
  if (url.pathname === '/api/products' && req.method === 'POST') {
    try {
      const payload = await readBody(req);

      if (Array.isArray(payload)) {
        const normalized = payload.map((p) => normalizeProduct(p, true)).filter(Boolean);
        writeProducts(normalized);
        return send(res, 200, JSON.stringify({ ok: true, mode: 'sync', count: normalized.length }), MIME['.json']);
      }

      const product = normalizeProduct(payload, false);
      if (!product) return send(res, 400, JSON.stringify({ error: 'Invalid product payload' }), MIME['.json']);

      const products = safeReadProducts();
      products.unshift(product);
      writeProducts(products);

      return send(res, 201, JSON.stringify(product), MIME['.json']);
    } catch (err) {
      return send(res, 400, JSON.stringify({ error: err.message || 'Invalid request body' }), MIME['.json']);
    }
  }

  // Routes with ID: /api/products/:id
  const productIdMatch = url.pathname.match(/^\/api\/products\/([^/]+)$/);
  if (productIdMatch) {
    const productId = decodeURIComponent(productIdMatch[1]);
    const products = safeReadProducts();
    const index = products.findIndex((p) => p.id === productId);

    if (req.method === 'GET') {
      if (index < 0) return send(res, 404, JSON.stringify({ error: 'Product not found' }), MIME['.json']);
      return send(res, 200, JSON.stringify(products[index]), MIME['.json']);
    }

    if (req.method === 'DELETE') {
      if (index < 0) return send(res, 404, JSON.stringify({ error: 'Product not found' }), MIME['.json']);
      const [removed] = products.splice(index, 1);
      writeProducts(products);
      return send(res, 200, JSON.stringify({ ok: true, removed }), MIME['.json']);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (index < 0) return send(res, 404, JSON.stringify({ error: 'Product not found' }), MIME['.json']);
      try {
        const payload = await readBody(req);
        const merged = { ...products[index], ...payload, id: productId };
        const normalized = normalizeProduct(merged, true);
        if (!normalized) return send(res, 400, JSON.stringify({ error: 'Invalid product payload' }), MIME['.json']);

        products[index] = normalized;
        writeProducts(products);
        return send(res, 200, JSON.stringify(normalized), MIME['.json']);
      } catch (err) {
        return send(res, 400, JSON.stringify({ error: err.message || 'Invalid request body' }), MIME['.json']);
      }
    }
  }

  const filePath = path.join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME[ext] || 'application/octet-stream');
  });
});

server.listen(PORT, () => {
  console.log(`SwiftCart server running on http://localhost:${PORT}`);
});
