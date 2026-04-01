import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { RestockQueueServices } from "./restock.sevice";

const getAllRestockQueues = catchAsync(async (req, res) => {
  const data = await RestockQueueServices.getAllRestockQueues();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "RestockQueues data are fetched successfully",
    data: data,
  });
});

export const RestockQueueControllers = { getAllRestockQueues };
