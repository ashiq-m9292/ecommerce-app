import mongoose from "mongoose";


const bannerSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;