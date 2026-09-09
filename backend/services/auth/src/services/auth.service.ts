import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import type { RegisterRequest } from "../types/auth.types.js";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password }: RegisterRequest = req.body;

        const userExist = await User.findOne({ email })

        if (userExist) {
            const error = new Error("User already exist with this email!");
            (error as any).statusCode = 400;
            throw error;
        }

        const hashPassword = await bcrypt.hash(password, 15);

        const user = new User({
            name,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

        return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        })

        return res.status(200).json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        });

    } catch (error) {
        console.error("Failed to register user!");
        (error as any).statusCode = 500;
        throw error;
    }
}
