import { IUser, User } from "@/lib/models/User";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { redirect } from "next/navigation";

export const getStats = async () => {
  return await checkAuth(["admin", "user"], async (user: IUser) => {
    if (user.role === "user") {
      return redirect("/profile");
    }

    try {
      const totalUsers = await User.countDocuments({});
      return { type: "success", totalUsers };
    } catch {
      return { type: "error", totalUsers: 0 };
    }
  });
};
