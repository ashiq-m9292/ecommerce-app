import express from 'express';
const orderRouter = express.Router();
import { createOrder, getAllOrders, updateOrder, isRatedTrue } from '../Controllers/orderController.js';
import { isAuth } from '../MiddleWare/authMiddleware.js';

orderRouter.post('/createorder', isAuth, createOrder);
orderRouter.get('/getallorders', isAuth, getAllOrders);
orderRouter.put('/updateorder/:id', isAuth, updateOrder);
orderRouter.put('/isratedtrue/:id', isAuth, isRatedTrue);

export default orderRouter;