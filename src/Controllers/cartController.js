import Cart from "../Models/cartModal.js";

// add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Please provide product id' });
        }
        const newCart = new Cart({
            user: req.user._id,
            productId
        });
        await newCart.save();
        res.status(201).json({ message: 'add to cart successfully', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: 'error in adding to cart', error: error.message });
    }
};

// get cart 
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user._id }).populate('productId');
        if (!cart || cart.length === 0) {
            return res.status(404).json({ message: 'NO Cart Items' });
        }
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'error in getting cart', error: error.message });
    }
};

// delete cart 
export const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting cart', error: error.message });
    }
};

// update quantity
export const updateQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: { quantity } }, { returnDocument: 'after' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Quantity updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'error in updating quantity', error: error.message });
    }
};