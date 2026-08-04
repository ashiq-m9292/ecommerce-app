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
    latestViewedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

recentlyViewedSchema.index(
    { latestViewedAt: 1 },
    { expireAfterSeconds: 60 * 60 } //  1 hour
)

const RecentlyViewed = mongoose.model("RecentlyViewed", recentlyViewedSchema);

export default RecentlyViewed;