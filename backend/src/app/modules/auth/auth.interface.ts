export type TLoginUser = {
  email: string;
  password: string;
};

export type TChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
