import mongoose from "mongoose";
import Cart from "../Models/cartModal.js";

// add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        if (!productId || !size) {
            return res.status(200).json({ success: true, message: 'Please provide productId and size' });
        }
        const existingCart = await Cart.findOne({ productId, user: req.user._id });
        if (existingCart) {
            const updatedCart = await Cart.find({ user: req.user._id }).populate('productId');
            return res.status(200).json({ success: true, message: 'Product already in cart', cart: updatedCart });
        }
        const cart = new Cart({
            user: req.user._id,
            productId,
            size
        })
        await cart.save();
        const updatedCart = await Cart.find({ user: req.user._id }).populate('productId');
        return res.status(201).json({ success: true, message: 'add to cart successfully', cart: updatedCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in adding to cart', error: error.message });
    }
};

// get cart 
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user._id }).populate('productId');
        if (cart.length === 0) {
            return res.status(200).json({ success: true, message: 'Cart is empty' });
        }
        // remove delete product 
        const validCart = cart.filter(item => item.productId !== null);
        if (validCart.length === 0) {
            return res.status(200).json({ success: true, message: 'cart is empty' });
        }
        return res.status(200).json({ success: true, message: 'Cart found successfully', cartlenght: cart.length, cart: validCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting cart', error: error.message });
    }
};

// delete cart 
export const deleteCart = async (req, res) => {
    try {
        const item = await Cart.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!item) {
            return res.status(200).json({ success: true, message: 'Item already removed' });
        }
        const updatedCart = await Cart.find({ user: req.user._id }).populate('productId');
        return res.status(200).json({ success: true, message: 'Cart deleted successfully', cart: updatedCart });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in deleting cart',
            error: error.message
        });
    }
};


// update quantity
export const updateQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(200).json({ success: true, message: 'Please provide quantity' });
        }
        const cart = await Cart.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: { quantity } }, { returnDocument: 'after' });
        if (!cart) {
            return res.status(200).json({ success: true, message: 'Cart not found' });
        }
        // updated cart quantity
        const updatedCart = await Cart.find({ user: req.user._id }).populate('productId');
        return res.status(200).json({success: true, message: 'Quantity updated successfully', cart: updatedCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in updating quantity', error: error.message });
    }
};