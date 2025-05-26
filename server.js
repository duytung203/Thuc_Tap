const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));  
app.use(session({
  secret: 'duytung250603@password',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000
  }
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes(db));
app.use('/api/user', userRoutes(db));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
