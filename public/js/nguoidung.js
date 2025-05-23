let originalValues = {};

function editField(fieldName) {
  const displayElement = document.getElementById(`${fieldName}-display`);
  originalValues[fieldName] = displayElement.textContent;
  displayElement.style.display = 'none';
  document.getElementById(`${fieldName}-input`).style.display = 'block';
  document.getElementById(`${fieldName}-input`).value = originalValues[fieldName];
  document.getElementById(`save-${fieldName}`).style.display = 'inline-block';
  document.getElementById(`cancel-${fieldName}`).style.display = 'inline-block';
  event.target.style.display = 'none';
}


function saveField(fieldName) {
  const newValue = document.getElementById(`${fieldName}-input`).value;
  if (fieldName === 'email' && !validateEmail(newValue)) {
    alert('Email không hợp lệ');
    return;
  }
  console.log(`Updating ${fieldName} to:`, newValue);
  document.getElementById(`${fieldName}-display`).textContent = newValue;
  cancelEdit(fieldName);
}


function cancelEdit(fieldName) {
  document.getElementById(`${fieldName}-display`).textContent = originalValues[fieldName];
  document.getElementById(`${fieldName}-display`).style.display = 'inline';
  document.getElementById(`${fieldName}-input`).style.display = 'none';
  document.getElementById(`save-${fieldName}`).style.display = 'none';
  document.getElementById(`cancel-${fieldName}`).style.display = 'none';
  event.target.parentElement.querySelector('button:not([id^="save-"]):not([id^="cancel-"])').style.display = 'inline-block';
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  document.getElementById("change-password")?.addEventListener("click", handleChangePassword);
});

async function loadUserInfo() {
  try {
    const response = await fetch("/api/user/info", { credentials: "include" });
    if (!response.ok) throw new Error("Không thể lấy thông tin người dùng");

    const user = await response.json();
    document.getElementById("username-display").textContent = user.username;
    document.getElementById("email-display").textContent = user.email;

    document.getElementById("username-input").value = user.username;
    document.getElementById("email-input").value = user.email;
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tải thông tin người dùng");
  }
}

async function saveField(field) {
  try {
    const input = document.getElementById(`${field}-input`);
    const value = input.value.trim();

    if (!value) throw new Error(`Vui lòng nhập ${field === 'username' ? 'tên người dùng' : 'email'}`);

    const response = await fetch("/api/user/update", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Cập nhật thất bại");

    document.getElementById(`${field}-display`).textContent = value;
    cancelEdit(field);
    alert(data.message || "Cập nhật thành công");
  } catch (err) {
    console.error("Lỗi:", err);
    alert(err.message);
  }
}



async function handleChangePassword() {
  try {
    const oldPassword = await showPasswordForm("Nhập mật khẩu cũ:");
    const newPassword = await showPasswordForm("Nhập mật khẩu mới:");
    const response = await fetch("/api/user/password", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Đổi mật khẩu thất bại");

    alert(data.message || "Đổi mật khẩu thành công");
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    alert(err.message);
  }
}


function showPasswordForm(title) {
  return new Promise((resolve) => {
    const form = document.createElement("div");
    form.className = "password-form";
    form.innerHTML = `
      <label>${title}</label>
      <input type="password" />
      <button>Xác nhận</button>
      <button type="button">Hủy</button>
    `;
    document.body.appendChild(form);
    const [input, confirmBtn, cancelBtn] = form.querySelectorAll("input, button");

    confirmBtn.onclick = () => {
      if (input.value.trim()) {
        document.body.removeChild(form);
        resolve(input.value.trim());
      }
    };
    cancelBtn.onclick = () => {
      document.body.removeChild(form);
      resolve(null);
    };
  });
}

function editField(field) {
  document.getElementById(`${field}-display`).style.display = "none";
  document.getElementById(`${field}-input`).style.display = "inline-block";
  document.getElementById(`save-${field}`).style.display = "inline-block";
  document.getElementById(`cancel-${field}`).style.display = "inline-block";
}

function cancelEdit(field) {
  document.getElementById(`${field}-display`).style.display = "inline-block";
  document.getElementById(`${field}-input`).style.display = "none";
  document.getElementById(`save-${field}`).style.display = "none";
  document.getElementById(`cancel-${field}`).style.display = "none";
}

