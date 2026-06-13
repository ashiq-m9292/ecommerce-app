import express from 'express';
const bannerRouter = express.Router();
import { createBanner, getAllBanner, deleteBanner, updateBanner } from '../Controllers/BannerController.js';
import { uploadFile } from '../MiddleWare/upload.js';


bannerRouter.post('/createbanner', uploadFile.single('image'), createBanner);
bannerRouter.get('/getallbanner', getAllBanner);
bannerRouter.delete('/deletebanner/:id', deleteBanner);
bannerRouter.put('/updatebanner/:id', uploadFile.single('image'), updateBanner);





export default bannerRouter;