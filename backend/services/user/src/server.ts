import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({quiet: true})

const PORT = Number(process.env.PORT) || 5002;

app.listen(PORT, () => {
  console.log(`🚀 User service running on port ${PORT}`);
});