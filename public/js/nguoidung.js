document.addEventListener("DOMContentLoaded", () => {
  // Load thông tin người dùng
  fetch("/user/info")
    .then(res => res.json())
    .then(data => {
      document.getElementById("username").textContent = data.username;
      document.getElementById("email").textContent = data.email;
    });

  // Đổi mật khẩu
document.getElementById("change-password").addEventListener("click", () => {
  const oldPassword = prompt("Nhập mật khẩu cũ:");
  const newPassword = prompt("Nhập mật khẩu mới:");

  if (oldPassword && newPassword) {
    fetch("/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword })
    })
      .then(res => res.text())
      .then(msg => alert(msg))
      .catch(err => alert("Lỗi đổi mật khẩu"));
  }
});
});


function saveField(field) {
  const value = document.getElementById(`${field}-input`).value;
  fetch("/user/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: value })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById(`${field}-display`).textContent = value;
      cancelEdit(field);
    });
}

function cancelEdit(field) {
  document.getElementById(`${field}-input`).style.display = "none";
  document.getElementById(`${field}-actions`).style.display = "none";
  document.getElementById(`${field}-display`).style.display = "inline-block";
}
