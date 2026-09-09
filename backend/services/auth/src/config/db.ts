import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongodbUrl = process.env.MONGO_URI

        if (!mongodbUrl) {
            throw new Error("❌ mongoDB url is not defined")
        }

        mongoose.connect(mongodbUrl)

        console.log("✅ mongodb connected successfully!")
    } catch (error) {
        console.error("❌ mongoDB connection failed:", error);
        process.exit(1);
    }
}

export default connectDB