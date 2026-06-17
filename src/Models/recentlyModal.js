import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const RecentlyViewed = mongoose.model("RecentlyViewed", recentlyViewedSchema);

export default RecentlyViewed;