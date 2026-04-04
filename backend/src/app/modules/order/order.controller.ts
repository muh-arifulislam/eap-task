import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const data = await OrderServices.createOrder(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order is created successfully",
    data: data,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  const data = await OrderServices.updateOrderStatus(orderId as string, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status is updated successfully",
    data: data,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const data = await OrderServices.deleteOrder(orderId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order is deleted successfully",
    data: data,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const data = await OrderServices.getOrderById(orderId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order data is fetched successfully",
    data: data,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const data = await OrderServices.getAllOrders();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders data are fetched successfully",
    data: data,
  });
});

export const OrderControllers = {
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrder,
  getAllOrders,
};
