const products = [
  { name: "Trà Chanh", price: 15000 },
  { name: "Trà Sữa", price: 25000 },
  { name: "Nước Cam", price: 20000 }
];

const cart = [];

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Giá: ${product.price.toLocaleString()}đ</p>
      <button onclick="addToCart(${index})">Thêm vào giỏ</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(index) {
  cart.push(products[index]);
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("giohang-count").innerText = cart.length;
}

function toggleModal(show) {
  document.getElementById('loginModal').style.display = show ? 'flex' : 'none';
}

function switchTab(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[tab === 'login' ? 0 : 1].classList.add('active');
}

function toggleCart() {
  const modal = document.getElementById("cartModal");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    renderCart();
    modal.style.display = "flex";
  }
}

function renderCart() {
  const list = document.getElementById("giohang-items");
  list.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price.toLocaleString()}đ`;
    list.appendChild(li);
  });
}

window.onclick = function(event) {
  const loginModal = document.getElementById("loginModal");
  const cartModal = document.getElementById("cartModal");
  if (event.target === loginModal) toggleModal(false);
  if (event.target === cartModal) cartModal.style.display = "none";
}

document.getElementById("search").addEventListener("input", function(e) {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  filtered.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Giá: ${product.price.toLocaleString()}đ</p>
      <button onclick="addToCart(${products.indexOf(product)})">Thêm vào giỏ</button>
    `;
    container.appendChild(card);
  });
});

renderProducts();
