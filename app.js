const defaultProducts = [
  { name: "Portable Blender", price: 95000, img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80" },
  { name: "Smart Watch Pro", price: 185000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" },
  { name: "LED Strip Lights", price: 70000, img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80" },
  { name: "Wireless Earbuds", price: 125000, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80" }
];

function safeReadArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") return null;
  const name = String(product.name || "").trim();
  const price = Number(product.price);
  const img = String(product.img || "").trim();
  if (!name || Number.isNaN(price) || price <= 0 || !img) return null;
  return { name, price, img };
}

let products = safeReadArray("products").map(normalizeProduct).filter(Boolean);
let cart = safeReadArray("cart").map(normalizeProduct).filter(Boolean);

if (products.length === 0) {
  products = [...defaultProducts];
  localStorage.setItem("products", JSON.stringify(products));
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
  renderAdminProducts();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function displayProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  if (products.length === 0) {
    list.innerHTML = '<p>No products found.</p>';
    return;
  }

  list.innerHTML = products.map((product, index) => `
    <article class="card">
      <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Product'">
      <h4>${product.name}</h4>
      <p>UGX ${Number(product.price).toLocaleString()}</p>
      <button class="btn primary" onclick="addToCart(${index})">Add to Cart</button>
    </article>
  `).join("");
}

function renderAdminProducts() {
  const adminList = document.getElementById("adminProductList");
  if (!adminList) return;

  adminList.innerHTML = products.map((product, index) => `
    <div class="admin-item">
      <img src="${product.img}" alt="${product.name}">
      <div>
        <h5>${product.name}</h5>
        <p>UGX ${Number(product.price).toLocaleString()}</p>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" onclick="editProduct(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteProduct(${index})">Delete</button>
      </div>
    </div>
  `).join("") || '<p class="muted">No products to manage.</p>';
}

function addProduct() {
  const nameEl = document.getElementById("pname");
  const priceEl = document.getElementById("pprice");
  const imgEl = document.getElementById("pimg");
  if (!nameEl || !priceEl || !imgEl) return;

  const next = normalizeProduct({
    name: nameEl.value,
    price: priceEl.value,
    img: imgEl.value
  });

  if (!next) return alert("Please enter valid product details.");

  products.push(next);
  saveProducts();

  nameEl.value = "";
  priceEl.value = "";
  imgEl.value = "";
}

function editProduct(index) {
  const item = products[index];
  if (!item) return;

  const name = prompt("Edit name:", item.name);
  if (name === null) return;
  const price = prompt("Edit price:", String(item.price));
  if (price === null) return;
  const img = prompt("Edit image URL:", item.img);
  if (img === null) return;

  const updated = normalizeProduct({ name, price, img });
  if (!updated) return alert("Invalid input. Product not updated.");

  const old = products[index];
  products[index] = updated;

  cart = cart.map((c) =>
    c.name === old.name && Number(c.price) === Number(old.price) && c.img === old.img ? { ...updated } : c
  );

  localStorage.setItem("cart", JSON.stringify(cart));
  saveProducts();
  updateCart();
}

function deleteProduct(index) {
  const item = products[index];
  if (!item) return;
  if (!confirm(`Delete ${item.name}?`)) return;

  products.splice(index, 1);
  cart = cart.filter((c) => !(c.name === item.name && Number(c.price) === Number(item.price) && c.img === item.img));

  localStorage.setItem("cart", JSON.stringify(cart));
  saveProducts();
  updateCart();
}

function addToCart(index) {
  const product = products[index];
  if (!product) return;
  cart.push({ ...product });
  saveCart();
}

function removeItem(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");
  if (!list || !totalEl || !countEl) return;

  let total = 0;
  list.innerHTML = cart.map((item, i) => {
    total += Number(item.price) || 0;
    return `<li>${item.name} - UGX ${Number(item.price).toLocaleString()} <button onclick="removeItem(${i})">X</button></li>`;
  }).join("");

  if (cart.length === 0) list.innerHTML = "<li>Your cart is empty.</li>";

  totalEl.textContent = total.toLocaleString();
  countEl.textContent = cart.length;
}

function checkoutWhatsApp() {
  if (cart.length === 0) return alert("Cart is empty.");

  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const location = document.getElementById("location")?.value.trim();
  const payment = document.getElementById("payment")?.value.trim();

  if (!name || !phone || !location || !payment) {
    return alert("Please fill all checkout fields.");
  }

  const items = cart.map((p) => `- ${p.name} (UGX ${Number(p.price).toLocaleString()})`).join("\n");
  const total = cart.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const message = [
    "New Order",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Location: ${location}`,
    `Payment: ${payment}`,
    "",
    "Items:",
    items,
    "",
    `Total: UGX ${total.toLocaleString()}`
  ].join("\n");

  window.open(`https://wa.me/256748348839?text=${encodeURIComponent(message)}`, "_blank");
}

function toggleCart(event) {
  event.stopPropagation();
  const cart = document.getElementById("cart");
  if (!cart) return;
  cart.style.display = cart.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", (event) => {
  const cart = document.getElementById("cart");
  const cartButton = document.getElementById("cartButton");
  if (!cart || !cartButton) return;
  if (!cart.contains(event.target) && !cartButton.contains(event.target)) cart.style.display = "none";
});

(function adminAuth() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  if (!localStorage.getItem("admin")) {
    const pass = prompt("Enter admin password:");
    if (pass === "admin123") localStorage.setItem("admin", "true");
    else adminPanel.style.display = "none";
  }
})();

displayProducts();
renderAdminProducts();
updateCart();
