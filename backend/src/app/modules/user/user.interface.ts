import { Types } from "mongoose";

export type TUserRole = "admin" | "manager";

export interface IUser {
  name: string;
  email: string;
  password: string | null;
  role: TUserRole;

  mobile?: string;
  gender?: "male" | "female" | "third";
  address?: Types.ObjectId;
  isDisabled?: boolean;
}

export interface IUserAddress {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

export type IUserPayload = IUser & IUserAddress;
