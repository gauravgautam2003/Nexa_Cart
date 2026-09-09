import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({quiet: true})

const PORT = Number(process.env.PORT) || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Order service running on port ${PORT}`);
});