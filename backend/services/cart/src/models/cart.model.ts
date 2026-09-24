import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
    productId: mongoose.Types.ObjectId;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
    totalItems: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        sku: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },

        totalItems: {
            type: Number,
            default: 0,
            min: 0,
        },

        subtotal: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;