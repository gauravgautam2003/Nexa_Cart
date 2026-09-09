import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: "user" | "admin",
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const User = mongoose.model<IUser>("User", userSchema);

export default User;