import express from 'express';
const addressRouter = express.Router();
import { createAddress, getAllUserAddresses, updateAddress, deleteAddress, setDefaultAddress } from '../Controllers/addressController.js';
import { isAuth } from '../MiddleWare/authMiddleware.js';

addressRouter.post('/createaddress', isAuth, createAddress);
addressRouter.get('/alladdresses', isAuth, getAllUserAddresses);
addressRouter.put('/updateaddress/:id', isAuth, updateAddress);
addressRouter.delete('/deleteaddress/:id', isAuth, deleteAddress);
addressRouter.put('/setdefault/:id', isAuth, setDefaultAddress);


export default addressRouter;