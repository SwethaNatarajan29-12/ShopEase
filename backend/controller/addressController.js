import Address from "../models/Address.js";

export const getAllAddress = async (req, res) => {
    try {
        const identityId = req.user?.identityId;
        if (!identityId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        // Only return addresses for the logged-in user
        const addresses = await Address.find({ identityId });
        res.status(200).json({ addresses: Array.isArray(addresses) ? addresses : [] });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "Failed to fetch addresses" });
    }
}


export const addAddress = async (req, res) => {
    try {
        // Get identityId from cookie or req.user
        let identityId = req.user?.identityId;
        if (!identityId && req.cookies && req.cookies.identityId) {
            identityId = req.cookies.identityId;
        }
        if (!identityId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        req.body.identityId = identityId;
        // Optionally, set user field if your Address model requires it
        if (req.user?._id) {
            req.body.user = req.user._id;
        }
        const address = new Address({ ...req.body });
        await address.save();
        res.status(201).json({ address });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ error: "Failed to add address" });
    }
}


export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const identityId = req.user?.identityId || req.cookies?.identityId;
        if (!identityId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        // Only update the address that matches both _id and identityId
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, identityId },
            { ...req.body },
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.json(updatedAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Failed to update address" });
    }

}

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const deletedAddress = await Address.findOneAndDelete({
            _id: addressId,
            user: req.params.userId
        });

        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ error: "Failed to delete address" });
    }
}