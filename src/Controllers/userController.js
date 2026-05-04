import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from '../utility/uploadCloudinary.js';



// create user
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // create new user
        const newUser = new User({
            name,
            email,
            password
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'error in creating user', error: error.message });
    }
};

// login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //    password compare function
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // ṭoken generation
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // send response save cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({ message: 'User login in successfully', name: user.name, email: user.email, token: token });

    } catch (error) {
        res.status(500).json({ message: 'error in login user', error: error.message });
    }
};

// logout user
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token').json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in logout user', error: error.message });
    }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'error in getting all users', error: error.message });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting user', error: error.message });
    }
};

// create or update profile picture
export const profilePic = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {

            return res.status(404).json({ message: 'User not found' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please provide a file' });
        };

        // delete existing profile picture from cloudinary if exists
        if (user.profilePicture && user.profilePicture.public_id) {
            await cloudinary.uploader.destroy(user.profilePicture.public_id);
        }

        // upload profile picture to cloudinary
        const result = await uploadToCloudinary(req.file.buffer, 'profile-picture');

        // Update user's profile picture URL
        user.profilePicture = {
            public_id: result.public_id,
            url: result.secure_url
        };
        await user.save();
        res.status(200).json({ message: 'Profile picture created successfully', profilePicture: user.profilePicture });

    } catch (error) {
        res.status(500).json({ message: 'error in profilePic user', error: error.message });

    }
}

// get profile 
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'error in getting profile', error: error.message });
    }
}
