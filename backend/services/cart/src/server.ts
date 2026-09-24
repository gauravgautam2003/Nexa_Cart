import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = Number(process.env.PORT) || 5004;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Cart Service running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start Cart Service:",
            error
        );

        process.exit(1);
    }
};

startServer();