const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId || req.session.role !== 'user') {
    return res.status(401).json({ message: 'Bạn không có quyền truy cập' });
  }
  next();
};
// Lấy danh sách người dùng
router.get('/', (req, res) => {
  db.query('SELECT id, username, email, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

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

// Lấy thông tin người dùng đã đăng nhập
router.get('/info', authMiddleware, (req, res) => {
  const userId = req.session.userId;
  const sql = 'SELECT id, username, email, role, firstname, lastname FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send('Lỗi máy chủ');
    if (results.length === 0) return res.status(404).send('Không tìm thấy người dùng');
    res.json(results[0]);
  });
});

// Cập nhật thông tin họ, tên, email
router.put('/update', authMiddleware, (req, res) => {
  const userId = req.session.userId;
  const { username, email } = req.body;

  const sql = `UPDATE users SET
    username = COALESCE(?, username),
    email = COALESCE(?, email)
    WHERE id = ?`;

  db.query(sql, [username, email, userId], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Email đã tồn tại');
      }
      return res.status(500).send('Lỗi cập nhật thông tin');
    }
    res.send('Cập nhật thành công');
  });
});

// Đổi mật khẩu
router.put('/password', authMiddleware, (req, res) => {
  const userId = req.session.userId;
  const { oldPassword, newPassword } = req.body;

  const sql = 'SELECT password FROM users WHERE id = ?';
  db.query(sql, [userId], async (err, results) => {
    if (err) return res.status(500).send('Lỗi máy chủ');
    if (results.length === 0) return res.status(404).send('Không tìm thấy người dùng');

    const match = await bcrypt.compare(oldPassword, results[0].password);
    if (!match) return res.status(400).send('Mật khẩu cũ không đúng');

    const hashed = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId], (err) => {
      if (err) return res.status(500).send('Lỗi đổi mật khẩu');
      res.send('Đổi mật khẩu thành công');
    });
  });
});

module.exports = router;
