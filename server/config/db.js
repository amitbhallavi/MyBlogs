import mongoose from "mongoose";
import "colors";

const redactMongoUri = (uri) => {
  try {
    const parsed = new URL(uri);
    if (parsed.username) parsed.username = "***";
    if (parsed.password) parsed.password = "***";
    return parsed.toString();
  } catch {
    return "Invalid MongoDB URI";
  }
};

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${conn.connection.name}`.bgGreen.black); 
  } catch (error) {
    if (error.message?.toLowerCase().includes("bad auth")) {
      console.error("MongoDB authentication failed.");
      console.error("Checked URI:", redactMongoUri(process.env.MONGO_URI));
      console.error("Fix: reset/check the MongoDB Atlas database user's username and password, then update server/.env.");
    }

    throw error;
  }
};

export default connectDB;
