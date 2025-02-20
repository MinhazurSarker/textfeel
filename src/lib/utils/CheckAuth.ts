import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDB } from "../DB/connector";
import { User } from "../models/User";

const secret = process.env.JWT_SECRET || "";

export async function checkAuth(
  role: Array<"admin" | "user">,
  callback: (user: any) => Promise<any>,
  tokenString: string | null | undefined = undefined,
) {
  const getUserAndToken = async () => {
    await connectToDB();
    const token = tokenString ? tokenString : cookies().get("token")?.value;
    if (!token) {
      return { type: "error", user: null, token: null };
    }
    const decodedTokenData = jwt.verify(token, secret);
    if (typeof decodedTokenData === "string") {
      return { type: "error", user: null, token: null };
    }
    const { userId } = decodedTokenData;
    if (!userId) {
      return { type: "error", user: null, token: null };
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { type: "error", user: null, token: null };
    }
    const user = await User.findById(userId);
    if (!user) {
      return { type: "error", user: null, token: null };
    }
    return { type: "success", user, token };
  };
  const { user, token, type } = await getUserAndToken();
  if (type === "error") {
    return redirect("/login");
  }

  if (!role.includes(user?.role)) {
    return redirect("/login");
  }
  return callback(user);
}
