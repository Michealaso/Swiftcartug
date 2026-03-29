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
  } catch {
    return fallback;
  }
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
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
