import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from '../utility/uploadCloudinary.js';
import { sendNotification } from '../utility/notification.js';


// create user
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(200).json({ success: true, message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ success: true, message: 'User already exists' });
        }

        // create new user
        const newUser = new User({
            name,
            email,
            password
        });
        await newUser.save();
        return res.status(201).json({ success: true, message: 'User created successfully', user: newUser });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating user', error: error.message });
    }
};

// login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password, fcmToken, deviceId } = req.body;
        if (!email || !password) {
            return res.status(200).json({ success: true, message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: true, message: 'Invalid email or password' });
        }

        //    password compare function
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // update fcmToken and deviceId
        user.fcmToken = fcmToken;
        user.deviceId = deviceId;
        await user.save();

        // ṭoken generation
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // send response save cookie
        return res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
        }).json({ success: true, message: 'User login in successfully', name: user.name, email: user.email, token: token, fcmToken: user.fcmToken, deviceId: user.deviceId });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in login user', error: error.message });
    }
};

// logout user
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: 'User logout successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in logout user', error: error.message });
    }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ success: true, message: 'Users found successfully', users });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting all users', error: error.message });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting user', error: error.message });
    }
};

// get profile 
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'Profile found successfully', user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting profile', error: error.message });
    }
};

//creating profile picture 
export const profilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        const image = req.file;
        if (!image) {
            return res.status(404).json({ success: false, message: 'please provide image' })
        };
        if (user.picture.public_id) {
            await cloudinary.uploader.destroy(user.picture.public_id)
        }
        const result = await uploadToCloudinary(image.buffer, 'picture');
        user.picture = {
            public_id: result.public_id,
            url: result.secure_url
        };
        await user?.save();
        return res.status(200).json({ success: true, message: 'profile updated successfully', user })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in creating image',
            error: error.message
        });
    }
};

// dark mode toggle api
export const darkModeToggle = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        user.isDark = !user.isDark;
        await user?.save();
        return res.status(200).json({ success: true, message: 'dark mode updated successfully', darkmode: user.isDark })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in dark mode toggle',
            error: error.message
        });
    }
};

// get dark mode api
export const getDarkMode = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        return res.status(200).json({ success: true, message: 'dark mode found successfully', darkmode: user.isDark })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in getting dark mode',
            error: error.message
        });
    }
};

// change password
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide old password and new password' })
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'old password is incorrect' })
        };
        user.password = newPassword;
        await user.save();
        // send notification to user about password change
        const message = {
            token: user.fcmToken,
            data: {
                title: 'Password Changed',
                body: 'Your password has been changed successfully',
            }
        }
        await sendNotification(message);
        return res.status(200).json({ success: true, message: 'password updated successfully' })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in changing password',
            error: error.message
        });
    }
};

// test notification
export const testNotification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        if (user.fcmToken) {
            const message = {
                token: user.fcmToken,
                data: {
                    title: 'Test Notification',
                    body: 'This is a test notification',
                }
            }
            await sendNotification(message);
            return res.status(200).json({ success: true, message: 'notification sent successfully' })
        } else {
            return res.status(400).json({ success: false, message: 'fcm token not found' })
        }
    } catch (error) {
        res.json({ success: false, message: 'error in sending notification', error: error.message });
    }
}


