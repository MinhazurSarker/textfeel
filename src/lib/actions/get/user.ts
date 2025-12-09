"use server";

import { connectToDB } from "@/lib/DB/connector";
import { IUser, User } from "@/lib/models/User";
import { checkAuth } from "@/lib/utils/CheckAuth";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { objectify } from "../../utils/utils";

const secret = process.env.JWT_SECRET || "";

export const getUserByToken = async () => {
  try {
    await connectToDB();
    const token = cookies().get("token")?.value;
    if (!token) {
      return { type: "error", message: "Unauthorized" };
    }
    const decodedTokenData = jwt.verify(token, secret);
    if (typeof decodedTokenData === "string") {
      return { type: "error", message: "Invalid token" };
    }
    const { userId } = decodedTokenData;
    if (!userId) {
      return { type: "error", message: "Invalid token" };
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return { type: "error", message: "User not found" };
    }
    return { type: "success", user: objectify(user), token: token };
  } catch (error) {
    return { type: "error", message: "Something went worng" };
  }
};

export const getUsers = async ({
  page = "1",
  limit = "100",
  search = "",
}: {
  page?: string;
  limit?: string;
  search?: string;
}) => {
  return await checkAuth(["admin"], async () => {
    try {
      await connectToDB();
      const totalUsers = await User.countDocuments({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { simslot1: { $regex: search, $options: "i" } },
          { simslot2: { $regex: search, $options: "i" } },
        ],
      });
      const users = await User.find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { simslot1: { $regex: search, $options: "i" } },
          { simslot2: { $regex: search, $options: "i" } },
        ],
      })
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .select("-password");

      return {
        type: "success",
        users: objectify(users),
        current: parseInt(page),
        pages: Math.ceil(totalUsers / parseInt(limit)),
      };
    } catch (error) {
      return {
        type: "error",
        users: [],
        current: 1,
        pages: 1,
      };
    }
  });
};
export const getAllUsers = async () => {
  return await checkAuth(["admin"], async () => {
    try {
      await connectToDB();
      const users = await User.find({
        role: "user",
      })
        .sort({ createdAt: -1 })
        .select("-password");

      return objectify(users);
    } catch (error) {
      return [];
    }
  });
};

export const getUser = async (id: string) => {
  return await checkAuth(["admin"], async () => {
    try {
      await connectToDB();
      if (!id) {
        return { type: "error", message: "User not found" };
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { type: "error", message: "Invalid user id" };
      }
      const user = await User.findById(id).select("-password");
      if (!user) {
        return { type: "error", message: "User not found" };
      }
      return { type: "success", user: objectify(user) };
    } catch (error) {
      return { type: "error", message: "Something went worng" };
    }
  });
};
export const getProfile = async () => {
  return await checkAuth(["admin", "user"], async (user: any) => {
    try {
      return {
        type: "success",
        user: { ...(objectify(user) as IUser), password: undefined },
      };
    } catch (error) {
      return { type: "error", message: "Something went worng" };
    }
  });
};
