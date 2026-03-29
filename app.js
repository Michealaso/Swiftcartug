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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

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
    )
    .join("");
}

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
  updateCart();
}

function removeItem(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
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
renderAdminProducts();
updateCart();
