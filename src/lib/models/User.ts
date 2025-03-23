import mongoose, { Document } from "mongoose";
interface User extends Document {
  name: string;
}
export const ivacs = [
  "IVAC, Dhaka (JFP)",
  "IVAC , RAJSHAHI",
  "IVAC, KHULNA",
  "IVAC, SYLHET",
  "IVAC, CHITTAGONG",
];
export const missions = ["Sylhet", "Khulna", "Rajshahi", "Chittagong", "Dhaka"];
export const visaTypes = [
  "MEDICAL/MEDICAL ATTENDANT VISA",
  "ENTRY VISA",
  "TOURIST VISA",
];

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    email: { type: String },
    password: { type: String, required: true },
    simslot1: String,
    simslot2: String,
    mission: {
      type: String,
      enum: missions,
      default: "Dhaka",
    },
    webFileNumber: { type: String, default: "" },
    ivac: {
      type: String,
      default: "IVAC, Dhaka (JFP)",
      enum: ivacs,
    },
    visaType: {
      type: String,
      default: "TOURIST VISA",
      enum: visaTypes,
    },
    familyNumbers: [
      {
        fullName: { type: String, default: "" },
        webFileNumber: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
