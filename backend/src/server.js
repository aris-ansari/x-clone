import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/auth.routes.js";
import connectDB from "./db/connectDB.js";

const app = express();

const PORT = process.env.PORT || 8000;

app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});
