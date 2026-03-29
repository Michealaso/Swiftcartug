let products = JSON.parse(localStorage.getItem("products")) || [
    // {name:"Wireless Earbuds", price:50000, img:"https://images.unsplash.com/photo-1585386959984-a4155224a1a"},
    // {name:"Smart Watch", price:80000, img:"https://images.unsplash.com/photo-1517430816045-df4b7de11d1d"}
   ];
   
   let cart = JSON.parse(localStorage.getItem("cart")) || [];
   
   function displayProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach((p, index) => {
     list.innerHTML += `
     <div class="card">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <p>UGX ${p.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
     </div>`;
    });
   }
   
   function addProduct() {
    const name = document.getElementById("pname").value.trim();
    const price = parseFloat(document.getElementById("pprice").value);
    const img = document.getElementById("pimg").value.trim();
    if(!name || isNaN(price) || price <= 0 || !img) return alert("Enter valid product details");
    products.push({name, price, img});
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    alert("Product Added!");
   }
   
   function addToCart(index) {
    if(!products[index]) return;
    cart.push(products[index]);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
   }
   
   function removeItem(index) {
    if(index < 0 || index >= cart.length) return;
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
   }
   
   function updateCart() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cartCount");
    list.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
     list.innerHTML += `<li>${item.name} - UGX ${item.price} <button onclick=\"removeItem(${index})\">X</button></li>`;
     total += Number(item.price) || 0;
    });
    totalEl.innerText = total;
    countEl.innerText = cart.length;
   }
   
   function checkoutWhatsApp() {
    if(cart.length === 0) return alert("Cart is empty");
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;
    const payment = document.getElementById("payment").value;
   
    let message = `New Order:%0AName: ${name}%0APhone: ${phone}%0ALocation: ${location}%0APayment: ${payment}%0A%0AItems:%0A`;
    let total = 0;
    cart.forEach(item => {
     message += `- ${item.name} (UGX ${item.price})%0A`;
     total += Number(item.price) || 0;
    });
    message += `%0ATotal: UGX ${total}`;
    window.open(`https://wa.me/256748348839?text=${message}`, '_blank');
   }
   
   function toggleCart(event) {
    event.stopPropagation();
    const cartEl = document.getElementById('cart');
    cartEl.style.display = cartEl.style.display === 'block' ? 'none' : 'block';
   }
   
   document.addEventListener('click', function(event) {
    const cartEl = document.getElementById('cart');
    const cartButton = document.getElementById('cartButton');
    if (!cartEl.contains(event.target) && !cartButton.contains(event.target)) {
     cartEl.style.display = 'none';
    }
   });
   
   // Admin login
   if(!localStorage.getItem("admin")) {
    const pass = prompt("Enter admin password to manage store:");
    if(pass === "admin123") localStorage.setItem("admin", "true");
    else document.querySelector('.admin').style.display = 'none';
   }
   
   // Initialize
   displayProducts();
   updateCart();