const User = require('../models/models'); // Import User model
const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');

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
        maxAge: 60 * 60 * 1000 // Token expires in 1 hour
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

// POST: Signup with input validation
router.post('/Signup', [
  body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').isNumeric().withMessage('Phone number must be a valid number'),
], async (req, res) => {
  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phoneNumber, balance, termsAccepted, privacyPolicy } = req.body;

  // Validate terms and privacy policy acceptance
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
