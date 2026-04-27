import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
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

const Review = mongoose.model("Review", reviewSchema);

export default Review;
