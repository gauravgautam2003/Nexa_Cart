import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({quiet: true})

const PORT = Number(process.env.PORT) || 5006;

app.listen(PORT, () => {
  console.log(`🚀 Payment service running on port ${PORT}`);
});