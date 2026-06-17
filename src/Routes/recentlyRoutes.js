import express from 'express';
const recentlyRouter = express.Router();
import { createViewed, getAllViewed, deleteAllViewed } from '../Controllers/recentlyController.js';
import { isAuth } from '../MiddleWare/authMiddleware.js';


recentlyRouter.post('/createviewed', isAuth, createViewed);
recentlyRouter.get('/getallviewed', isAuth, getAllViewed);
recentlyRouter.delete('/deleteallviewed', isAuth, deleteAllViewed);

export default recentlyRouter;