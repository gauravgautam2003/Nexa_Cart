import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = Number(process.env.PORT) || 5006;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Payment Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Payment Service failed to start:", error);
        process.exit(1);
    }
};

startServer();