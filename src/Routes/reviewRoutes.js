import express from 'express';
const reviewRouter = express.Router();
import { createReview, singleProductReviews, deleteSingleReview, deleteAllReviews, updateReview } from '../Controllers/reviewController.js';
import { isAuth } from '../MiddleWare/authMiddleware.js';

reviewRouter.post('/createreview', isAuth, createReview);
reviewRouter.get('/getallsingleproductreviews/:id', singleProductReviews);
reviewRouter.delete('/deletereview/:id', isAuth, deleteSingleReview);
reviewRouter.delete('/deleteallreviews/:id', isAuth, deleteAllReviews);
reviewRouter.put('/updatereview/:id', isAuth, updateReview);



export default reviewRouter;