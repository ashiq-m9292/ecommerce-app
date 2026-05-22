import Address from "../Models/addressModal.js";

// create address
export const createAddress = async (req, res) => {
    try {
        const { street, village, city, state, pincode, phoneNumber, isDefault } = req.body;
        if (!street || !village || !city || !state || !pincode || !phoneNumber) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        };
        // check if address already exists
        const address = await Address.find({ user: req.user._id });
        const defaultAddress = address.length === 0 ? true : false;
        const newAddress = new Address({
            user: req.user._id,
            street,
            village,
            city,
            state,
            pincode,
            phoneNumber,
            isDefault: defaultAddress
        });
        await newAddress.save();
        const updatedAddress = await Address.find({ user: req.user._id });
        return res.status(201).json({ success: true, message: 'Address created successfully', address: updatedAddress });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating address', error: error.message });
    }
};

// get all addresses of user 
export const getAllUserAddresses = async (req, res) => {
    try {
        const address = await Address.find({ user: req.user._id });
        if (address.length === 0) {
            return res.status(200).json({ success: true, message: 'No addresses' })
        }
        return res.status(200).json({ success: true, message: 'addresses found successfully', count: address.length, address: address })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in getting user addresses', error: error.message });
    }
};

// update address
export const updateAddress = async (req, res) => {
    try {
        const { street, village, city, state, pincode, phoneNumber } = req.body;
        const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
        if (!address) {
            return res.status(200).json({ success: true, message: 'Address not found' });
        }
        if (street) address.street = street;
        if (village) address.village = village;
        if (city) address.city = city;
        if (state) address.state = state;
        if (pincode) address.pincode = pincode;
        if (phoneNumber) address.phoneNumber = phoneNumber;
        await address.save();
        const updatedAddress = await Address.find({ user: req.user._id });
        return res.status(200).json({ success: true, message: 'Address updated successfully', address: updatedAddress });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in updating address', error: error.message });
    }
};

// delete address
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        };
        if (address.isDefault === true) {
            const newDefaultAddress = await Address.findOneAndUpdate({ user: req.user._id }, { isDefault: true }, { returnDocument: 'after' });
        };
        const updatedAddress = await Address.find({ user: req.user._id });
        return res.status(200).json({ success: true, message: 'Address deleted successfully', address: updatedAddress });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in deleting address', error: error.message });
    }
};

// set default address
export const setDefaultAddress = async (req, res) => {
    try {

        await Address.updateMany({ user: req.user._id }, { isDefault: false });

        const address = await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isDefault: true }, { returnDocument: 'after' });
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        const updatedAddress = await Address.find({ user: req.user._id });
        return res.status(200).json({ success: true, message: 'Default address set successfully', address: updatedAddress });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in setting default address', error: error.message });
    }
};