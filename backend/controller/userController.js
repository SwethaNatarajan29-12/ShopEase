import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { generateJWTtoken, generateIdentityId } from "../utils/helper.js";
let scope = "userController";


/******************************************************************************
 * register - Handles user registration with username, email, and password.
 * It checks for existing usernames and emails, hashes the password,
 * generates an identity ID, and saves the user to the database.
 * If successful, it generates a JWT token and returns the user object 
 * (excluding password) in the response.
 ******************************************************************************/
export const register = async (req, res) => {
    let method = "register";
    try {
        const { username, email, password } = req.body;
        console.log("req.body", req.body);

        const existingUserName = await User.findOne({ username });

        if (existingUserName) {
            return res.status(400).json({ statusCode: 400, message: 'Username already exists' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ statusCode: 400, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(password, salt);
        const identityId = await generateIdentityId(res, email);
        const createUser = new User({
            username,
            email,
            password: hashedPassword,
            identityId
        })

        if (createUser) {
            await generateJWTtoken(res, createUser);
            await createUser.save();
            // Return the user object (without password) for frontend
            const user = await User.findOne({ email }).select("-password");
            res.status(201).json(user);
        } else {
            res.status(400).json({ statusCode: 400, error });
        }


    } catch (error) {
        console.log("error - ", error);
        res.status(500).json({ statusCode: 500, scope, method, error });
    }
}


/*******************************************************************************
 * login - Handles user login by validating the email and password.
 * It checks if the user exists, verifies the password,
 * otherwise returns an error message.
 * If successful, it generates a JWT token and returns the user object
 * (excluding password) in the response.
 ********************************************************************************/
export const login = async (req, res) => {
    let method = "login";
    try {
        const { email, password } = req.body;
        console.log("payload validation in login - ", email, password);
        const user = await User.findOne({ email });
        console.log("user from login - ", user);
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "Invalid email.Please login with registered mail or signup using this mail" });
        }

        const verifyPassword = await bcrypt.compare(password, user?.password || "");

        if (!verifyPassword) {
            return res.status(400).json({ statusCode: 400, message: "Invalid password" })
        }

        await generateJWTtoken(res, user);
        // Return the user object (without password) for frontend
        const safeUser = await User.findOne({ email }).select("-password");
        res.status(200).json(safeUser);
    } catch (error) {
        console.log("error from login - ", error);
        res.status(500).json({ statusCode: 500, scope, method, message: error?.message || "Internal server error" });
    }

}

/*******************************************************************************************
 * getProfile - Retrieves the profile of the currently logged-in user.
 * It uses the identityId from the request user object to find the user in the database.
 * If the user is found, it returns the user object (excluding password).
 * If the user is not found, it returns a 404 error.
 * If an error occurs, it returns a 500 error with the error message.
 *********************************************************************************************/
export const getProfile = async (req, res) => {
    let method = "getProfile";
    try {
        const identityId = req.user?.identityId;
        const user = await User.findOne({ identityId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("user from getProfile - ", user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ statusCode: 500, scope, method, error: error?.message || "Internal server error" });
    }
}


/*************************************************************************************************************************
 * updateProfile - Updates the profile of a user by their ID.
 * It allows updating the mobile number and image(for upload image wants to implement cloudinary or any other package).
 * currently replaced the image with dummy user image.
 * If the user is found, it updates the fields and returns the updated user object (excluding password).
 * If the user is not found, it returns a 404 error.
 * If an error occurs, it returns a 500 error with the error message.
 ***************************************************************************************************************************/
export const updateProfile = async (req, res) => {
    let method = "updateProfile";
    try {
        const { mobile, image } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { mobile, image },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ statusCode: 500, scope, method, error: error.message || "Internal server error" });
    }
}

/***************************************************************************************
 * logout - Handles user logout by clearing the authentication cookie.
 * It clears the auth cookie and returns a success message.
 ***************************************************************************************/
export const logout = async (req, res) => {
    try {
        // Clear the auth cookie (adjust name if needed)
        res.clearCookie("x-ecom-jwt", { path: "/", httpOnly: true, sameSite: "lax" });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error from logout - ", error);
        res.status(500).json({ statusCode: 500, scope, method: "logout", error: error?.message || "Internal server error" });
    }
}