import { connectToDB } from "@/lib/DB/connector";
import { User } from "@/lib/models/User";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const user = await User.findOne({ username: "minhazur" });
    if (user) {
      return NextResponse.json({ type: "success", message: "Hello World" });
    }
    const isPasswordValid = await bcrypt.hashSync("minhazur", 10);

    const newUser = await new User({
      username: "minhazur",
      password: isPasswordValid,
      role: "admin",
    });
    await newUser.save();

    return NextResponse.json({
      type: "success",
      message: "Initiated successful",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      type: "error",
      message: "Something went wrong",
    });
  }
}
