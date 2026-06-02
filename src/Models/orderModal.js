import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        village: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    itemTotal: {
        type: String,
        required: true
    },
    deliveryCharges: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    },
    isRated: {
        type: Boolean,
        default: false
    },
    readableDate: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    readableTime: {
        type: String,
        default: new Date().toLocaleTimeString()
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;