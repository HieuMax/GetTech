const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/auth');

// GET /api/cart - Fetch the user's cart
// router.get('/', authenticate, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user.userId });
//     res.json(cart || { items: [] });
//   } catch (error) {
//     console.error('Error fetching cart:', error);
//     res.status(500).json({ message: 'Error fetching cart' });
//   }
// });

// // POST /api/cart/item/:id - Add an item to the cart
// router.post('/item/:id', authenticate, async (req, res) => {
//   const { id } = req.params;
//   const { name, price, image, quantity } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId: req.user.userId });

//     if (!cart) {
//       cart = new Cart({ userId: req.user.userId, items: [] });
//     }

//     const existingItem = cart.items.find((item) => item.productId === id);

//     if (existingItem) {
//       existingItem.quantity += quantity || 1;
//     } else {
//       cart.items.push({ productId: id, name, price, image, quantity: quantity || 1 });
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error adding item to cart:', error);
//     res.status(500).json({ message: 'Error adding item to cart' });
//   }
// });

// // PATCH /api/cart/item/:id - Update the quantity of an item in the cart
// router.patch('/item/:id', authenticate, async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   try {
//     const cart = await Cart.findOne({ userId: req.user.userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const item = cart.items.find((item) => item.productId === id);

//     if (!item) {
//       return res.status(404).json({ message: 'Item not found in cart' });
//     }

//     item.quantity = quantity;
//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error updating item quantity:', error);
//     res.status(500).json({ message: 'Error updating item quantity' });
//   }
// });

// // DELETE /api/cart/item/:id - Remove an item from the cart
// router.delete('/item/:id', authenticate, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId: req.user.userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     cart.items = cart.items.filter((item) => item.productId !== id);
//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error removing item from cart:', error);
//     res.status(500).json({ message: 'Error removing item from cart' });
//   }
// });

// // PUT /api/cart - Sync the cart with the database
// router.put('/', authenticate, async (req, res) => {
//   const { items } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId: req.user.userId });

//     if (!cart) {
//       cart = new Cart({ userId: req.user.userId, items });
//     } else {
//       cart.items = items;
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error syncing cart:', error);
//     res.status(500).json({ message: 'Error syncing cart' });
//   }
// });

// // DELETE /api/cart - Clear the entire cart
// router.delete('/', authenticate, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user.userId });

//     if (cart) {
//       cart.items = [];
//       await cart.save();
//     }

//     res.status(200).json({ message: 'Cart cleared' });
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     res.status(500).json({ message: 'Error clearing cart' });
//   }
// });

// // POST /api/cart/merge - Merge the guest cart with the user's cart
// router.post('/merge', authenticate, async (req, res) => {
//   const { items } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId: req.user.userId });

//     if (!cart) {
//       cart = new Cart({ userId: req.user.userId, items });
//     } else {
//       items.forEach((guestItem) => {
//         const existingItem = cart.items.find((item) => item.productId === guestItem.productId);

//         if (existingItem) {
//           existingItem.quantity += guestItem.quantity;
//         } else {
//           cart.items.push(guestItem);
//         }
//       });
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error merging carts:', error);
//     res.status(500).json({ message: 'Error merging carts' });
//   }
// });

module.exports = router;