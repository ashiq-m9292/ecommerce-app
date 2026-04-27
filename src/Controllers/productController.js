import Product from '../Models/productModal.js';
import { uploadToCloudinary } from '../utility/uploadCloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, brand, category, sizes } = req.body;
        if (!name || !description || !brand || !category || !sizes) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const parsedSizes = JSON.parse(sizes);
        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
            return res.status(400).json({ message: 'Sizes must be a non-empty array' });
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
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'error in creating product', error: error.message });
    }
};

// update product 
export const updateProduct = async (req, res) => {
    try {
        const { name, description, brand, category, sizes, readableDate, readableTime } = req.body;
        let updatedData = {};
        if (name) updatedData.name = name;
        if (description) updatedData.description = description;
        if (brand) updatedData.brand = brand;
        if (category) updatedData.category = category;
        if (sizes) updatedData.sizes = JSON.parse(sizes);
        if (readableDate) updatedData.readableDate = readableDate;
        if (readableTime) updatedData.readableTime = readableTime;
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: updatedData },
            { returnDocument: 'after' }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // destroy existing images from cloudinary
        if (product.images && product.images.length > 0) {
            product.images.forEach(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            })
        }
        // upload new images 
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'products');
                product.images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
        }
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'error in updating product', error: error.message });
    }
};

// get single product
export const getsingleProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product found successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'error in getting product', error: error.message });
    }
};

// get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'error in getting products', error: error.message });
    }
};

// delete product 
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting product', error: error.message });
    }
};