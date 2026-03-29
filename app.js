const WHATSAPP_NUMBER = "256748348839";
const ADMIN_KEY = "meo_admin";

const defaultProducts = [
  { id: crypto.randomUUID(), name: "T9 Wireless Earbuds", price: 95000, category: "gadgets", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80" },
  { id: crypto.randomUUID(), name: "LED Ring Light", price: 65000, category: "content", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80" },
  { id: crypto.randomUUID(), name: "Portable Blender", price: 88000, category: "home", img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1000&q=80" },
  { id: crypto.randomUUID(), name: "Smart Fitness Watch", price: 175000, category: "gadgets", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80" }
];

const formatUGX = (value) => Number(value).toLocaleString();

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : fallback) : parsed;
const defaultProducts = [
  {
    name: "Smart Fitness Watch",
    price: 189000,
    category: "Gadgets",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Portable Blender",
    price: 97000,
    category: "Home",
    img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Premium Sneakers",
    price: 165000,
    category: "Fashion",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Face Care Set",
    price: 76000,
    category: "Beauty",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
  }
];

const whatsappNumber = "256748348839";

function safeArray(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    name: "Wireless Earbuds",
    price: 120000,
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Smart Watch",
    price: 180000,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Blender Pro",
    price: 95000,
    img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Sneakers",
    price: 145000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
  }
];

function safeReadArray(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
function normalizeProduct(p) {
  if (!p || typeof p !== "object") return null;
  const name = String(p.name || "").trim();
  const price = Number(p.price);
  const category = String(p.category || "Gadgets").trim();
  const img = String(p.img || "").trim();
  if (!name || Number.isNaN(price) || price <= 0 || !img) return null;
  return { name, price, category, img };
}

let products = safeArray("products", []).map(normalizeProduct).filter(Boolean);
let cart = safeArray("cart", []).map(normalizeProduct).filter(Boolean);
let filteredProducts = [];

if (products.length === 0) {
  products = [...defaultProducts];
  localStorage.setItem("products", JSON.stringify(products));
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  applyFilters();
  renderAdminProducts();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

let products = readJson("products", []);
let cart = readJson("cart", []);

if (!products.length) {
  products = defaultProducts;
  saveProducts();
}

const state = {
  search: "",
  category: "all",
  sort: "featured"
};

function getFilteredProducts() {
  let list = [...products];

  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (state.category !== "all") {
    list = list.filter((p) => p.category.toLowerCase() === state.category);
  }

  if (state.sort === "priceAsc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "priceDesc") list.sort((a, b) => b.price - a.price);
  if (state.sort === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
}

function renderProducts() {
  const listEl = document.getElementById("productList");
  if (!listEl) return;

  const visible = getFilteredProducts();
  listEl.innerHTML = visible.length
    ? visible
        .map(
          (p) => `
      <article class="card">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/500x300?text=No+Image'" />
        <h4>${p.name}</h4>
        <p>Category: ${p.category}</p>
        <p>UGX ${formatUGX(p.price)}</p>
        <button class="btn primary" type="button" onclick="addToCart('${p.id}')">Add to Cart</button>
      </article>`
        )
        .join("")
    : '<p class="muted">No products found. Try another filter.</p>';
}

function renderCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  const cats = [...new Set(products.map((p) => p.category.toLowerCase()))].sort();
  select.innerHTML = '<option value="all">All categories</option>' +
    cats.map((c) => `<option value="${c}">${c[0].toUpperCase() + c.slice(1)}</option>`).join("");
  select.value = state.category;
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");
  if (!itemsEl || !totalEl || !countEl) return;

  let total = 0;
  itemsEl.innerHTML = cart.length
    ? cart
        .map((item, idx) => {
          total += Number(item.price) || 0;
          return `<li><span>${item.name}<br><small>UGX ${formatUGX(item.price)}</small></span><button type="button" onclick="removeFromCart(${idx})">X</button></li>`;
        })
        .join("")
    : "<li>Cart is empty.</li>";

  totalEl.textContent = formatUGX(total);
  countEl.textContent = cart.length;
}

function renderAdminList() {
  const adminList = document.getElementById("adminList");
  if (!adminList) return;

  adminList.innerHTML = products
    .map(
      (p) => `
      <div class="admin-item">
        <img src="${p.img}" alt="${p.name}">
        <div><h5>${p.name}</h5><p>${p.category} • UGX ${formatUGX(p.price)}</p></div>
        <div class="admin-actions">
          <button class="edit" type="button" onclick="editProduct('${p.id}')">Edit</button>
          <button class="delete" type="button" onclick="deleteProduct('${p.id}')">Delete</button>
function renderProducts(list) {
  const container = document.getElementById("product-list");
  if (!container) return;

  if (!list.length) {
    container.innerHTML = '<p class="muted">No products found for this filter.</p>';
    return;
  }

  container.innerHTML = list
    .map(
      (p) => `
      <article class="card">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x260?text=No+Image'" />
        <span class="pill">${p.category}</span>
        <h4>${p.name}</h4>
        <p>UGX ${p.price.toLocaleString()}</p>
        <button class="btn btn-primary" onclick="addToCartByName('${encodeURIComponent(p.name)}')">Add to Cart</button>
      </article>`
function normalizeProduct(product) {
  if (!product || typeof product !== "object") return null;

  const name = String(product.name || "").trim();
  const price = Number(product.price);
  const img = String(product.img || "").trim();

  if (!name || Number.isNaN(price) || price <= 0 || !img) return null;
  return { name, price, img };
}

function persistProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

let products = safeReadArray("products", []).map(normalizeProduct).filter(Boolean);
let cart = safeReadArray("cart", []).map(normalizeProduct).filter(Boolean);

if (products.length === 0) {
  products = [...defaultProducts];
  persistProducts();
}

function saveProducts() {
  persistProducts();
  displayProducts();
  renderAdminProducts();
let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(defaultProducts));
}

function displayProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = "";

  if (products.length === 0) {
    list.innerHTML = '<p class="muted">No products available right now.</p>';
    return;
  }

  products.forEach((product, index) => {
    list.innerHTML += `
      <div class="card">
        <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
        <h4>${product.name}</h4>
        <p>UGX ${Number(product.price).toLocaleString()}</p>
  products.forEach((p, index) => {
    list.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>UGX ${Number(p.price).toLocaleString()}</p>
        <button onclick="addToCart(${index})">Add to Cart</button>
      </div>`;
  });
}

function renderAdminProducts() {
  const adminList = document.getElementById("adminProductList");
  if (!adminList) return;

  if (products.length === 0) {
    adminList.innerHTML = '<p class="muted">No products yet.</p>';
    return;
  }

  adminList.innerHTML = products
    .map(
      (product, index) => `
      <div class="admin-item">
        <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/120x120?text=No+Image'">
        <img src="${product.img}" alt="${product.name}">
        <div>
          <h5>${product.name}</h5>
          <p>UGX ${Number(product.price).toLocaleString()}</p>
        </div>
        <div class="admin-item-actions">
          <button onclick="editProduct(${index})" class="btn-edit">Edit</button>
          <button onclick="deleteProduct(${index})" class="btn-delete">Delete</button>
        </div>
      </div>`
    )
    .join("");
}

function refreshAll() {
  renderCategories();
  renderProducts();
  renderCart();
  renderAdminList();
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  cart.push({ ...product });
  saveCart();
  renderCart();
}
window.addToCart = addToCart;

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}
window.removeFromCart = removeFromCart;
function applyFilters() {
  const searchValue = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const categoryValue = document.getElementById("categoryFilter")?.value || "all";

  filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "all" || p.category === categoryValue;
    return matchesSearch && matchesCategory;
  });

  if (!document.getElementById("searchInput") && !document.getElementById("categoryFilter")) {
    filteredProducts = products.slice(0, 8);
  }

  renderProducts(filteredProducts);
}

function addToCartByName(encodedName) {
  const name = decodeURIComponent(encodedName);
  const product = products.find((p) => p.name === name);
  if (!product) return;
  cart.push({ ...product });
  saveCart();
function addProduct() {
  const nameEl = document.getElementById("pname");
  const priceEl = document.getElementById("pprice");
  const imgEl = document.getElementById("pimg");

  if (!nameEl || !priceEl || !imgEl) return;

  const candidate = normalizeProduct({
    name: nameEl.value,
    price: priceEl.value,
    img: imgEl.value
  });

  if (!candidate) {
    return alert("Enter valid product details");
  }

  products.push(candidate);
  const name = nameEl.value.trim();
  const price = parseFloat(priceEl.value);
  const img = imgEl.value.trim();
function addProduct() {
  const name = document.getElementById("pname").value.trim();
  const price = parseFloat(document.getElementById("pprice").value);
  const img = document.getElementById("pimg").value.trim();

  if (!name || Number.isNaN(price) || price <= 0 || !img) {
    return alert("Enter valid product details");
  }

  products.push({ name, price, img });
  saveProducts();

  nameEl.value = "";
  priceEl.value = "";
  imgEl.value = "";
  alert("Product added successfully.");
  alert("Product Added!");
}

function editProduct(index) {
  if (!products[index]) return;

  const current = products[index];
  const name = prompt("Edit product name:", current.name);
  if (name === null) return;

  const price = prompt("Edit product price:", String(current.price));
  if (price === null) return;
  const priceInput = prompt("Edit product price:", current.price);
  if (priceInput === null) return;

  const img = prompt("Edit product image URL:", current.img);
  if (img === null) return;

  const updated = normalizeProduct({ name, price, img });
  if (!updated) {
    return alert("Invalid details. Product not updated.");
  }

  const oldProduct = products[index];
  products[index] = updated;
  cart = cart.map((item) => {
    if (
      item.name === oldProduct.name &&
      Number(item.price) === Number(oldProduct.price) &&
      item.img === oldProduct.img
    ) {
      return { ...updated };
    }
    return item;
  });

  persistCart();
  const price = parseFloat(priceInput);
  if (!name.trim() || Number.isNaN(price) || price <= 0 || !img.trim()) {
    return alert("Invalid details. Product not updated.");
  }

  products[index] = {
    name: name.trim(),
    price,
    img: img.trim()
  };

  saveProducts();
  updateCart();
  alert("Product updated.");
}

function deleteProduct(index) {
  if (!products[index]) return;

  const target = products[index];
  if (!confirm(`Delete ${target.name}?`)) return;
  const shouldDelete = confirm(`Delete ${target.name}?`);
  if (!shouldDelete) return;

  products.splice(index, 1);
  cart = cart.filter(
    (item) =>
      !(item.name === target.name && Number(item.price) === Number(target.price) && item.img === target.img)
  );

  persistCart();
  localStorage.setItem("cart", JSON.stringify(cart));
  saveProducts();
  updateCart();
}

function addToCart(index) {
  if (!products[index]) return;

  cart.push({ ...products[index] });
  persistCart();
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
  alert("Product Added!");
}

function addToCart(index) {
  if (!products[index]) return;
  cart.push(products[index]);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function removeItem(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();

  cart.splice(index, 1);
  persistCart();
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");
  if (!list || !totalEl || !countEl) return;

  if (!cart.length) {
    list.innerHTML = "<li>Your cart is empty.</li>";
    totalEl.textContent = "0";
    countEl.textContent = "0";
    return;
  }

  let total = 0;
  list.innerHTML = cart
    .map((item, i) => {
      total += item.price;
      return `<li>${item.name} - UGX ${item.price.toLocaleString()} <button onclick="removeItem(${i})">X</button></li>`;
    })
    .join("");

  totalEl.textContent = total.toLocaleString();
  countEl.textContent = String(cart.length);
}

function toggleCart(event) {
  event?.stopPropagation();
  const drawer = document.getElementById("cart");
  if (!drawer) return;
  drawer.classList.toggle("open");
}

document.addEventListener("click", (event) => {
  const drawer = document.getElementById("cart");
  const toggle = document.getElementById("cartToggle");
  if (!drawer || !toggle) return;
  if (!drawer.contains(event.target) && !toggle.contains(event.target)) {
    drawer.classList.remove("open");
  }
});

function checkoutWhatsApp() {
  if (!cart.length) return alert("Cart is empty");
  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const location = document.getElementById("location")?.value.trim();
  const payment = document.getElementById("payment")?.value.trim();

  if (!name || !phone || !location || !payment) {
    return alert("Please fill all checkout fields.");
  }

  const items = cart.map((item) => `- ${item.name} (UGX ${item.price.toLocaleString()})`).join("\n");
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const message = `New Order\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\nPayment: ${payment}\n\nItems:\n${items}\n\nTotal: UGX ${total.toLocaleString()}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

function addProduct() {
  const name = document.getElementById("pname")?.value.trim();
  const price = Number(document.getElementById("pprice")?.value);
  const category = document.getElementById("pcategory")?.value.trim().toLowerCase();
  const img = document.getElementById("pimg")?.value.trim();

  if (!name || !price || price <= 0 || !category || !img) {
    alert("Enter valid product details.");
    return;
  }

  products.unshift({ id: crypto.randomUUID(), name, price, category, img });
  saveProducts();
  refreshAll();

  ["pname", "pprice", "pcategory", "pimg"].forEach((id) => {
  const img = document.getElementById("pimg")?.value.trim();
  const category = document.getElementById("pcategory")?.value.trim();

  const candidate = normalizeProduct({ name, price, img, category });
  if (!candidate) {
    return alert("Enter valid product details.");
  }

  products.push(candidate);
  saveProducts();
  clearAdminForm();
}

function clearAdminForm() {
  ["pname", "pprice", "pimg", "pcategory"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function editProduct(id) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return;

  const old = products[idx];
  const name = prompt("Product name:", old.name);
  if (name === null) return;
  const priceInput = prompt("Price (UGX):", String(old.price));
  if (priceInput === null) return;
  const category = prompt("Category:", old.category);
  if (category === null) return;
  const img = prompt("Image URL:", old.img);
  if (img === null) return;

  const price = Number(priceInput);
  if (!name.trim() || !category.trim() || !img.trim() || !price || price <= 0) {
    alert("Invalid values. Edit cancelled.");
    return;
  }

  products[idx] = { ...old, name: name.trim(), price, category: category.trim().toLowerCase(), img: img.trim() };
  cart = cart.map((item) => (item.id === id ? { ...products[idx] } : item));
  saveProducts();
  saveCart();
  refreshAll();
}
window.editProduct = editProduct;

function deleteProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  if (!confirm(`Delete ${p.name}?`)) return;

  products = products.filter((x) => x.id !== id);
  cart = cart.filter((x) => x.id !== id);
  saveProducts();
  saveCart();
  refreshAll();
}
window.deleteProduct = deleteProduct;

function checkoutWhatsApp() {
  if (!cart.length) return alert("Cart is empty.");

  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const location = document.getElementById("location")?.value.trim();
  const payment = document.getElementById("payment")?.value.trim();

  if (!name || !phone || !location || !payment) {
    alert("Please complete checkout details.");
    return;
  }

  const lines = cart.map((item) => `- ${item.name} (UGX ${formatUGX(item.price)})`);
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const message = [
    "New Dropshipping Order",
function editProduct(index) {
  const product = products[index];
  if (!product) return;

  const name = prompt("Product name:", product.name);
  if (name === null) return;
  const price = prompt("Price:", String(product.price));
  if (price === null) return;
  const category = prompt("Category:", product.category);
  if (category === null) return;
  const img = prompt("Image URL:", product.img);
  if (img === null) return;

  const updated = normalizeProduct({ name, price, category, img });
  if (!updated) return alert("Invalid updated details.");

  const old = products[index];
  products[index] = updated;

  cart = cart.map((item) =>
    item.name === old.name && item.img === old.img ? { ...updated } : item
  );

  saveCart();
  saveProducts();
  updateCart();
}

function deleteProduct(index) {
  const product = products[index];
  if (!product) return;
  if (!confirm(`Delete ${product.name}?`)) return;

  products.splice(index, 1);
  cart = cart.filter((item) => !(item.name === product.name && item.img === product.img));

  saveCart();
  saveProducts();
  updateCart();
}

function renderAdminProducts() {
  const adminList = document.getElementById("adminProductList");
  if (!adminList) return;

  adminList.innerHTML = products
    .map(
      (p, i) => `
      <div class="admin-item">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'" />
        <div>
          <h5>${p.name}</h5>
          <p>${p.category} • UGX ${p.price.toLocaleString()}</p>
        </div>
        <div class="admin-actions">
          <button class="btn btn-small" onclick="editProduct(${i})">Edit</button>
          <button class="btn btn-small btn-danger" onclick="deleteProduct(${i})">Delete</button>
        </div>
      </div>`
    )
    .join("");
}

(function adminGuard() {
  const panel = document.getElementById("adminPanel");
  if (!panel) return;

  if (!localStorage.getItem("adminAccess")) {
    const pass = prompt("Enter admin password:");
    if (pass === "admin123") {
      localStorage.setItem("adminAccess", "true");
    } else {
      panel.style.display = "none";
    }
  }
})();

applyFilters();
  list.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    list.innerHTML = "<li>Your cart is empty.</li>";
  }

  cart.forEach((item, index) => {
    list.innerHTML += `<li>${item.name} - UGX ${Number(item.price).toLocaleString()} <button onclick="removeItem(${index})">X</button></li>`;
    total += Number(item.price) || 0;
  });

  totalEl.innerText = total.toLocaleString();
  countEl.innerText = cart.length;
}

function checkoutWhatsApp() {
  if (cart.length === 0) return alert("Cart is empty");

  const nameEl = document.getElementById("custName");
  const phoneEl = document.getElementById("phone");
  const locationEl = document.getElementById("location");
  const paymentEl = document.getElementById("payment");

  if (!nameEl || !phoneEl || !locationEl || !paymentEl) return;

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  const location = locationEl.value.trim();
  const payment = paymentEl.value.trim();

  if (!name || !phone || !location || !payment) {
    return alert("Please fill in your checkout details.");
  }

  const lines = cart.map((item) => `- ${item.name} (UGX ${Number(item.price).toLocaleString()})`);
  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const message = [
    "New Order:",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Location: ${location}`,
    `Payment: ${payment}`,
    "",
    "Items:",
    ...lines,
    "",
    `Total: UGX ${formatUGX(total)}`
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

function setupDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  const openBtn = document.getElementById("cartBtn");
  const closeBtn = document.getElementById("closeCart");
  if (!drawer || !overlay || !openBtn || !closeBtn) return;

  const open = () => {
    drawer.classList.add("open");
    overlay.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);
}

function setupFilters() {
  const search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter");
  const sort = document.getElementById("sortSelect");

  search?.addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  category?.addEventListener("change", (e) => {
    state.category = e.target.value;
    renderProducts();
  });

  sort?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });
}

function setupAdmin() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  if (!localStorage.getItem(ADMIN_KEY)) {
    const pass = prompt("Enter admin password:");
    if (pass === "admin123") localStorage.setItem(ADMIN_KEY, "1");
    else adminPanel.style.display = "none";
  }

  document.getElementById("addProductBtn")?.addEventListener("click", addProduct);
}

function setupCheckout() {
  document.getElementById("checkoutBtn")?.addEventListener("click", checkoutWhatsApp);
}

setupDrawer();
setupFilters();
setupAdmin();
setupCheckout();
refreshAll();
    `Total: UGX ${total.toLocaleString()}`
  ].join("\n");

  window.open(`https://wa.me/256748348839?text=${encodeURIComponent(message)}`, "_blank");
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;
  const payment = document.getElementById("payment").value;

  let message = `New Order:%0AName: ${name}%0APhone: ${phone}%0ALocation: ${location}%0APayment: ${payment}%0A%0AItems:%0A`;
  let total = 0;

  cart.forEach((item) => {
    message += `- ${item.name} (UGX ${item.price})%0A`;
    total += Number(item.price) || 0;
  });

  message += `%0ATotal: UGX ${total}`;
  window.open(`https://wa.me/256748348839?text=${message}`, "_blank");
}

function toggleCart(event) {
  event.stopPropagation();
  const cartEl = document.getElementById("cart");
  if (!cartEl) return;

  cartEl.style.display = cartEl.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
  const cartEl = document.getElementById("cart");
  const cartButton = document.getElementById("cartButton");
  if (!cartEl || !cartButton) return;

  if (!cartEl.contains(event.target) && !cartButton.contains(event.target)) {
    cartEl.style.display = "none";
  }
});

(function setupAdminAccess() {
  const adminPanel = document.querySelector(".admin");
  if (!adminPanel) return;

if (document.querySelector(".admin")) {
  if (!localStorage.getItem("admin")) {
    const pass = prompt("Enter admin password to manage store:");
    if (pass === "admin123") {
      localStorage.setItem("admin", "true");
    } else {
      adminPanel.style.display = "none";
    }
  }
})();
      document.querySelector(".admin").style.display = "none";
    }
  }
}

displayProducts();
renderAdminProducts();
updateCart();
