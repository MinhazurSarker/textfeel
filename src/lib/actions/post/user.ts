"use server";
import { connectToDB } from "@/lib/DB/connector";
import { User } from "@/lib/models/User";
import { checkAuth } from "@/lib/utils/CheckAuth";
import { getLast11Digits } from "@/lib/utils/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secret = process.env.JWT_SECRET || "";
interface ReturnType {
  type: "error" | "success" | "warning";
  message: string;
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
    return { type: "success", message: "Login successful" };
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
  name,
  username,
  role,
  password,
  simslot1,
  simslot2,
  webFileNumber,
  ivac,
  mission,
  visaType,
  familyNumbers,
}: {
  _id: string;
  name: string;
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: string;
  simslot2: string;
  webFileNumber: string;
  ivac: string;
  mission: string;
  visaType: string;
  familyNumbers: {
    fullName: string;
    webFileNumber: string;
  }[];
}): Promise<ReturnType> => {
  return await checkAuth(["admin"], async (user: User) => {
    try {
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return { type: "error", message: "Invalid token" };
      }
      const user = await User.findById(_id);
      if (!user) {
        return { type: "error", message: "User not found" };
      }

      if (getLast11Digits(simslot1) == getLast11Digits(simslot2)) {
        return {
          type: "error",
          message: "Both numbers can not be same",
        };
      }
      const checkSimslot = await User.findOne({
        $or: [
          { simslot1: simslot1 },
          { simslot2: simslot2 },
          { simslot2: simslot1 },
          { simslot1: simslot2 },
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
      user.name = name;
      user.username = username;
      user.role = role;
      user.simslot1 = getLast11Digits(simslot1);
      user.simslot2 = getLast11Digits(simslot2);
      user.webFileNumber = webFileNumber;
      user.ivac = ivac || "IVAC, Dhaka (JFP)";
      user.mission = mission || "Dhaka";
      user.visaType = visaType || "TOURIST VISA";
      user.familyNumbers = familyNumbers;

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

export const deleteUser = async ({
  _id,
}: {
  _id: string;
}): Promise<ReturnType> => {
  return await checkAuth(["admin"], async (user: User) => {
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
      return { type: "success", message: "User deleted successfully" };
    } catch (error) {
      console.log(error);
      return { type: "error", message: "Failed to delete user" };
    }
  });
};
export const createUser = async ({
  name,
  username,
  role,
  password,
  simslot1,
  simslot2,
  webFileNumber,
  ivac,
  mission,
  visaType,
  familyNumbers,
}: {
  name: string;
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: string;
  simslot2: string;
  webFileNumber: string;
  ivac: string;
  mission: string;
  visaType: string;
  familyNumbers: {
    fullName: string;
    webFileNumber: string;
  }[];
}): Promise<ReturnType> => {
  return await checkAuth(["admin"], async (user: User) => {
    try {
      if (getLast11Digits(simslot1) == getLast11Digits(simslot2)) {
        return {
          type: "error",
          message: "Both numbers can not be same",
        };
      }
      const checkSimslot = await User.findOne({
        $or: [
          { simslot1: simslot1 },
          { simslot2: simslot2 },
          { simslot2: simslot1 },
          { simslot1: simslot2 },
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
        name: name,
        username: username,
        role: role,
        password: hashPassword,
        simslot1: getLast11Digits(simslot1),
        simslot2: getLast11Digits(simslot2),
        webFileNumber: webFileNumber,
        ivac: ivac || "IVAC, Dhaka (JFP)",
        mission: mission || "Dhaka",
        visaType: visaType || "TOURIST VISA",
        familyNumbers: familyNumbers,
      });
      await newUser.save();
      return { type: "success", message: "User created successfully" };
    } catch (error) {
      return { type: "error", message: "Failed to create user" };
    }
  });
};

export const updateProfile = async ({
  name,
  username,
  password,
  simslot1,
  simslot2,
  webFileNumber,
  ivac,
  mission,
  visaType,
  familyNumbers,
}: {
  name: string;
  username: string;
  password: string;
  simslot1: string;
  simslot2: string;
  webFileNumber: string;
  ivac: string;
  mission: string;
  visaType: string;
  familyNumbers: {
    fullName: string;
    webFileNumber: string;
  }[];
}): Promise<ReturnType> => {
  return await checkAuth(["user", "admin"], async (user: any) => {
    try {
      if (!user) {
        return { type: "error", message: "User not found" };
      }

      if (getLast11Digits(simslot1) == getLast11Digits(simslot2)) {
        return {
          type: "error",
          message: "Both numbers can not be same",
        };
      }
      const checkSimslot = await User.findOne({
        $or: [
          { simslot1: simslot1 },
          { simslot2: simslot2 },
          { simslot2: simslot1 },
          { simslot1: simslot2 },
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
      user.name = name;
      user.username = username;
      user.simslot1 = getLast11Digits(simslot1);
      user.simslot2 = getLast11Digits(simslot2);
      user.webFileNumber = webFileNumber;
      user.ivac = ivac || "IVAC, Dhaka (JFP)";
      user.mission = mission || "Dhaka";
      user.visaType = visaType || "TOURIST VISA";
      user.familyNumbers = familyNumbers;

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
