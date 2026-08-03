import Product from '../Models/productModal.js';
import { uploadToCloudinary } from '../utility/uploadCloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import { sendNotificationToMultipleUsers } from '../utility/notification.js';

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, brand, category, sizes } = req.body;
        if (!name || !description || !brand || !category || !sizes) {
            return res.status(404).json({ success: false, message: 'Please provide all required fields' });
        }
        const parsedSizes = JSON.parse(sizes);
        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
            return res.status(400).json({ success: false, message: 'Sizes must be a non-empty array' });
        };

        const images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'products');

                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
        }
        const newProduct = new Product({
            name,
            description,
            brand,
            category,
            images,
            sizes: parsedSizes,
            user: req.user._id
        });
        await newProduct.save();

        // send notification to all users
        const users = await User.find({
            _id: { $ne: req.user._id },
            fcmToken: { $exists: true, $ne: null }
        }, "fcmToken");
        const tokens = users.map(user => user.fcmToken);
        const message = {
            tokens: tokens,
            data: {
                title: 'New Product Added',
                body: `A new product has been added: ${newProduct.name}`,
                screen: 'ProductDetails',
                productId: newProduct._id.toString()
            }
        };
        await sendNotificationToMultipleUsers(message);
        return res.status(201).json({ success: true, message: 'Product created successfully', products: newProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating product', error: error.message });
    }
};

// update product 
export const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            brand,
            category,
            sizes,
            readableDate,
            readableTime
        } = req.body;

        const product = await Product.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // update fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (brand) product.brand = brand;
        if (category) product.category = category;
        if (sizes) product.sizes = JSON.parse(sizes);
        if (readableDate) product.readableDate = readableDate;
        if (readableTime) product.readableTime = readableTime;

        // update images only if new files uploaded
        if (req.files && req.files.length > 0) {

            // delete old images
            for (const image of product.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }

            product.images = [];

            // upload new images
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'products');

                product.images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
        }

        await product.save();
        // send notification to all users
        const users = await User.find({
            _id: { $ne: req.user._id },
            fcmToken: { $exists: true, $ne: null }
        }, "fcmToken");
        const tokens = users.map(user => user.fcmToken);
        const message = {
            tokens: tokens,
            data: {
                title: 'Product Updated',
                body: `A product has been updated: ${product.name}`,
                screen: 'ProductDetails',
                productId: product._id.toString()
            }
        };
        await sendNotificationToMultipleUsers(message);

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            products: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in updating product',
            error: error.message
        });
    }
};

// get single product
export const getsingleProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        return res.status(200).json({ success: true, message: 'Product found successfully', products: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting product', error: error.message });
    }
};

// get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return res.status(200).json({ success: true, message: 'No products found' });
        }
        return res.status(200).json({ success: true, message: 'Products found successfully', productlength: products.length, products: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting products', error: error.message });
    }
};

// delete product 
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return res.status(200).json({ success: true, message: 'Already deleted product' });
        }
        // destroy existing images from cloudinary
        if (product.images && product.images.length > 0) {
            product.images.forEach(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            })
        }
        const updatedProducts = await Product.find({ user: req.user._id });
        return res.status(200).json({ success: true, message: 'Product deleted successfully', products: updatedProducts });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting product', error: error.message });
    }
};


// search and filter api
export const searchProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice } = req.query;
        const filter = {};
        if (keyword) {
            filter.name = {
                $regex: keyword,
                $options: 'i'
            };
        };
        if (category) {
            filter.category = category;
        };

        if (minPrice || maxPrice) {
            const priceFilter = {};

            if (minPrice) priceFilter.$gte = Number(minPrice);
            if (maxPrice) priceFilter.$lte = Number(maxPrice);

            filter.sizes = {
                $elemMatch: {
                    price: priceFilter
                }
            };
        } const products = await Product.find(filter);
        if (products.length === 0) {
            return res.status(200).json({ success: true, message: 'No products found' });
        }
        return res.status(200).json({ success: true, message: 'Products found successfully', productlength: products.length, products: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting products', error: error.message });
    }
};

