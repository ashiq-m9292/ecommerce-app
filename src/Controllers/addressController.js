import Address from "../Models/addressModal.js";

// create address
export const createAddress = async (req, res) => {
    try {
        const { street, village, city, state, pincode, phoneNumber, isDefault } = req.body;
        if (!street || !village || !city || !state || !pincode || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newAddress = new Address({
            user: req.user._id,
            street,
            village,
            city,
            state,
            pincode,
            phoneNumber,
            isDefault,
        });
        await newAddress.save();
        res.status(201).json({ message: 'Address created successfully', address: newAddress });
    } catch (error) {
        res.status(500).json({ message: 'error in creating address', error: error.message });
    }
};

// get all addresses of user 
export const getAllUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ message: 'error in getting user addresses', error: error.message });
    }
};

// update address
export const updateAddress = async (req, res) => {
    try {
        const { street, village, city, state, pincode, phoneNumber } = req.body;
        const address = await Address.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { street, village, city, state, pincode, phoneNumber },
            { new: true }
        );
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address updated successfully', address });

    } catch (error) {
        res.status(500).json({ message: 'error in updating address', error: error.message });
    }
};

// delete address
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error in deleting address', error: error.message });
    }
};

// set default address
export const setDefaultAddress = async (req, res) => {
    try {

        await Address.updateMany({ user: req.user._id }, { isDefault: false });

        const address = await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isDefault: true }, { new: true });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Default address set successfully', address });
    } catch (error) {
        res.status(500).json({ message: 'error in setting default address', error: error.message });
    }
};