const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { name, phone, address, city, state } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { 
                name,
                phone,
                address,
                city,
                state
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                city: updatedUser.city,
                state: updatedUser.state
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Change password
router.put('/password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;


        // console.log(req.user)
        // Find user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});

// Get user's cart
router.get('/cart', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cart');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// Update user's cart
router.put('/cart', authenticate, async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cart },
      { new: true }
    ).select('cart');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// Clear user's cart
router.delete('/cart', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cart: [] },
      { new: true }
    ).select('cart');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

module.exports = router; 