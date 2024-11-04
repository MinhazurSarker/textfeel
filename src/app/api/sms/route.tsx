import { connectToDB } from "@/lib/DB/connector";
import { SMS } from "@/lib/models/SMS";
import { User } from "@/lib/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
const secret = process.env.JWT_SECRET || "";

function containsOtp(smsBody: string) {
  const otpPattern = /\b(\d{4,8})\b/;
  const otpKeywords = [
    "otp",
    "OTP",
    "one time password",
    "verification code",
    "code",
    "password",
  ];
  const containsKeyword = otpKeywords.some((keyword) =>
    smsBody.toLowerCase().includes(keyword),
  );
  const hasOtpPattern = otpPattern.test(smsBody);
  return containsKeyword && hasOtpPattern;
}

export async function POST(req: NextRequest) {
  console.log(secret);
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
    if (!body || !slot || !number || !time) {
      return NextResponse.json({ type: "error", message: "Invalid request" });
    }
    const isOtp = containsOtp(body);
    if (!isOtp) {
      console.log("Not an OTP");
      return NextResponse.json({
        type: "success",
        message: "SMS forwarded successfully",
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
    console.log(error);
    return NextResponse.json({ type: "error", message: "Something Went" });
  }
}
