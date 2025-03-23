"use server";
import { connectToDB } from "@/lib/DB/connector";
import { SMS } from "@/lib/models/SMS";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { revalidatePath } from "next/cache";

interface ReturnType {
  type: "error" | "success" | "warning";
  message: string;
}
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

function containsOtp(smsBody: string) {
  const otpPattern = /\b\d{4,8}\b/;
  return otpPattern.test(smsBody);
}
export const postOTP = async (formData: FormData): Promise<ReturnType> => {
  try {
    const number = formData.get("number")?.toString() || "";
    const otp = formData.get("otp")?.toString() || "";
    await connectToDB();

    if (!number || number.length < 1) {
      return {
        type: "error",
        message: "Invalid request. No number sent",
      };
    }

    const isOtp = containsOtp(otp);
    if (!isOtp) {
      console.log("Not an OTP");
      return {
        type: "warning",
        message: "SMS is not an OTP",
      };
    }
    const newSMS = await new SMS({
      body: otp,
      time: new Date(),
      number,
      user: null,
    });
    await newSMS.save();

    return {
      type: "success",
      message: "SMS forwarded successfully",
    };
  } catch (error) {
    return { type: "error", message: "Something Went" };
  }
};
