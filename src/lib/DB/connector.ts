"use server";
import mongoose from "mongoose";
const connection: { isConnected: null | number } = {
  isConnected: null,
};
const dbUri: string | undefined = process.env.MONGODB_URI;
const username: string | undefined = process.env.MONGODB_USER;
const password: string | undefined = process.env.MONGODB_PASS;

export const connectToDB = async () => {
  try {
    if (connection.isConnected) return;
    if (dbUri) {
      const db = await mongoose.connect(dbUri, {
        user: username,
        pass: password,
      });
      connection.isConnected = db.connections[0].readyState;
      console.log(
        "Connected to MongoDB! ReadyState:" + db.connections[0].readyState
      );
    } else {
      console.log("No MongoDB URI provided, skipping connection");
    }
  } catch (error: Error | any) {
    console.log("Something went wrong while connecting to MongoDB");
    console.log(error);
  }
};
