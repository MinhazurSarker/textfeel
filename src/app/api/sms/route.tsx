import { connectToDB } from "@/lib/DB/connector";
import { SMS } from "@/lib/models/SMS";
import { User } from "@/lib/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
const secret = process.env.JWT_SECRET || "";

function containsOtp(smsBody: string) {
  const otpPattern = /\b\d{4,8}\b/;
  return otpPattern.test(smsBody);
}
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
    const { body, slot, time, number } = await req.json();
    if (!body || body.length < 1) {
      return NextResponse.json({
        type: "error",
        message: "Invalid request. No SMS body sent",
      });
    }
    if (!number || number.length < 1) {
      return NextResponse.json({
        type: "error",
        message: "Invalid request. No number sent",
      });
    }
    if (!slot || slot.length < 1) {
      return NextResponse.json({
        type: "error",
        message: "Invalid request. No slot sent",
      });
    }
    if (!time || time.length < 1) {
      return NextResponse.json({
        type: "error",
        message: "Invalid request. No slot sent",
      });
    }

    const isOtp = containsOtp(body);
    if (!isOtp) {
      console.log("Not an OTP");
      return NextResponse.json({
        type: "warning",
        message: "SMS is not an OTP",
      });
    }
    const newSMS = await new SMS({
      body,
      slot,
      time,
      number,
      user: user._id,
    });
    await newSMS.save();

    return NextResponse.json({
      type: "success",
      message: "SMS forwarded successfully",
    });
  } catch (error) {
    return NextResponse.json({ type: "error", message: "Something Went" });
  }
}
