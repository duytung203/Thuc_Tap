const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = 'secret_key';

module.exports = (db) => {
  // Đăng ký tài khoản (chỉ tạo user)
  router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin', success: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sqlCheck = 'SELECT * FROM users WHERE email = ?';
  db.query(sqlCheck, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi máy chủ', success: false, error: err });
    if (result.length > 0) return res.status(409).json({ message: 'Email đã tồn tại', success: false });

    const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "user")';
    db.query(sql, [username, email, hashedPassword], (err2) => {
      if (err2) return res.status(500).json({ message: 'Lỗi đăng ký', success: false, error: err2 });
      res.status(200).json({ message: 'Đăng ký thành công', success: true });
    });
  });
});

  // Đăng nhập tài khoản
  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi máy chủ', error: err });
      if (results.length === 0) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Đăng nhập thành công',
        token,
        role: user.role,
        username: user.username
      });
    });
  });

  return router;
};
