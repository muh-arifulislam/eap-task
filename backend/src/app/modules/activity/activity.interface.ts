import { Types } from "mongoose";

export interface IActivity {
  message: string;
  user?: Types.ObjectId;
}
