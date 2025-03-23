import { SMS } from "@/lib/models/SMS";
import { IUser, User } from "@/lib/models/User";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { objectify } from "@/lib/utils/utils";
import { redirect } from "next/navigation";

export const getStats = async () => {
  return await checkAuth(["admin", "user"], async (user: IUser) => {
    if (user.role === "user") {
      return redirect("/profile");
    }
    try {
      const totalMessages = await SMS.countDocuments({});
      const totalUsers = await User.countDocuments({});
      const latestMessages = await SMS.find()
        .sort({ createdAt: -1 })
        .populate("user", " name username");
      return {
        type: "success",
        totalMessages,
        totalUsers,
        latestMessages: objectify(latestMessages),
      };
    } catch (error) {
      return {
        type: "error",
        totalMessages: 0,
        totalUsers: 0,
        latestMessages: [],
      };
    }
  });
};
