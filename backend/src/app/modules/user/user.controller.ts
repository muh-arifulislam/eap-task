import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const addUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const data = await UserServices.addUserIntoDB(userData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
    data: data,
  });
});

const getUser = catchAsync(async (req, res) => {
  const data = await UserServices.getUserFromDB(req.userEmail);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieved successfully",
    data: data,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.updateUserIntoDB(id! as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  await UserServices.deleteUserFromDB(id! as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User is deleted successfully",
    data: null,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const data = await UserServices.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users data are fetched successfully",
    data: data,
  });
});

export const UserControllers = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
