import express from 'express';
const wishListRouter = express.Router();
import { addToWishList, getAllWishLists, deleteWishList } from '../Controllers/wishListController.js';
import { isAuth } from '../MiddleWare/authMiddleware.js';


wishListRouter.post('/createwishlist', isAuth, addToWishList);
wishListRouter.get('/getallwishlists', isAuth, getAllWishLists);
wishListRouter.delete('/deletewishlist/:id', isAuth, deleteWishList);

export default wishListRouter;