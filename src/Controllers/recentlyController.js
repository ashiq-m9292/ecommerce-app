import RecentlyViewed from "../Models/recentlyModal.js";


export const createViewed = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(200).json({ success: true, message: "Please provide productId" });
        };
        // check existing product and update viewed
        const alreadyExist = await RecentlyViewed.findOne({ productId, user: req.user._id });
        if (alreadyExist) {
            // await RecentlyViewed.findOneAndDelete({ _id: alreadyExist._id });
            alreadyExist.updatedAt = Date.now();
            await alreadyExist.save();
            const updatedViewed = await RecentlyViewed.find({ user: req.user._id }).populate('productId');
            return res.status(200).json({ success: true, message: "viewed successfully", viewed: updatedViewed });
        }
        const viewed = new RecentlyViewed({
            user: req.user._id,
            productId,
            createdAt: Date.now()
        });
        await viewed.save();
        // save only 10 products and others will be deleted
        const existingViewed = await RecentlyViewed.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
        if (existingViewed.length > 10) {
            await RecentlyViewed.findOneAndDelete({ _id: existingViewed[0]._id });
        };
        const updatedViewed = await RecentlyViewed.find({ user: req.user._id }).populate('productId');
        return res.status(201).json({ success: true, message: "viewed successfully", viewed: updatedViewed });

    } catch (error) {
        return res.status(500).json({ success: false, message: "error in creating viewed", error: error.message });
    }
};

// get all viewed products
export const getAllViewed = async (req, res) => {
    try {
        const viewed = await RecentlyViewed.find({ user: req.user._id }).populate('productId').sort({ updatedAt: -1 }).limit(10);
        if (viewed.length === 0) {
            return res.status(200).json({ success: true, message: "viewed is empty" });
        }
        return res.status(200).json({ success: true, message: "viewed successfully", length: viewed.length, viewed: viewed });
    } catch (error) {
        return res.status(500).json({ success: false, message: "error in getting viewed", error: error.message });
    }
};


// delete all viewed products
export const deleteAllViewed = async (req, res) => {
    try {
        await RecentlyViewed.deleteMany({ user: req.user._id });
        return res.status(200).json({ success: true, message: "viewed deleted successfully", length: 0, viewed: [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "error in deleting viewed", error: error.message });
    }
};