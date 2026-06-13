import express from 'express';
const productRouter = express.Router();
import { createProduct, getsingleProduct, getAllProducts, deleteProduct, updateProduct, searchProducts } from '../Controllers/productController.js';
import { isAuth, isAdmin } from '../MiddleWare/authMiddleware.js';
import { uploadFile } from '../MiddleWare/upload.js';

productRouter.post('/createproduct', isAuth, uploadFile.array('images', 5), createProduct);
productRouter.get('/getsingleproduct/:id', isAuth, getsingleProduct);
productRouter.get('/getallproducts', getAllProducts);
productRouter.delete('/deleteproduct/:id', isAuth, deleteProduct);
productRouter.put('/updateproduct/:id', isAuth, uploadFile.array('images', 5), updateProduct);
productRouter.get('/search/:query', searchProducts);


export default productRouter;