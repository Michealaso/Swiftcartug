const defaultProducts = [
  {
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
