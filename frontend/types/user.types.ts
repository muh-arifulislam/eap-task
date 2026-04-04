export type TUserRole = "admin" | "manager";
export interface UserAddress {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

export type TGender = "male" | "female" | "third";

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string | null;
  role: TUserRole;

  mobile?: string;
  gender?: TGender;
  address?: UserAddress;
  isDisabled?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: TUserRole;

  mobile?: string;
  gender?: TGender;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}
