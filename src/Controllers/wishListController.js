import WishList from "../Models/wishListModal.js";

// add to wishList
export const addToWishList = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(200).json({ success: true, message: 'Please provide productId' });
        }
        const existingWishList = await WishList.findOne({ productId, user: req.user._id });
        if (existingWishList) {
            const updatedWishList = await WishList.find({ user: req.user._id }).populate('productId');
            return res.status(200).json({ success: true, message: 'Product already in wishList', wishList: updatedWishList });
        }
        const wishList = new WishList({
            user: req.user._id,
            productId
        })
        await wishList.save();
        const updatedWishList = await WishList.find({ user: req.user._id }).populate('productId');
        return res.status(201).json({ success: true, message: 'add to wishList successfully', wishList: updatedWishList });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in adding to wishList', error: error.message });
    }
};

// get all wishlists
export const getAllWishLists = async (req, res) => {
    try {
        const wishLists = await WishList.find({ user: req.user._id }).populate('productId');
        if (wishLists.length === 0) {
            return res.status(200).json({ success: true, message: 'wishList is empty' });
        }
        // remove delete product
        const validWishLists = wishLists.filter(item => item.productId !== null);
        if (validWishLists.length === 0) {
            return res.status(200).json({ success: true, message: 'wishList is empty' });
        }
        return res.status(200).json({ success: true, message: 'WishLists found successfully', wishLists: validWishLists });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting wishLists', error: error.message });
    }
};

// delete wishList
export const deleteWishList = async (req, res) => {
    try {
        const wishList = await WishList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!wishList) {
            return res.status(200).json({ success: true, message: 'Item already removed' });
        }
        const updatedWishList = await WishList.find({ user: req.user._id }).populate('productId');
        return res.status(200).json({ success: true, message: 'WishList deleted successfully', wishList: updatedWishList });
        res.status(200).json({ success: true, message: 'WishList deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting wishList', error: error.message });
    }
};