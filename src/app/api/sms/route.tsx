import { connectToDB } from "@/lib/DB/connector";
import { SMS } from "@/lib/models/SMS";
import { User } from "@/lib/models/User";
import { objectify } from "@/lib/utils/utils";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
const secret = process.env.JWT_SECRET || "";

function containsOtp(smsBody: string) {
  const otpPattern = /\b\d{4,8}\b/;
  const matchOTPPattern = otpPattern.test(smsBody);
  const containsKeywords = [
    "otp",
    "pin",
    "code",
    "password",
    "pass",
    "confirm",
    "verify",
  ]
    .map((keyword) => new RegExp(keyword, "i"))
    .some((regex) => regex.test(smsBody));
  return matchOTPPattern || containsKeywords;
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
    const { body, time, number } = await req.json();
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

export async function GET(req: NextRequest) {
  try {
    const requestHeaders = new Headers(req.headers);
    const token = requestHeaders.get("token") || "";
    const url = new URL(req.nextUrl.toString());
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

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
    const user = await User.findOne({ _id: userId, role: "admin" }).select(
      "-password",
    );
    if (!user) {
      return NextResponse.json({
        type: "error",
        message: "Unauthorized action",
      });
    }
    const total = await SMS.countDocuments({
      $or: [
        { number: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    });
    const messages = await SMS.find({
      $or: [
        { number: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", " name username");

    return NextResponse.json({
      type: "success",
      messages: objectify(messages),
      current: page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ type: "error", message: "Something Went" });
  }
}
