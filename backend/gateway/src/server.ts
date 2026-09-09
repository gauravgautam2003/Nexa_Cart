import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true })

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});