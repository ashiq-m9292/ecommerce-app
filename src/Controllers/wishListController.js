import WishList from "../Models/wishListModal.js";

// add to wishList
export const addToWishList = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Please provide product id' });
        }
        const wishList = new WishList({
            user: req.user._id,
            productId
        })
        await wishList.save();
        res.status(201).json({ message: 'add to wishList successfully', wishList });
    } catch (error) {
        res.status(500).json({ message: 'error in adding to wishList', error: error.message });
    }
};

// get all wishlists
export const getAllWishLists = async (req, res) => {
    try {
        const wishLists = await WishList.find({ user: req.user._id }).populate('productId');
        if (!wishLists || wishLists.length === 0) {
            return res.status(404).json({ message: 'No wishLists found' });
        }
        res.status(200).json({ wishLists });
    } catch (error) {
        res.status(500).json({ message: 'error in getting wishLists', error: error.message });
    }
};

// delete wishList
export const deleteWishList = async (req, res) => {
    try {
        const wishList = await WishList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!wishList) {
            return res.status(404).json({ message: 'WishList not found' });
        }
        res.status(200).json({ message: 'WishList deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting wishList', error: error.message });
    }
};