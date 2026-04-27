import mongoose from "mongoose";

const connectDB = async (url) => {
    try {
        const dbOptions = {
            dbName: process.env.DB_NAME,
        };
        await mongoose.connect(url, dbOptions).then(() => {
            console.log('connected to database');
        }).catch((error) => {
            console.log('error in connecting to database', error);
        });
    } catch (error) {
        console.log('error in connecting to database', error);
    }
};

export default connectDB;