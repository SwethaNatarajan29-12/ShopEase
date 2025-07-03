
import Product from "../models/Product.js";
let scope = "productController";


export const getAllProducts = async (req, res) => {
    let method = "getAllProducts";
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ statusCode: 500, scope, method, message: error?.message });
    }
}


export const createProduct = async (req, res) => {
    let method = "createProduct";
    try {
        const { name, category, price, image } = req.body;
        const product = new Product({ name, category, price, image });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ statusCode: 500, scope, method, message: error?.message });
    }
}