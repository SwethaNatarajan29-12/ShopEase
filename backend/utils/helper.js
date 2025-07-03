import jwt from "jsonwebtoken";
import crypto from "crypto";


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