const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const { authenticate } = require('../middleware/auth');
const product = require('../models/product');
const jwt = require('jsonwebtoken');

// Generate order ID
const generateOrderId = async () => {
    const latestOrder = await Order.findOne().sort({ id: -1 });
    let nextNumber = 1;
    if (latestOrder) {
        const lastNumber = parseInt(latestOrder.id.slice(-4));
        nextNumber = lastNumber + 1;
    }
    return `ORD${nextNumber.toString().padStart(4, '0')}`;
};

// Create new order (for both guests and authenticated users)
router.post('/create', async (req, res) => {
    try {
        const { cartItems, shippingInfo, total } = req.body;

        // Generate order ID
        const orderId = await generateOrderId();

        // Create order
        const order = new Order({
            id: orderId,
            total,
            shippingInfo
        });

        await order.save();

        // Create order details
        const orderDetails = cartItems.map(item => ({
            orderId: order._id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
        }));

        await OrderDetail.insertMany(orderDetails);

        // Update product quantities
        for (const item of cartItems) {
            await product.findOneAndUpdate(
                { id: item.id },
                { $inc: { quantity: -item.quantity } }
            );
        }

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order.id
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get orders by email or phone
router.get('/search', async (req, res) => {
    try {
        const { email, phone } = req.query;
        
        if (!email && !phone) {
            return res.status(400).json({ message: 'Please provide either email or phone number' });
        }

        const query = {};
        if (email) {
            query['shippingInfo.email'] = email;
        }
        if (phone) {
            query['shippingInfo.phone'] = phone;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get order details
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDetails = await OrderDetail.find({ orderId: order._id });
        res.json({ order, orderDetails });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

module.exports = router; 