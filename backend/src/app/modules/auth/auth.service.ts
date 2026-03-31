import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { TChangePasswordPayload, TLoginUser } from "./auth.interface";
import { generateHashedPassword } from "../../utils/generateHashedPassword";
import { createToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  if (payload.password && user.password) {
    const isPasswordMatched = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new AppError(httpStatus.FORBIDDEN, "Password did not matched...!");
    }
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { token: accessToken };
};

const changeEmailPassword = async (
  userEmail: string,
  payload: TChangePasswordPayload,
) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }

  if (payload.currentPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Both current and new password is same",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password did not matched...!");
  }

  const hashedPassword = await generateHashedPassword(payload.newPassword);
  user.password = hashedPassword;
  await user.save();

  return null;
};

export const AuthServices = {
  loginUser,
  changeEmailPassword,
};
