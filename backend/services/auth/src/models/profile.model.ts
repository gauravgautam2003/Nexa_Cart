import mongoose, { Document, Types, Schema } from "mongoose";

export interface IUserProfile extends Document {
    userId: Types.ObjectId,
    phone?: string,
    avatar?: string,
    dateOfBirth?: Date,
    gender?: "male" | "female" | "other",
    addresses: {
        fullName: string,
        phone: string,
        addressLine: string,
        city: string,
        state: string,
        postalCode: string,
        country: string,
        isDefault: boolean
    }[];
    createdAt: Date,
    updatedAt: Date
}

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    addressLine: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        default: "India",
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
}, {
    _id: true
})

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true,
    },

    phone: {
        type: String,
        trim: true,
    },

    avatar: {
        type: String,
        trim: true,
    },

    dateOfBirth: {
        type: Date,
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },

    addresses: {
        type: [addressSchema],
        default: [],
    },
}, {
    timestamps: true
})

const UserProfile = mongoose.model<IUserProfile>(
    "UserProfile",
    userProfileSchema
);

export default UserProfile;