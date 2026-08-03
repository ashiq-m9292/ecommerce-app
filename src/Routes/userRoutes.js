import express from 'express';
const userRouter = express.Router();
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers,
    deleteUser,
    getProfile,
    profilePicture,
    darkModeToggle,
    getDarkMode,
    changePassword
} from '../Controllers/userController.js';
import { isAuth, isAdmin } from '../MiddleWare/authMiddleware.js';
import { uploadFile } from '../MiddleWare/upload.js';


userRouter.post('/createuser', createUser);    // create user
userRouter.post('/loginuser', loginUser);      // login use
userRouter.post('/logoutuser', isAuth, logoutUser);    // logout user
userRouter.get('/allusers', isAuth, isAdmin, getAllUsers);  // get all users
userRouter.delete('/deleteuser/:id', isAuth, isAdmin, deleteUser);  // delete user
userRouter.get('/profile', isAuth, getProfile);  // get profile
userRouter.put('/picture', isAuth, uploadFile.single('image'), profilePicture);  // update profile picture
userRouter.put('/darkmode', isAuth, darkModeToggle);  // toggle dark mode
userRouter.get('/getdarkmode', isAuth, getDarkMode);  // get dark mode preference
userRouter.put('/changepassword', isAuth, changePassword);  // change password


export default userRouter;