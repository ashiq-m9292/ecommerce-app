import Banner from "../Models/BannerModal.js";
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from "../utility/uploadCloudinary.js";

// create banner
export const createBanner = async (req, res) => {
    try {
        const { type } = req.body;
        if (!type) {
            return res.status(404).json({ success: false, message: 'Please provide all required fields' });
        }
        if (!req.file) {
            return res.status(404).json({ success: false, message: 'Please provide an image' });
        }
        const result = await uploadToCloudinary(req.file.buffer, 'banner-images');
        const newBanner = new Banner({
            type,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });
        await newBanner.save();
        return res.status(201).json({ success: true, message: 'Banner created successfully', banner: newBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: 'error in creating banner', error: error.message });
        return;
    }
}

// get all banner
export const getAllBanner = async (req, res) => {
    try {
        const banner = await Banner.find({});
        return res.status(200).json({ success: true, message: 'Banner fetched successfully', items: banner.length, banner: banner });
    } catch (error) {
        res.status(500).json({ success: false, message: 'error in fetching banner', error: error.message });
        return;
    }
};

// delete banner
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        // image destroy from cloudinary
        if (banner.image && banner.image.public_id) {
            await cloudinary.uploader.destroy(banner.image.public_id);
        }
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        const updatedBanner = await Banner.find({});
        return res.status(200).json({ success: true, message: 'Banner deleted successfully', banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: 'error in deleting banner', error: error.message });
        return;
    }
};

// update banner
export const updateBanner = async (req, res) => {
    try {
        const { type } = req.body;
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        };
        if (type) banner.type = type;
        if (req.file) {
            // image destroy from cloudinary
            if (banner.image && banner.image.public_id) {
                await cloudinary.uploader.destroy(banner.image.public_id);
            }
            const result = await uploadToCloudinary(req.file.buffer, 'banner-images');
            banner.image = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }
        await banner.save();
        const updatedBanner = await Banner.find({});
        return res.status(200).json({ success: true, message: 'Banner updated successfully', banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: 'error in updating banner', error: error.message });
        return;
    }
}