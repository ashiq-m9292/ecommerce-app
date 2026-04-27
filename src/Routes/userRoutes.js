import express from 'express';
const userRouter = express.Router();
import { createUser, loginUser, logoutUser, getAllUsers, deleteUser, profilePic } from '../Controllers/userController.js';
import { isAuth, isAdmin } from '../MiddleWare/authMiddleware.js';
import { uploadFile } from '../MiddleWare/upload.js';


userRouter.post('/createuser', createUser);
userRouter.post('/loginuser', loginUser);
userRouter.post('/logoutuser', isAuth, logoutUser);
userRouter.get('/allusers', isAuth, isAdmin, getAllUsers);
userRouter.delete('/deleteuser/:id', isAuth, isAdmin, deleteUser);
userRouter.post('/profilepic', isAuth, uploadFile.single('image'), profilePic);

export default userRouter;