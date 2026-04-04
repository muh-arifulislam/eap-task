import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ActivityServices } from "./activity.service";
import httpStatus from "http-status";

const getActivities = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const data = await ActivityServices.getActivities(limit as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Activities is fetched successfully",
    data: data,
  });
});

export const ActivityControllers = { getActivities };
