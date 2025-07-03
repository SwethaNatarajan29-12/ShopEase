import jwt from "jsonwebtoken";
import crypto from "crypto";


/*******************************************************************************************************************************************************
 * generateJWTtoken - Generates a JWT token for the user and sets it as a cookie in the response.
 * @param {Object} res - The response object to set the cookie.
 * @param {Object} user - The user object containing user details.
 * * The token includes the user's _id, identityId, email, and username.
 * The token expires in 15 days.
 * The cookie is set with a max age of 15 days, httpOnly, sameSite strict, and secure attributes.
 * This helps prevent XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks.
 *******************************************************************************************************************************************************/
export const generateJWTtoken = async (res, user) => {
    const token = jwt.sign({ _id: user?._id, identityId: user?.identityId, email: user?.email, username: user?.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d"
    })

    res.cookie("x-ecom-jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent xss attacks cross-site scripting  attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: true
    }
    )
    console.log("res - ", res, "token - ",token);
}



/**********************************************************************************************************************
 * generateIdentityId - Generates a unique identity ID for the user.
 * It uses AES-256-CBC encryption to encrypt the user data (email in this case).
 * The encryption uses a secret key stored in the environment variable IDENTITY_SECRET_KEY.
 * The IV (initialization vector) is randomly generated for each encryption.
 * The encrypted data is returned as a hexadecimal string.
 * @param {Object} res - The response object to handle errors.
 * @param {Object} data - The user data to be encrypted, typically containing the user's
 *********************************************************************************************************************/
export const generateIdentityId = async(res,data) =>{
    try {
      const iv = crypto.randomBytes(16);
      let secretKey = process.env.IDENTITY_SECRET_KEY;
      let cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);      
      let crypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
      crypted += cipher.final('hex');
      return crypted;
    } catch (error) {
      res.status(500).json({statusCode : 500, error});
      throw error;
    }
}