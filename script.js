const products = [
  { name: "Trà Chanh", price: 15000, image: "images/tra_chanh.jpg" },
  { name: "Trà Sữa", price: 25000, image: "images/tra_sua.jpg" },
  { name: "Nước Cam", price: 20000, image: "images/nuoc_cam.jpg" },
  { name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg" }
];

const cart = [];
let selectedProductIndex = null;

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <h3>${product.name}</h3>
      <p>Giá: ${product.price.toLocaleString()}đ</p>
      <button onclick="showQuantityModal(${index})">Thêm vào giỏ</button>
    `;
    container.appendChild(card);
  });
}

function showQuantityModal(index) {
  selectedProductIndex = index;
  document.getElementById("quantityInput").value = 1;
  document.getElementById("quantityModal").style.display = "flex";
}

function confirmAddToCart() {
  const quantity = parseInt(document.getElementById("quantityInput").value);
  if (isNaN(quantity) || quantity < 1) {
    alert("Vui lòng nhập số lượng hợp lệ.");
    return;
  }

  const product = products[selectedProductIndex];
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  updateCartCount();
  closeQuantityModal();
  showToast("Đã thêm vào giỏ hàng!");
}

function closeQuantityModal() {
  document.getElementById("quantityModal").style.display = "none";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}

function removeFromCart(productName) {
  const index = cart.findIndex(item => item.name === productName);
  if (index > -1) {
    cart.splice(index, 1);
  }
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = totalItems;
}

function toggleModal(show) {
  document.getElementById('loginModal').style.display = show ? 'flex' : 'none';
}

fetch('login.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('modal-container').innerHTML = data;
  });
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
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  if (cart.length === 0) {
    list.innerHTML = "<li>Giỏ hàng trống.</li>";
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} - ${item.price.toLocaleString()}đ
      <button onclick="removeFromCart('${item.name}')">Xóa</button>
    `;
    list.appendChild(li);
  });
}

window.onclick = function(event) {
  const loginModal = document.getElementById("loginModal");
  const cartModal = document.getElementById("cartModal");
  const quantityModal = document.getElementById("quantityModal");
  if (event.target === loginModal) toggleModal(false);
  if (event.target === cartModal) cartModal.style.display = "none";
  if (event.target === quantityModal) closeQuantityModal();
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
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <h3>${product.name}</h3>
      <p>Giá: ${product.price.toLocaleString()}đ</p>
      <button onclick="showQuantityModal(${products.indexOf(product)})">Thêm vào giỏ</button>`;
    container.appendChild(card);
  });
});

renderProducts();
