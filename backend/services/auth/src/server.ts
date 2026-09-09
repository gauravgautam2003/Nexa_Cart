import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

import connectDB from "./config/db.js";

const PORT = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Auth Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Auth Service:", error);
        process.exit(1);
    }
};

startServer();