const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const Cart = require('../models/Cart');

// Get all items
router.get('/', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Add item to cart
router.post('/add-to-cart', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const { itemId, quantity } = req.body;

  const user = await User.findById(req.session.userId);
  const existing = user.cart.find(c => c.itemId.toString() === itemId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ itemId, quantity });
  }

  await user.save();
  res.json({ message: 'Added to cart' });
});

router.post('/remove-from-cart', async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const item = user.cart.find(item => item.itemId.toString() === itemId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = Math.max(0, item.quantity - qty);

    // If quantity reaches 0, remove from cart
    if (item.quantity === 0) {
      user.cart = user.cart.filter(item => item.itemId.toString() !== itemId);
    }

    await user.save();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove from cart failed', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cart items
router.get('/cart', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const user = await User.findById(req.session.userId).populate('cart.itemId');
  res.json(user.cart);
});

// Compare store prices
router.get('/compare', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const user = await User.findById(req.session.userId).populate('cart.itemId');

  const totals = {};
  user.cart.forEach(({ itemId, quantity }) => {
    Object.entries(itemId.storePrices).forEach(([store, price]) => {
      totals[store] = (totals[store] || 0) + price * quantity;
    });
  });

  res.json(totals);
});

module.exports = router;
