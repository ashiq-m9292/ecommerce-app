import Review from '../Models/reviewModal.js';

// create review
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!rating || !comment) {
            return res.status(400).json({ message: 'Please provide rating and comment' });
        }
        const newReview = new Review({
            user: req.user._id,
            productId,
            rating,
            comment
        });
        await newReview.save();
        res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'error in creating review', error: error.message });
    }
}


// get all single product review
export const singleProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: 'error in getting reviews', error: error.message });
    }
};

// delete review
export const deleteSingleReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting review', error: error.message });
    }
};

// delete all single product reviews
export const deleteAllReviews = async (req, res) => {
    try {
        await Review.deleteMany({ productId: req.params.id });
        res.status(200).json({ message: 'All reviews deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting all reviews', error: error.message });
    }
};

// update review
export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { rating, comment, readableDate: new Date().toLocaleDateString(), readableTime: new Date().toLocaleTimeString() },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'error in updating review', error: error.message });
    }
};