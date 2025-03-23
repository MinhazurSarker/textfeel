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
        authSource: "admin",
        user: username,
        pass: password,
      });
      connection.isConnected = db.connections[0].readyState;
      console.log(
        "Connected to MongoDB! ReadyState:" + db.connections[0].readyState,
      );
    } else {
      throw new Error("No MongoDB URI provided");
    }
  } catch (error: Error | any) {
    console.log("Something went wrong while connecting to MongoDB");
    console.log(error);
  }
};
