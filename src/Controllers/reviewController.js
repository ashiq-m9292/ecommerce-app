import Review from '../Models/reviewModal.js';

// create review
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!rating && !comment) {
            return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
        }
        const newReview = new Review({
            user: req.user._id,
            productId,
            rating,
            comment
        });
        await newReview.save();
        const updatedReviews = await Review.find({ productId: newReview.productId });
        return res.status(201).json({ success: true, message: 'Review created successfully', reviews: updatedReviews });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating review', error: error.message });
    }
}


// get all single product review
export const singleProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        if (reviews.length === 0) {
            return res.status(200).json({ success: true, message: 'No reviews found' });
        }
        return res.status(200).json({ success: true, message: 'Reviews found successfully', reviewLength: reviews.length, reviews: reviews });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting reviews', error: error.message });
    }
};

// delete review
export const deleteSingleReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id });
        if (!review) {
            return res.status(200).json({ success: true, message: 'Already removed' });
        }
        const updatedReviews = await Review.find({ productId: review.productId });
        return res.status(200).json({ success: true, message: 'Review deleted successfully', reviews: updatedReviews });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting review', error: error.message });
    }
};

// delete all single product reviews
export const deleteAllReviews = async (req, res) => {
    try {
        const reviews = await Review.deleteMany({ productId: req.params.id });
        if (reviews.deletedCount === 0) {
            return res.status(200).json({ success: true, message: 'No reviews found' });
        }
        const updatedReviews = await Review.find({ productId: req.params.id });
        return res.status(200).json({ success: true, message: 'All reviews deleted successfully', reviews: updatedReviews });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting all reviews', error: error.message });
    }
};

// update review
export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        await review.save();
        const updatedReviews = await Review.find({ productId: review.productId });
        return res.status(200).json({ success: true, message: 'Review updated successfully', reviews: updatedReviews });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in updating review', error: error.message });
    }
};