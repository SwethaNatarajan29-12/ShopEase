import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';


export const validateUser = async (req, res, next) => {
    try {
        console.log("cookies - ", req);
        const token = req.cookies['x-ecom-jwt'];
        if (!token) {
            return res.status(401).json({ statusCode: 401, error: "No token found", message: 'Unauthorized to access' });
        }

        const decodeJWT = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodeJWT) {
            return res.status(401).json({ statusCode: 401, error: "Invalid Token", message: "Unauthorized to access" });
        }
        const identityId = decodeJWT?.identityId;
        const user = await User.findOne({ identityId }).select("-password");
        if (!user) {
            res.status(400).json({ statusCode: 400, error: "Invalid user", message: "User Not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error from validateUser - ", error?.message);
        res.status(500).json({ statusCode: 500, message: error });
    }
}