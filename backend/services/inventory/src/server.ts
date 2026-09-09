import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true })

const PORT = Number(process.env.PORT) || 5007;

app.listen(PORT, () => {
    console.log(`🚀 Inventory service running on port ${PORT}`);
});