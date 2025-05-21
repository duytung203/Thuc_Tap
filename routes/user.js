const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Lấy danh sách người dùng
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT username, email, role FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;


// Thêm người dùng
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users SET ?', { username, email, password: hashed, role }, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Thêm người dùng thành công' });
  });
});

// Cập nhật người dùng
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  db.query('UPDATE users SET ? WHERE id = ?', [{ username, email, role }, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Cập nhật thành công' });
  });
});

// Xoá người dùng
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Xoá thành công' });
  });
});

// Reset mật khẩu
router.put('/:id/reset', async (req, res) => {
  const { id } = req.params;
  const newPassword = await bcrypt.hash('123456', 10);
  db.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Đặt lại mật khẩu thành công (123456)' });
  });
});

module.exports = router;
