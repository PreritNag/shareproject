const User = require('../models/models'); // Import User model
const { Router } = require('express');
const router = Router();

// GET: Login Page
router.get('/Login', (req, res) => {
  return res.json({ message: 'Login page' });
});

// GET: Signup Page
router.get('/Signup', (req, res) => {
  return res.json({ message: 'Signup page' });
});

// POST: Login
router.post('/Login', async (req, res) => {
  const { name, password } = req.body;

  // Validate input
  if (!name || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Match password and generate token
    const userToken = await User.matchPasswordandGenerateToken(name, password);

    return res
      .cookie('token', userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .json({ message: 'Login successful', token: userToken });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(401).json({ error: 'Incorrect username or password' });
  }
});

// GET: Logout
router.get('/Logout', (req, res) => {
  return res
    .clearCookie('token')
    .json({ message: 'Logout successful' });
});

// POST: Signup
router.post('/Signup', async (req, res) => {
  const { name, email, password, phoneNumber, balance, termsAccepted, privacyPolicy } = req.body;

  // Validate input
  if (!name || !email || !password || !phoneNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!termsAccepted || !privacyPolicy) {
    return res.status(400).json({ error: 'Terms and Privacy Policy must be accepted' });
  }

  try {
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      balance: balance || 1000, // Default balance if not provided
      termsAccepted,
      privacyPolicy,
    });

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    // Handle duplicate key error (email or phone already exists)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email or phone number' });
    }

    console.error('Signup error:', error.message);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
