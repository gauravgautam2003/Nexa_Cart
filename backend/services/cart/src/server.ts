import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({quiet: true})

const PORT = Number(process.env.PORT) || 5004;

app.listen(PORT, () => {
  console.log(`🚀 Cart service running on port ${PORT}`);
});