import Cart from "../models/Cart.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ statusCode: 400, message: "Invalid userId" });
        }
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.json({ user: userId, items: [] });
        }

        const items = cart.items.map(item => {
            const productObj = item.product && typeof item.product === 'object' ? item.product : null;
            return {
                ...item.toObject(),
                id: productObj?._id?.toString() || item.product?.toString() || item._id?.toString() || undefined,
                product: productObj?._id?.toString() || item.product?.toString() || undefined,
                name: item.name || productObj?.name || '',
                category: item.category || productObj?.category || '',
                price: item.price ?? productObj?.price ?? 0,
                image: item.image || productObj?.image || '',
                description: item.description || productObj?.description || ""
            };
        })
        console.log('Cart items for user', userId, items); // Debug log
        res.json({ user: cart.user, items: items || [] });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

export const addOrUpdateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ statusCode: 400, message: "Invalid userId" });
        }
        if (!mongoose.Types.ObjectId.isValid(productId) || typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ statusCode: 400, message: "Invalid productId or quantity" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ statusCode: 404, message: "Product not found" });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, items: [] });
        const idx = cart.items.findIndex(i => {
            if (!i.product) return false;
            if (typeof i.product === 'object' && i.product._id) {
                return i.product._id.toString() === productId;
            }
            return i.product.toString() === productId;
        });
        if (idx > -1) {
            cart.items[idx].quantity = quantity;
            cart.items[idx].name = product.name;
            cart.items[idx].category = product.category;
            cart.items[idx].price = product.price;
            cart.items[idx].image = product.image;
            cart.items[idx].description = product.description || "";
        } else {
            cart.items.push({
                product: productId,
                quantity,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
                description: product.description || ""
            });
        }
        await cart.save();
        await cart.populate("items.product");
        // Always populate items.product and flatten product info
        const items = cart.items.map(item => {
            const productObj = item.product && typeof item.product === 'object' ? item.product : null;
            return {
                ...item.toObject(),
                id: productObj?._id?.toString() || item.product?.toString() || item._id?.toString() || undefined,
                product: productObj?._id?.toString() || item.product?.toString() || undefined,
                name: item.name || productObj?.name || '',
                category: item.category || productObj?.category || '',
                price: item.price ?? productObj?.price ?? 0,
                image: item.image || productObj?.image || '',
                description: item.description || productObj?.description || ""
            };
        });
        console.log('Cart items after add/update for user', cart.user, items); // Debug log
        res.json({ user: cart.user, items });
    } catch (error) {
        console.error("Error in addOrUpdateCartItem:");
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

export const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId });
        if (cart) {
            // Remove the item from the array
            cart.items = cart.items.filter(i => {
                if (!i.product) return false;
                if (typeof i.product === 'object' && i.product._id) {
                    return i.product._id.toString() !== req.params.productId;
                }
                return i.product.toString() !== req.params.productId;
            });
            await cart.save();
            await cart.populate("items.product");
            const items = cart.items.map(item => {
                const productObj = item.product && typeof item.product === 'object' ? item.product : null;
                return {
                    ...item.toObject(),
                    id: productObj?._id?.toString() || item.product?.toString() || item._id?.toString() || undefined,
                    product: productObj?._id?.toString() || item.product?.toString() || undefined,
                    name: item.name || productObj?.name || '',
                    category: item.category || productObj?.category || '',
                    price: item.price ?? productObj?.price ?? 0,
                    image: item.image || productObj?.image || '',
                    description: item.description || productObj?.description || ""
                };
            });
            console.log('Cart items after remove for user', cart.user, items); // Debug log
            return res.json({ user: cart.user, items });
        }
        res.json({ user: req.params.userId, items: [] });
    } catch (error) {
        console.error("Error in removeCartItem:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

export const clearCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOneAndDelete({ user: userId });

        res.json({ user: userId, items: [] });
    } catch (error) {
        console.error("Error in clearCart:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}
