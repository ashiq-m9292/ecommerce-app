import express from 'express';
const cartRouter = express.Router();
import { addToCart, getCart, deleteCart, updateQuantity } from '../Controllers/cartController.js';
import { isAuth } from '../MiddleWare/authMiddleware.js';

cartRouter.post('/createcart', isAuth, addToCart);
cartRouter.get('/getallcart', isAuth, getCart);
cartRouter.delete('/deletecart/:id', isAuth, deleteCart);
cartRouter.put('/updatequantity/:id', isAuth, updateQuantity);

export default cartRouter;