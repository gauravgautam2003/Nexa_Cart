import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({quiet: true})

const PORT = Number(process.env.PORT) || 5008;

app.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
});