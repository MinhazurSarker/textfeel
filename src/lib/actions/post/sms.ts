"use server";
import { connectToDB } from "@/lib/DB/connector";
import { SMS } from "@/lib/models/SMS";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { revalidatePath } from "next/cache";

export const deleteSingleSMS = async (formData: FormData) => {
  const id = formData.get("id");
  await checkAuth(["admin"], async () => {
    try {
      connectToDB();
      await SMS.findByIdAndDelete(id);
      return { type: "success", message: "SMS deleted successfully" };
    } catch (error) {
      return { type: "error", message: "something went wrong" };
    }
  });
  return revalidatePath("/sms");
};
export const deleteAllSMS = async () => {
  await checkAuth(["admin"], async () => {
    try {
      connectToDB();
      await SMS.deleteMany({});
      return { type: "success", message: "All SMS deleted successfully" };
    } catch (error) {
      return { type: "error", message: "something went wrong" };
    }
  });
  return revalidatePath("/sms");
};
