import { model, Schema } from "mongoose";
import { IActivity } from "./activity.interface";

const activitySchema = new Schema<IActivity>(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Activity = model("Activity", activitySchema);
