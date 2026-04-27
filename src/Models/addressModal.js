import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    street: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    readableDate: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    readableTime: {
        type: String,
        default: new Date().toLocaleTimeString()
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;