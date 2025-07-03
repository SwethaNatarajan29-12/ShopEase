import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';


/**********************************************************************************************************************
 * validateUser - Middleware to validate user authentication.
 * It checks for a JWT token in the cookies, verifies it,
 * and retrieves the user from the database based on the identityId.
 * If the user is found, it attaches the user object to the request and calls next().
 * If the token is missing or invalid, it returns a 401 Unauthorized response.
 * If the user is not found, it returns a 400 Bad Request response.
 * If an error occurs, it returns a 500 Internal Server Error response.
 **********************************************************************************************************************/
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