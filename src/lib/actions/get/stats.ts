import { SMS } from "@/lib/models/SMS";
import { User } from "@/lib/models/User";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { objectify } from "@/lib/utils/utils";

export const getStats = async () => {
  return await checkAuth(["admin"], async () => {
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
