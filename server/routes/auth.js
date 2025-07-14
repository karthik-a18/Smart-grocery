// server/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }

    const otp = '12345'; // 🔐 Demo OTP

    // Store mobile and OTP in session
    req.session.mobile = mobile;
    req.session.otp = otp;

    // Find or create user
    let user = await User.findOne({ mobile });
    if (!user) {
      user = new User({ mobile, cart: [] });
      await user.save();
    }

    res.json({ message: `OTP sent (demo: use ${otp})` });
  } catch (err) {
    console.error('Send OTP server error:', err);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;

    if (otp !== '12345') {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const mobile = req.session.mobile;
    if (!mobile) {
      return res.status(400).json({ message: 'Session expired. Please resend OTP.' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.session.userId = user._id; // ✅ Set login
    res.json({ message: 'OTP verified successfully, logged in' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
});

// Optional: Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

router.get('/check-session', (req, res) => {
  if (req.session.userId) {
    return res.json({ loggedIn: true });
  } else {
    return res.json({ loggedIn: false });
  }
});

module.exports = router;
