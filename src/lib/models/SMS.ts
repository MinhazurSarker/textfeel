import mongoose, { Document } from "mongoose";
interface SMS extends Document {
  name: string;
}
const SMSSchema = new mongoose.Schema(
  {
    body: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    time: Date,

    number: String,
  },
  {
    timestamps: true,
  },
);

export const SMS = mongoose.models?.SMS || mongoose.model("SMS", SMSSchema);
