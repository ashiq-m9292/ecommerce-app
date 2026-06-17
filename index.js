// dotenv configuration
import dotenv from 'dotenv';
dotenv.config();

// express
import express from 'express';
const app = express();

// cors
import cors from 'cors';
app.use(cors());

// express json configuration 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// port
const PORT = process.env.PORT || 3000;

// database connection
import connectDb from './src/Database/database.js';
connectDb(process.env.DB_URL);

// cookie parser
import cookieParser from 'cookie-parser';
app.use(cookieParser());


// routes
import userRouter from './src/Routes/userRoutes.js';
import addressRouter from './src/Routes/addressRoutes.js';
import productRouter from './src/Routes/productRoutes.js';
import reviewRouter from './src/Routes/reviewRoutes.js';
import cartRouter from './src/Routes/cartRoutes.js';
import wishListRouter from './src/Routes/wishListRoutes.js';
import orderRouter from './src/Routes/orderRoutes.js';
import bannerRouter from './src/Routes/BannerRoutes.js';
import recentlyRouter from './src/Routes/recentlyRoutes.js';
app.use('/api/v1/user', userRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishListRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/banner', bannerRouter);
app.use('/api/v1/recently', recentlyRouter);

// cloudinary config 
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});