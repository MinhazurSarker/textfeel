import { connectToDB } from "@/lib/DB/connector";
import { User } from "@/lib/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
const secret = process.env.JWT_SECRET || "";
export async function POST(req: NextRequest) {
  const { username, password } = await req?.json();

  if (!username || !password) {
    return NextResponse.json({
      type: "error",
      message: "Invalid credentials",
      user: null,
      token: null,
    });
  }
  try {
    await connectToDB();
    const user = await User.findOne({ username: username });
    if (!user) {
      return NextResponse.json({
        type: "error",
        message: "Invalid credentials",
        user: null,
        token: null,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      user.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json({
        type: "error",
        message: "Invalid credentials",
        user: null,
        token: null,
      });
    }
    const token = jwt.sign({ userId: user._id }, secret);

    return NextResponse.json({
      type: "success",
      message: "Login successful",
      user: {
        name: "",
        role: user?.role,
        username: user?.username,
        simslot2: user?.simslot2?.number || "",
        simslot1: user?.simslot1?.number,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      type: "error",
      message: "Invalid credentials",
      user: null,
      token: null,
    });
  }
}
