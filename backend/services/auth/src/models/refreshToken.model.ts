import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    revokedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true,
    },
    revokedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
