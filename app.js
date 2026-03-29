function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const DEFAULT_PRODUCTS = [
  { id: createId(), name: "Mini Projector 4K", price: 320000, img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80", category: "Gadgets", featured: true },
  { id: createId(), name: "Wireless Gaming Headset", price: 185000, img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80", category: "Gadgets", featured: true },
  { id: createId(), name: "Portable Blender", price: 95000, img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80", category: "Home", featured: false },
  { id: createId(), name: "Smart Watch", price: 210000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", category: "Fashion", featured: true },
  { id: createId(), name: "LED Ring Light", price: 78000, img: "https://images.unsplash.com/photo-1609921205586-1cc2f0b4b26d?auto=format&fit=crop&w=900&q=80", category: "Creator", featured: false },
  { id: createId(), name: "Minimal Backpack", price: 125000, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", category: "Fashion", featured: false }
];

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizeProduct(item) {
  if (!item || typeof item !== "object") return null;
  const id = String(item.id || createId()).trim();
  const name = String(item.name || "").trim();
  const img = String(item.img || "").trim();
  const category = String(item.category || "General").trim() || "General";
  const price = Number(item.price);
  if (!id || !name || !img || Number.isNaN(price) || price <= 0) return null;
  return { id, name, img, category, price, featured: Boolean(item.featured) };
}

function normalizeCartItem(item) {
  if (!item || typeof item !== "object") return null;
  const productId = String(item.productId || "").trim();
  const qty = Math.floor(Number(item.qty));
  if (!productId || Number.isNaN(qty) || qty <= 0) return null;
  return { productId, qty };
}

let products = safeRead("swiftcart_products", []).map(normalizeProduct).filter(Boolean);
if (products.length === 0) {
  products = [...DEFAULT_PRODUCTS];
  localStorage.setItem("swiftcart_products", JSON.stringify(products));
}

let cart = safeRead("swiftcart_cart", []).map(normalizeCartItem).filter(Boolean);
cart = cart.filter((i) => products.some((p) => p.id === i.productId));

function saveProducts() { localStorage.setItem("swiftcart_products", JSON.stringify(products)); }
function saveCart() { localStorage.setItem("swiftcart_cart", JSON.stringify(cart)); }

function renderProductGrid(targetId, list) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<p class="muted">No products found.</p>';
    return;
  }

  grid.innerHTML = list.map((p) => `
    <article class="card">
      <img src="${p.img}" alt="${escapeHTML(p.name)}" onerror="this.src='https://via.placeholder.com/500x350?text=No+Image'" />
      <span class="chip">${escapeHTML(p.category)}</span>
      <h4>${escapeHTML(p.name)}</h4>
      <p>UGX ${p.price.toLocaleString()}</p>
      <button onclick="addToCart('${p.id}')">Add to Cart</button>
    </article>
  `).join("");
}

function renderFeatured() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  renderProductGrid("featuredGrid", featured.length > 0 ? featured : products.slice(0, 4));
}

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const categories = [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b));
  select.innerHTML = '<option value="all">All categories</option>';
  categories.forEach((cat) => {
    select.innerHTML += `<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`;
  });
}

function applyFilters() {
  const search = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const category = document.getElementById("categoryFilter")?.value || "all";
  const sortBy = document.getElementById("sortBy")?.value || "default";

  let list = [...products];
  if (search) list = list.filter((p) => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
  if (category !== "all") list = list.filter((p) => p.category === category);
  if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

  renderProductGrid("product-list", list);
  const meta = document.getElementById("productMeta");
  if (meta) meta.textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;
}

function isAdmin() {
  return localStorage.getItem("swiftcart_admin") === "true";
}

function updateAdminUI() {
  const panel = document.getElementById("adminPanel");
  if (!panel) return;

  const status = document.getElementById("adminStatus");
  const loginBtn = document.getElementById("adminLoginBtn");
  const formArea = document.getElementById("adminFormArea");

  if (isAdmin()) {
    if (status) status.textContent = "Unlocked";
    if (loginBtn) loginBtn.style.display = "none";
    if (formArea) formArea.style.display = "block";
  } else {
    if (status) status.textContent = "Locked";
    if (loginBtn) loginBtn.style.display = "block";
    if (formArea) formArea.style.display = "none";
  }
}

function adminLogin() {
  const password = prompt("Enter admin password:");
  if (password === "admin123") {
    localStorage.setItem("swiftcart_admin", "true");
    updateAdminUI();
  } else {
    alert("Wrong password.");
  }
}

function adminLogout() {
  localStorage.removeItem("swiftcart_admin");
  updateAdminUI();
}

function addProduct() {
  if (!isAdmin()) {
    alert("Only admin can add products.");
    return;
  }

  const nameEl = document.getElementById("pname");
  const priceEl = document.getElementById("pprice");
  const imgEl = document.getElementById("pimg");
  const categoryEl = document.getElementById("pcategory");

  if (!nameEl || !priceEl || !imgEl || !categoryEl) return;

  const product = normalizeProduct({
    id: createId(),
    name: nameEl.value,
    price: Number(priceEl.value),
    img: imgEl.value,
    category: categoryEl.value,
    featured: false
  });

  if (!product) {
    alert("Please enter valid product details.");
    return;
  }

  products.unshift(product);
  saveProducts();
  refreshShopViews();

  nameEl.value = "";
  priceEl.value = "";
  imgEl.value = "";
  categoryEl.value = "";
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.qty += 1;
  else cart.push({ productId, qty: 1 });

  saveCart();
  updateCart();
}

function removeItem(productId) {
  cart = cart.filter((i) => i.productId !== productId);
  saveCart();
  updateCart();
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeItem(productId);
    return;
  }
  saveCart();
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");
  if (!list || !totalEl || !countEl) return;

  const validIds = new Set(products.map((p) => p.id));
  cart = cart.filter((item) => validIds.has(item.productId));

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    list.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    list.innerHTML = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return "";
      total += product.price * item.qty;
      count += item.qty;
      return `<li>
        <div>
          <strong>${escapeHTML(product.name)}</strong><br>
          <small>UGX ${product.price.toLocaleString()} × ${item.qty}</small>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty('${item.productId}', -1)">-</button>
          <button onclick="changeQty('${item.productId}', 1)">+</button>
          <button onclick="removeItem('${item.productId}')">x</button>
        </div>
      </li>`;
    }).join("");
  }

  totalEl.textContent = total.toLocaleString();
  countEl.textContent = count;
  saveCart();
}

function checkoutWhatsApp() {
  if (cart.length === 0) return alert("Your cart is empty.");

  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const location = document.getElementById("location")?.value.trim();
  const payment = document.getElementById("payment")?.value.trim();

  if (!name || !phone || !location || !payment) return alert("Please complete all checkout details.");

  const lines = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return "";
    return `- ${product.name} x${item.qty} (UGX ${(product.price * item.qty).toLocaleString()})`;
  }).filter(Boolean);

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const message = [
    "New SwiftCart Order",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Location: ${location}`,
    `Payment: ${payment}`,
    "",
    "Items:",
    ...lines,
    "",
    `Total: UGX ${total.toLocaleString()}`
  ].join("\n");

  window.open(`https://wa.me/256748348839?text=${encodeURIComponent(message)}`, "_blank");
}

function toggleCart(event) {
  event.stopPropagation();
  const cartEl = document.getElementById("cart");
  if (!cartEl) return;
  cartEl.classList.toggle("open");
}

document.addEventListener("click", (event) => {
  const cartEl = document.getElementById("cart");
  const cartBtn = document.getElementById("cartButton");
  if (!cartEl || !cartBtn) return;
  if (!cartEl.contains(event.target) && !cartBtn.contains(event.target)) cartEl.classList.remove("open");
});

function refreshShopViews() {
  populateCategoryFilter();
  applyFilters();
  renderFeatured();
}

refreshShopViews();
updateAdminUI();
updateCart();
