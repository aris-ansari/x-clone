import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/auth.routes.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse the form data (url encoded)
app.use(cookieParser());

app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});
