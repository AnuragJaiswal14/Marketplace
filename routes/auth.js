const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// User login
router.post('/login',  authenticateToken, (req, res) => {

  res.json({ message: 'Login successful.' });
});

// User logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful.' });
});

module.exports = router;
