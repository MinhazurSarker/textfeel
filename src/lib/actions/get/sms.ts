"use server";
import { connectToDB } from "@/lib/DB/connector";
import { SMS } from "@/lib/models/SMS";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { objectify } from "@/lib/utils/utils";

export const getMessages = async ({
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
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .populate("user", " name username");
      console.log(messages);
      return {
        type: "success",
        messages: objectify(messages),
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      };
    } catch (error) {
      return {
        type: "error",
        messages: [],
        current: 1,
        pages: 1,
      };
    }
  });
};
