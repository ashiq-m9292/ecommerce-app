import Order from "../Models/orderModal.js";
import Product from "../Models/productModal.js";
import Cart from "../Models/cartModal.js";
import { sendNotification } from "../utility/notification.js";


export const createOrder = async (req, res) => {
    try {
        const { address, products, totalAmount, itemTotal, deliveryCharges, orderStatus } = req.body;
        if (!address || !products) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        };

        // calculate total item price
        let totalItemPrice = 0;
        let totalItems = 0;
        let finalProducts = [];
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            //    find selectedsize
            const selectedSize = product.sizes.find(size => size.size === item.size);
            if (!selectedSize) {
                return res.status(404).json({ success: false, message: 'Selected size not found' });
            }
            if (selectedSize.stock < item.quantity) {
                return res.status(400).json({ success: false, message: 'Out of stock' });
            }
            const productTotal = selectedSize.price * item.quantity;
            totalItemPrice += productTotal;
            totalItems += item.quantity;
            finalProducts.push({ productId: item.productId, name: product.name, size: item.size, quantity: item.quantity, price: selectedSize.price, image: product.images[0] });
            selectedSize.quantity -= item.quantity;
            selectedSize.stock -= item.quantity;
            selectedSize.sold += item.quantity;
            await product.save();
        }
        // add delivery charges
        let deliveryCharge = 20;
        if (totalItemPrice >= 200) {
            deliveryCharge = 0;
        }

        // calculate total amount
        const totalPrice = totalItemPrice + deliveryCharge;


        const newOrder = new Order({
            user: req.user._id,
            address,
            products: finalProducts,
            itemTotal: totalItemPrice,
            deliveryCharges: deliveryCharge,
            totalAmount: totalPrice,
        });
        await newOrder.save();
        // delete cart items
        for (const item of products) {
            await Cart.findOneAndDelete({ productId: item.productId, user: req.user._id });
        };

        // send notification
        const message = {
            token: req.user.fcmToken,
            data: {
                title: 'Order Placed',
                body: 'Your order has been placed successfully',
                screen: OrderDetails,
                orderId: newOrder._id.toString(),
            }
        };
        await sendNotification(message);

        return res.status(201).json({ success: true, message: 'Order created successfully', orders: newOrder });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating order', error: error.message });
    }
};

// get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        if (orders.length === 0) {
            return res.status(200).json({ message: 'No orders' });
        }
        return res.status(200).json({ success: true, message: 'Orders found successfully', orderLength: orders.length, orders: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting orders', error: error.message });
    }
};

// update order
export const updateOrder = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate({ _id: req.params.id }, { $set: { orderStatus } }, { returnDocument: 'after' });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ success: true, message: 'Order updated successfully', orders: order });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in updating order', error: error.message });
    }
};

// isRated update order
export const isRatedTrue = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: { isRated: true } }, { returnDocument: 'after' });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.status(200).json({ success: true, message: 'Order updated successfully', orders: order });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in updating order', error: error.message });
    }
};

// delete order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting order', error: error.message });
    }
};