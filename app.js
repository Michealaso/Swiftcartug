const DEFAULT_PRODUCTS = [
  {
    id: crypto.randomUUID(),
    name: "Mini Projector 4K",
    price: 320000,
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
    category: "Gadgets",
    featured: true
  },
  {
    id: crypto.randomUUID(),
    name: "Wireless Gaming Headset",
    price: 185000,
    img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    category: "Gadgets",
    featured: true
  },
  {
    id: crypto.randomUUID(),
    name: "Portable Blender",
    price: 95000,
    img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    featured: false
  },
  {
    id: crypto.randomUUID(),
    name: "Smart Watch",
    price: 210000,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    featured: true
  },
  {
    id: crypto.randomUUID(),
    name: "LED Ring Light",
    price: 78000,
    img: "https://images.unsplash.com/photo-1609921205586-1cc2f0b4b26d?auto=format&fit=crop&w=900&q=80",
    category: "Creator",
    featured: false
  },
  {
    id: crypto.randomUUID(),
    name: "Minimal Backpack",
    price: 125000,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    featured: false
  }
];

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

function normalizeProduct(item) {
  if (!item || typeof item !== "object") return null;
  const name = String(item.name || "").trim();
  const img = String(item.img || "").trim();
  const category = String(item.category || "General").trim() || "General";
  const price = Number(item.price);

  if (!name || !img || Number.isNaN(price) || price <= 0) return null;

  return {
    id: item.id || crypto.randomUUID(),
    name,
    img,
    category,
    price,
    featured: Boolean(item.featured)
  };
}

let products = safeRead("meo_products", []).map(normalizeProduct).filter(Boolean);
if (products.length === 0) {
  products = DEFAULT_PRODUCTS;
  localStorage.setItem("meo_products", JSON.stringify(products));
}

let cart = safeRead("meo_cart", []).filter((item) => item && item.productId && Number(item.qty) > 0);
let filteredProducts = [...products];

function saveProducts() {
  localStorage.setItem("meo_products", JSON.stringify(products));
}

function saveCart() {
  localStorage.setItem("meo_cart", JSON.stringify(cart));
}

function renderProductGrid(targetId, list) {
  const grid = document.getElementById(targetId);
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '<p class="muted">No products found.</p>';
    return;
  }

  grid.innerHTML = list
    .map(
      (p) => `
      <article class="card">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/500x350?text=No+Image'" />
        <span class="chip">${p.category}</span>
        <h4>${p.name}</h4>
        <p>UGX ${p.price.toLocaleString()}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </article>
    `
    )
    .join("");
}

function renderFeatured() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  renderProductGrid("featuredGrid", featured.length ? featured : products.slice(0, 4));
}

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  const categories = [...new Set(products.map((p) => p.category))].sort();
  select.innerHTML = '<option value="all">All categories</option>';
  categories.forEach((cat) => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function applyFilters() {
  const searchEl = document.getElementById("searchInput");
  const categoryEl = document.getElementById("categoryFilter");
  const sortEl = document.getElementById("sortBy");

  let list = [...products];

  const term = (searchEl?.value || "").trim().toLowerCase();
  const category = categoryEl?.value || "all";
  const sortBy = sortEl?.value || "default";

  if (term) {
    list = list.filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  }

  if (category !== "all") {
    list = list.filter((p) => p.category === category);
  }

  if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

  filteredProducts = list;
  renderProductGrid("product-list", filteredProducts);

  const meta = document.getElementById("productMeta");
  if (meta) meta.textContent = `${filteredProducts.length} item${filteredProducts.length === 1 ? "" : "s"}`;
}

function addProduct() {
  const nameEl = document.getElementById("pname");
  const priceEl = document.getElementById("pprice");
  const imgEl = document.getElementById("pimg");
  const categoryEl = document.getElementById("pcategory");

  if (!nameEl || !priceEl || !imgEl || !categoryEl) return;

  const product = normalizeProduct({
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
  populateCategoryFilter();
  applyFilters();
  renderAdminProducts();

  nameEl.value = "";
  priceEl.value = "";
  imgEl.value = "";
  categoryEl.value = "";
}

function renderAdminProducts() {
  const list = document.getElementById("adminProductList");
  if (!list) return;

  list.innerHTML = products
    .map(
      (p) => `
      <div class="admin-item">
        <img src="${p.img}" alt="${p.name}" />
        <div>
          <h5>${p.name}</h5>
          <p>${p.category} • UGX ${p.price.toLocaleString()}</p>
        </div>
        <div class="admin-actions">
          <button class="btn-small" onclick="editProduct('${p.id}')">Edit</button>
          <button class="btn-small danger" onclick="deleteProduct('${p.id}')">Delete</button>
        </div>
      </div>`
    )
    .join("");
}

function editProduct(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) return;

  const current = products[index];
  const name = prompt("Product name", current.name);
  if (name === null) return;
  const priceInput = prompt("Price", String(current.price));
  if (priceInput === null) return;
  const img = prompt("Image URL", current.img);
  if (img === null) return;
  const category = prompt("Category", current.category);
  if (category === null) return;

  const updated = normalizeProduct({
    ...current,
    name,
    price: Number(priceInput),
    img,
    category
  });

  if (!updated) {
    alert("Invalid update details.");
    return;
  }

  products[index] = updated;
  saveProducts();
  populateCategoryFilter();
  applyFilters();
  renderAdminProducts();
}

function deleteProduct(id) {
  const target = products.find((p) => p.id === id);
  if (!target) return;
  if (!confirm(`Delete ${target.name}?`)) return;

  products = products.filter((p) => p.id !== id);
  cart = cart.filter((c) => c.productId !== id);

  saveProducts();
  saveCart();
  populateCategoryFilter();
  applyFilters();
  renderAdminProducts();
  updateCart();
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const found = cart.find((c) => c.productId === productId);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }

  saveCart();
  updateCart();
}

function removeItem(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
  updateCart();
}

function changeQty(productId, delta) {
  const found = cart.find((item) => item.productId === productId);
  if (!found) return;

  found.qty += delta;
  if (found.qty <= 0) {
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

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    list.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    list.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return "";

        const subtotal = product.price * item.qty;
        total += subtotal;
        count += item.qty;

        return `<li>
          <div>
            <strong>${product.name}</strong><br>
            <small>UGX ${product.price.toLocaleString()} × ${item.qty}</small>
          </div>
          <div class="qty-controls">
            <button onclick="changeQty('${item.productId}', -1)">-</button>
            <button onclick="changeQty('${item.productId}', 1)">+</button>
            <button onclick="removeItem('${item.productId}')">x</button>
          </div>
        </li>`;
      })
      .join("");
  }

  totalEl.textContent = total.toLocaleString();
  countEl.textContent = count;
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const location = document.getElementById("location")?.value.trim();
  const payment = document.getElementById("payment")?.value.trim();

  if (!name || !phone || !location || !payment) {
    alert("Please complete all checkout details.");
    return;
  }

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return "";
      return `- ${product.name} x${item.qty} (UGX ${(product.price * item.qty).toLocaleString()})`;
    })
    .filter(Boolean);

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

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
  if (!cartEl.contains(event.target) && !cartBtn.contains(event.target)) {
    cartEl.classList.remove("open");
  }
});

(function setupAdminAccess() {
  const admin = document.querySelector(".admin");
  if (!admin) return;

  if (!localStorage.getItem("meo_admin")) {
    const password = prompt("Enter admin password:");
    if (password === "admin123") {
      localStorage.setItem("meo_admin", "true");
    } else {
      admin.style.display = "none";
    }
  }
})();

renderFeatured();
populateCategoryFilter();
applyFilters();
renderAdminProducts();
updateCart();
