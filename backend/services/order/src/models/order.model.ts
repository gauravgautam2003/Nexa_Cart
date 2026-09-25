import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface IShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;

    items: IOrderItem[];

    shippingAddress: IShippingAddress;

    subtotal: number;
    shippingFee: number;
    discount: number;
    totalAmount: number;

    orderStatus: | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: | "pending" | "paid" | "failed" | "refunded";
    paymentMethod: | "cod" | "razorpay";

    paymentId?: string;

    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
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
    {
        _id: false,
    }
);

const shippingAddressSchema = new Schema<IShippingAddress>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        addressLine1: {
            type: String,
            required: true,
            trim: true,
        },

        addressLine2: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        postalCode: {
            type: String,
            required: true,
            trim: true,
        },

        country: {
            type: String,
            required: true,
            trim: true,
            default: "India",
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) => items.length > 0,
                message: "Order must contain at least one item",
            },
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        shippingFee: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        discount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
            index: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
            index: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "razorpay"],
            required: true,
        },

        paymentId: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({
    userId: 1,
    createdAt: -1,
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;