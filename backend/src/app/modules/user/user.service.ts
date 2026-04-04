import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser, IUserAddress, IUserPayload } from "./user.interface";
import { createToken } from "../auth/auth.utils";
import config from "../../config";
import { startSession } from "mongoose";
import { generateHashedPassword } from "../../utils/generateHashedPassword";
import { User, UserAddress } from "./user.model";

const addUserIntoDB = async (payload: IUserPayload) => {
  const {
    addressLine1,
    addressLine2,
    city,
    postalCode,
    password,
    ...userPayload
  } = payload;

  const session = await startSession();

  try {
    session.startTransaction();

    let hashedPassword: string | null = null;

    if (password) {
      hashedPassword = await generateHashedPassword(password);
    }

    const addressPayload: IUserAddress = {
      addressLine1: addressLine1 ?? null,
      addressLine2: addressLine2 ?? null,
      city: city ?? null,
      postalCode: postalCode ?? null,
    };

    const address = await UserAddress.create([addressPayload], { session });

    const addressDoc = address[0];

    if (!addressDoc) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create address");
    }

    const user = await User.create(
      [
        {
          ...userPayload,
          password: hashedPassword,
          address: addressDoc._id,
        },
      ],
      { session },
    );

    const userDoc = user[0];

    if (!userDoc) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create address");
    }

    const jwtPayload = {
      id: userDoc._id,
      email: userDoc.email,
      role: userDoc.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    await session.commitTransaction();

    return { accessToken };
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  } finally {
    await session.endSession();
  }
};

const getUserFromDB = async (email: string) => {
  const result = await User.aggregate([
    { $match: { email } },

    {
      $lookup: {
        from: "useraddresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },

    {
      $unwind: {
        path: "$address",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        mobile: 1,
        accountType: 1,
        addressLine1: "$address.addressLine1",
        addressLine2: "$address.addressLine2",
        city: "$address.city",
        postalCode: "$address.postalCode",
      },
    },
  ]);

  return result[0];
};

const updateUserIntoDB = async (
  id: string,
  payload: Partial<IUser & IUserAddress>,
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const session = await startSession();

  try {
    session.startTransaction();

    await UserAddress.findByIdAndUpdate(
      user.address,
      {
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city,
        postalCode: payload.postalCode,
      },
      { session, runValidators: true, new: true },
    );

    const result = await User.findByIdAndUpdate(
      id,
      {
        name: payload.name,
        mobile: payload.mobile,
        isDisabled: payload.isDisabled,
      },
      { session, runValidators: true, new: true },
    );

    await session.commitTransaction();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  } finally {
    await session.endSession();
  }
};

const deleteUserFromDB = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    await UserAddress.findByIdAndDelete(user.address, { session });
    await user.deleteOne({ session });

    await session.commitTransaction();
    await session.endSession();

    return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

const getAllUsers = async () => {
  const res = await User.find().populate("address");

  return res;
};

export const UserServices = {
  addUserIntoDB,
  getUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getAllUsers,
};
