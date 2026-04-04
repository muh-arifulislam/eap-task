//
import { startSession } from "mongoose";
import { USER_ROLE } from "../modules/user/user.constant";
import { User, UserAddress } from "../modules/user/user.model";
import { generateHashedPassword } from "../utils/generateHashedPassword";
import { IUserAddress } from "../modules/user/user.interface";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";

const superAdmin = {
  name: "Md. Ariful Islam",
  email: config.super_admin_email as string,
  password: config.super_admin_password as string,
  role: USER_ROLE.admin,
  gender: "male",
  addressLine1: "456 Manager Avenue",
  addressLine2: "Block B",
  city: "Dhaka",
  postalCode: "1216",
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({
    role: USER_ROLE.admin,
    email: "arifibnenam@gmail.com",
  });

  if (!isSuperAdminExists) {
    const session = await startSession();
    try {
      session.startTransaction();

      const {
        addressLine1,
        addressLine2,
        city,
        postalCode,
        password,
        ...userPayload
      } = superAdmin;

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

      const hashedPassword = await generateHashedPassword(password);

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

      await session.commitTransaction();
      await session.endSession();
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
    }
  }
};
