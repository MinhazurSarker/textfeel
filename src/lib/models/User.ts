import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
  simslot2: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
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

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: { type: String, required: true },
    simslot1: {
      name: String,
      email: { type: String },
      number: String,
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
      ivacLogin: { type: String, default: "" },
      ivacPass: { type: String, default: "" },
    },
    simslot2: {
      name: String,
      email: { type: String },
      number: String,
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
      ivacLogin: { type: String, default: "" },
      ivacPass: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
