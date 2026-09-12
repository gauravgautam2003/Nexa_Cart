import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    sku: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        brand: {
            type: String,
            trim: true,
            index: true,
        },

        images: {
            type: [String],
            default: [],
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        // stock keeping unit
        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({
    name: "text",
    description: "text",
    brand: "text",
    category: "text",
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;