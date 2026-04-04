import { IActivity } from "./activity.interface";
import { Activity } from "./activity.model";

const logActivity = async (payload: IActivity) => {
  const res = await Activity.create(payload);

  return res;
};

const getActivities = async (limit: string) => {
  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) || 10);

  return activities;
};

export const ActivityServices = { logActivity, getActivities };
