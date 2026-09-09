import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({quiet: true})

const PORT = Number(process.env.PORT) || 5003;

app.listen(PORT, () => {
  console.log(`🚀 Product service running on port ${PORT}`);
});