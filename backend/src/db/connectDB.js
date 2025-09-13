import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(`MongoDb connection successful: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error in connectDB ${error}`);
    process.exit(1);
  }
};

export default connectDB;
