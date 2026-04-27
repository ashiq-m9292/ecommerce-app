import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: ""
    },
    images: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ],
    category: {
        type: String,
        required: true
    },
    sizes: [
        {
            size: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                default: 0
            },
            stock: {
                type: Number,
                default: 1
            },
            sold: {
                type: Number,
                default: 0
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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

const Product = mongoose.model("Product", productSchema);

export default Product;