const products = [
  {name: "Trà Chanh", price: 150000000000, image: "images/tra_chanh.jpg" },
  {name: "Trà Sữa", price: 2500000, image: "images/tra_sua.jpg" },
  {name: "Nước Cam", price: 20000, image: "images/nuoc_cam.jpg" },
  {name: "Nước Cam", price: 20000, image: "images/nuoc_cam.jpg" },
  {name: "Nước Cam", price: 20000, image: "images/nuoc_cam.jpg" },
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg"} ,
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg"} ,
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg"} ,
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg"} ,
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg"} ,
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg" },
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg" },
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg" },
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg" },
  {name: "Cà Phê Đá Đen", price: 25000, image: "images/ca_phe_den.jpg" },
];

const cart = [];
let selectedProductIndex = null;
//gio hang
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

fetch('index.html')
  .then(response => response.text())
  .then(htmlString => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const modal = doc.querySelector('.modal'); 
    document.getElementById('modal-container').appendChild(modal);
  });         

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
  document.querySelectorAll('.toggle-submenu').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // ngan k cho chuyen trang
      const parent = this.parentElement;
      parent.classList.toggle('open');
    });
  });

  async function login() {
  const email = document.querySelector('#loginForm input[type="text"]').value;
  const password = document.querySelector('#loginForm input[type="password"]').value;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    updateUserMenu();      
    toggleModal(false);    
    alert(data.message);   
    if (data.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/index.html';
    }
  } else {
    alert(data.message || 'Đăng nhập thất bại');
  }
}



document.getElementById('registerBtn')?.addEventListener('click', register);
async function register() {
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  alert(data.message);
  if (res.ok) {
    switchTab('login');
  }
}


// chuyen tab dangnhap/dangky
function switchTab(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[tab === 'login' ? 0 : 1].classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  updateUserMenu();
});

function updateUserMenu() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const userMenu = document.getElementById('userMenu');
  if (token && username && userMenu) {
    userMenu.innerHTML = `
      <div class="dropdown">
        <button class="dropbtn" onclick="toggleUserMenu()">Xin chào ${username}</button>
        <div class="dropdown-content" id="userDropdown">
          <a href="nguoidung.html" target="_blank">Thông tin người dùng</a>
          <a href="#">Lịch sử giao dịch</a>
          <a href="#" onclick="logout()">Đăng xuất</a>
          </div>
      </div>
        <button class="cart-btn" onclick="toggleCart()">Giỏ hàng (<span id="cart-count">0</span>)</button></div> 
      </div>
    `;
    const modal = document.getElementById('loginModal');
    if (modal) toggleModal(false);
  }
}
function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');

  const userMenu = document.getElementById('userMenu');
  userMenu.innerHTML = `
    <button class="login-btn" onclick="toggleModal(true)">Đăng nhập</button>
    <button class="cart-btn" onclick="toggleCart()">Giỏ hàng (<span id="cart-count">0</span>)</button>
  `;
}

let slideIndex = 0;
let slideInterval;


function initBanner() {
  showSlides();
  startSlideShow();

  document.querySelector('.banner-prev').addEventListener('click', () => {
    plusSlides(-1);
    resetInterval();
  });
  
  document.querySelector('.banner-next').addEventListener('click', () => {
    plusSlides(1);
    resetInterval();
  });
  
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide(index);
      resetInterval();
    });
  });
}

function showSlides() {
  let i;
  const slides = document.getElementsByClassName("banner-slide");
  const dots = document.getElementsByClassName("dot");
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  

  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

function plusSlides(n) {
  const slides = document.getElementsByClassName("banner-slide");
  slideIndex += n;
  
  if (slideIndex > slides.length) {slideIndex = 1}
  if (slideIndex < 1) {slideIndex = slides.length}
  
  showSlides();
}

function currentSlide(n) {
  slideIndex = n + 1;
  showSlides();
}


function startSlideShow() {
  slideInterval = setInterval(() => {
    showSlides();
  }, 3000);
}


function resetInterval() {
  clearInterval(slideInterval);
  startSlideShow();
}

document.addEventListener('DOMContentLoaded', initBanner);

