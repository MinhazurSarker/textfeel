import mongoose, { Document } from "mongoose";
interface User extends Document {
  name: string;
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: { type: String, required: true },
    simslot1: String,
    simslot2: String,
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
