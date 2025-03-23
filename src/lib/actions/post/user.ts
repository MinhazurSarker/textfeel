"use server";
import { connectToDB } from "@/lib/DB/connector";
import { IUser, User } from "@/lib/models/User";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { getLast11Digits } from "@/lib/utils/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const secret = process.env.JWT_SECRET || "";
interface ReturnType {
  type: "error" | "success" | "warning";
  message: string;
  redirect?: string;
}
export const login = async (formData: FormData): Promise<ReturnType> => {
  const { username, password } = Object.fromEntries(formData);

  if (!username || !password) {
    return { type: "error", message: "Please enter all fields" };
  }
  try {
    await connectToDB();
    const user = await User.findOne({ username: username });

    if (!user) {
      return { type: "error", message: "Account not found" };
    }
    const pass = password.toString();

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      return { type: "error", message: "Invalid credentials" };
    }

    const token = jwt.sign({ userId: user._id }, secret);

    const cookieStore = cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return {
      type: "success",
      message: "Login successful",
      redirect: user.role === "admin" ? "/" : "/profile",
    };
  } catch (error) {
    console.log(error);
    return { type: "error", message: "Invalid credentials" };
  }
};
export const logout = async () => {
  const cookieStore = cookies();
  cookieStore.delete("token");
  return redirect("login");
};
export const updateUser = async ({
  _id,
  username,
  role,
  password,
  simslot1,
  simslot2,
}: {
  _id: string;
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
  simslot2: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
}): Promise<ReturnType> => {
  return await checkAuth(["admin"], async () => {
    try {
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return { type: "error", message: "Invalid token" };
      }
      const user = await User.findById(_id);
      if (!user) {
        return { type: "error", message: "User not found" };
      }

      if (
        getLast11Digits(simslot1.number) == getLast11Digits(simslot2.number)
      ) {
        return {
          type: "error",
          message: "Both numbers can not be same",
        };
      }
      const checkSimslot = await User.findOne({
        $or: [
          { "simslot1.number": simslot1.number },
          { "simslot2.number": simslot2.number },
          { "simslot2.number": simslot1.number },
          { "simslot1.number": simslot2.number },
        ],
        _id: { $ne: user?._id },
      });
      if (checkSimslot) {
        return {
          type: "error",
          message: "Phone number already in use",
        };
      }
      const checkUsername = await User.findOne({
        username: username,
        _id: { $ne: _id },
      });
      if (checkUsername) {
        return { type: "error", message: "Username already exists" };
      }
      user.username = username;
      user.role = role;
      user.simslot1 = {
        ...simslot1,
        number: getLast11Digits(simslot1.number),
      };
      user.simslot2 = {
        ...simslot2,
        number: getLast11Digits(simslot2.number),
      };
      if (password && password !== "") {
        const hashPassword = bcrypt.hashSync(password, 10);
        user.password = hashPassword;
      }
      await user.save();
      revalidatePath("/users");
      return { type: "success", message: "User updated successfully" };
    } catch (error) {
      console.log(error);
      return { type: "error", message: "Failed to update user" };
    }
  });
};
export const deleteUser = async ({
  _id,
}: {
  _id: string;
}): Promise<ReturnType> => {
  return await checkAuth(["admin"], async (user: IUser) => {
    try {
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return { type: "error", message: "Invalid token" };
      }
      if (user?._id.toString() === _id.toString()) {
        return { type: "error", message: "Cannot delete self" };
      }
      const userData = await User.findOne({ _id: _id });
      if (!userData) {
        return { type: "error", message: "User not found" };
      }
      await User.findByIdAndDelete(_id);
      revalidatePath("/users");
      return { type: "success", message: "User deleted successfully" };
    } catch (error) {
      console.log(error);
      return { type: "error", message: "Failed to delete user" };
    }
  });
};
export const createUser = async ({
  username,
  role,
  password,
  simslot1,
  simslot2,
}: {
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
  simslot2: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
}): Promise<ReturnType> => {
  return await checkAuth(["admin"], async () => {
    try {
      const checkSimslot = await User.findOne({
        $or: [
          { "simslot1.number": simslot1.number },
          { "simslot2.number": simslot2.number },
          { "simslot2.number": simslot1.number },
          { "simslot1.number": simslot2.number },
        ],
      });
      if (checkSimslot) {
        return {
          type: "error",
          message: "Phone number already in use",
        };
      }
      const checkUsername = await User.findOne({ username: username });
      if (checkUsername) {
        return { type: "error", message: "Username already exists" };
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({
        username: username,
        role: role,
        password: hashPassword,
        simslot1: { ...simslot1, nmber: getLast11Digits(simslot1.number) },
        simslot2: { ...simslot2, number: getLast11Digits(simslot2.number) },
      });
      await newUser.save();
      revalidatePath("/users");
      return { type: "success", message: "User created successfully" };
    } catch (error) {
      console.log(error);
      return { type: "error", message: "Failed to create user" };
    }
  });
};
export const updateProfile = async ({
  username,
  password,
  simslot1,
  simslot2,
}: {
  username: string;
  password: string;
  simslot1: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
  simslot2: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
}): Promise<ReturnType> => {
  return await checkAuth(["user", "admin"], async (user: IUser) => {
    try {
      if (!user) {
        return { type: "error", message: "User not found" };
      }

      if (
        getLast11Digits(simslot1.number) == getLast11Digits(simslot2.number)
      ) {
        return {
          type: "error",
          message: "Both numbers can not be same",
        };
      }
      const checkSimslot = await User.findOne({
        $or: [
          { "simslot1.number": simslot1.number },
          { "simslot2.number": simslot2.number },
          { "simslot2.number": simslot1.number },
          { "simslot1.number": simslot2.number },
        ],
        _id: { $ne: user?._id },
      });
      if (checkSimslot) {
        return {
          type: "error",
          message: "Phone number already in use",
        };
      }
      const checkUsername = await User.findOne({
        username: username,
        _id: { $ne: user?._id },
      });
      if (checkUsername) {
        return { type: "error", message: "Username already exists" };
      }
      user.username = username;
      user.simslot1 = { ...simslot1, number: getLast11Digits(simslot1.number) };
      user.simslot2 = { ...simslot2, number: getLast11Digits(simslot2.number) };
      if (password && password !== "") {
        const hashPassword = bcrypt.hashSync(password, 10);
        user.password = hashPassword;
      }
      await user.save();
      return { type: "success", message: "User updated successfully" };
    } catch (error) {
      console.log(error);
      return { type: "error", message: "Failed to update user" };
    }
  });
};
