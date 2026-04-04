import { Order } from "./order.model";

const PAD_LENGTH = 4; // Length of sequential number

export async function generateOrderId(): Promise<string> {
  try {
    // Get last order
    const lastOrder = await Order.findOne()
      .sort({ createdAt: -1 })
      .select("orderId")
      .lean();

    let lastOrderId = 0;
    if (lastOrder?.orderId) {
      lastOrderId = parseInt(lastOrder.orderId);
    }

    const newOrderId = `${String(lastOrderId + 1).padStart(PAD_LENGTH, "0")}`;
    return newOrderId;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate orderId");
  }
}
