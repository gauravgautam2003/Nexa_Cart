import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
    productId: mongoose.Types.ObjectId;
    sku: string;
    availableStock: number;
    reservedStock: number;
    soldStock: number;
    lowStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true,
        },

        availableStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        reservedStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        soldStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        lowStockThreshold: {
            type: Number,
            required: true,
            default: 5,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model<IInventory>("Inventory", inventorySchema);

export default Inventory;