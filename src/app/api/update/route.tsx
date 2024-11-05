import { connectToDB } from "@/lib/DB/connector";
import { User } from "@/lib/models/User";
import { getLast11Digits, objectify } from "@/lib/utils/utils";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
const secret = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const requestHeaders = new Headers(req.headers);
    const token = requestHeaders.get("token");
    await connectToDB();
    if (!token) {
      return NextResponse.json({
        type: "error",
        message: "Unauthorized action",
      });
    }
    const decodedTokenData = jwt.verify(token, secret);
    if (typeof decodedTokenData === "string") {
      return NextResponse.json({
        type: "error",
        message: "Unauthorized action",
      });
    }
    const { userId } = decodedTokenData;
    if (!userId) {
      return NextResponse.json({
        type: "error",
        message: "Unauthorized action",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({
        type: "error",
        message: "Unauthorized action",
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({
        type: "error",
        message: "Unauthorized action",
      });
    }
    const { name, simslot1, simslot2 } = await req.json();
    if (!name || !simslot1 || !simslot2) {
      return NextResponse.json({ type: "error", message: "Invalid request" });
    }
    if (getLast11Digits(simslot1) == getLast11Digits(simslot2)) {
      return NextResponse.json({
        type: "error",
        message: "Both numbers can not be same",
      });
    }
    const checkSimslot = await User.findOne({
      $or: [
        { simslot1: simslot1 },
        { simslot2: simslot2 },
        { simslot2: simslot1 },
        { simslot1: simslot2 },
      ],
      _id: { $ne: user?._id },
    });
    if (checkSimslot) {
      return NextResponse.json({
        type: "error",
        message: "Phone number already in use",
      });
    }
    user.name = name;
    user.simslot1 = getLast11Digits(simslot1);
    user.simslot2 = getLast11Digits(simslot2);
    await user.save();

    return NextResponse.json({
      type: "success",
      message: "SMS forwarded successfully",
      user: objectify(user),
    });
  } catch (error) {
    return NextResponse.json({ type: "error", message: "Something Went" });
  }
}
