import Joi from "joi";

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(12).required(),
    username: Joi.string().min(3).max(25).required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(12).required()
})

export const validateSignUp = (req, res, next) => {
    const { error } = signUpSchema.validate(req.body); // Validate the request body
    if (error) {
        return res.status(400).json({ message: error?.details[0]?.message }); // Send error if validation fails
    }
    next(); // Proceed to the next middleware or route handler if validation passes
};

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error?.details[0]?.message });
    }
    next();
}