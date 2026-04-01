import { RestockQueue } from "./restock.model";

const getAllRestockQueues = async () => {
  const queues = await RestockQueue.find().populate("product");

  return queues;
};

export const RestockQueueServices = { getAllRestockQueues };
