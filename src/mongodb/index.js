import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI_OLD, {
      dbName: "travel_users",
    });
    isConnected = true;
    console.log("MongoDB is connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};
