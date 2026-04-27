import Order from "../Models/orderModal.js";


export const createOrder = async (req, res) => {
    try {
        const { address, products, totalAmount } = req.body;
        if (!address || !products || !totalAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newOrder = new Order({
            user: req.user._id,
            address,
            products,
            totalAmount
        });
        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'error in creating order', error: error.message });
    }
};

// get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'error in getting orders', error: error.message });
    }
};

// update order
export const updateOrder = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: { orderStatus } }, { returnDocument: 'after' });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'error in updating order', error: error.message });
    }
};

// isRated update order
export const isRatedTrue = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: { isRated: true } }, { returnDocument: 'after' });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'error in updating order', error: error.message });
    }
};