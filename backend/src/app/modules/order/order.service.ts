import { startSession } from "mongoose";
import { Product } from "../product/product.model";
import { IOrder, IOrderItem } from "./order.interface";
import { Order } from "./order.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { RestockQueue } from "../restock/restock.model";
import { generateOrderId } from "./order.helper";
import { Activity } from "../activity/activity.model";
import { Request } from "express";
import { User } from "../user/user.model";

const createOrder = async (req: Request) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { customer, items } = req.body;

    if (!items || items.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No items provided");
    }

    const seen = new Set<string>();
    let totalPrice = 0;

    await Promise.all(
      items.map(async (item: IOrderItem) => {
        const prodId = item.product.toString();

        if (seen.has(prodId)) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Product already added to order",
          );
        }

        seen.add(prodId);

        const product = await Product.findById(prodId).session(session);

        if (!product) {
          throw new AppError(httpStatus.NOT_FOUND, "Product not found");
        }

        if (!product.isActive) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Product "${product.name}" is currently unavailable`,
          );
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Only ${product.stock} units of "${product.name}" available`,
          );
        }

        // Deduct stock
        product.stock -= item.quantity;

        if (product.stock === 0) {
          product.status = "OUT_OF_STOCK";
        }

        // Restock alert
        if (product.stock <= product.minStock) {
          let priority: "HIGH" | "MEDIUM" | "LOW" = "LOW";

          const ratio = product.stock / product.minStock;

          if (ratio <= 0.3) priority = "HIGH";
          else if (ratio <= 0.7) priority = "MEDIUM";

          const existingQueue = await RestockQueue.findOne({
            product: product._id,
          }).session(session);

          const priorityRank = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
          };

          if (!existingQueue) {
            await RestockQueue.create(
              [
                {
                  product: product._id,
                  priority,
                },
              ],
              { session },
            );

            await Activity.create(
              [{ message: `Product “${product.name}” added to Restock Queue` }],
              { session },
            );
          } else {
            // update only if new priority is higher
            if (priorityRank[priority] > priorityRank[existingQueue.priority]) {
              existingQueue.priority = priority;
              await existingQueue.save({ session });

              await Activity.create(
                [
                  {
                    message: `Product “${product.name}” now has ${priority} priority in Restock Queue`,
                  },
                ],
                { session },
              );
            }
          }
        }

        await product.save({ session });

        totalPrice += product.price * item.quantity;
      }),
    );

    const orderId = await generateOrderId();

    const order = await Order.create(
      [
        {
          orderId,
          customer,
          items,
          totalPrice,
          status: "PENDING",
        },
      ],
      { session },
    );

    await Activity.create(
      [
        {
          message: `Order #${orderId} created by ${req.user.name}`,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return order[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      err?.message ?? "Something went wrong...!",
    );
  }
};

const updateOrderStatus = async (orderId: string, status: IOrder["status"]) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    // If cancelling order → restore stock
    if (
      status === "CANCELLED" &&
      ["PENDING", "CONFIRMED"].includes(order.status)
    ) {
      await Promise.all(
        order.items.map(async (item: IOrderItem) => {
          const product = await Product.findById(item.product).session(session);
          if (!product) return;

          product.stock += item.quantity;

          if (product.stock > 0) {
            product.status = "IN_STOCK";
          }

          const existingQueue = await RestockQueue.findOne({
            product: product._id,
          }).session(session);

          // Check if product stock is now above minStock → remove restock queue
          if (product.stock > product.minStock) {
            if (existingQueue) {
              await existingQueue.deleteOne({ session });
            }
          }
          // Restock Queue Update
          else {
            let priority: "HIGH" | "MEDIUM" | "LOW" = "LOW";

            const ratio = product.stock / product.minStock;

            if (ratio <= 0.3) priority = "HIGH";
            else if (ratio <= 0.7) priority = "MEDIUM";

            const existingQueue = await RestockQueue.findOne({
              product: product._id,
            }).session(session);

            const priorityRank = {
              LOW: 1,
              MEDIUM: 2,
              HIGH: 3,
            };

            if (!existingQueue) {
              await RestockQueue.create(
                [
                  {
                    product: product._id,
                    priority,
                  },
                ],
                { session },
              );
            } else {
              if (
                priorityRank[priority] !== priorityRank[existingQueue.priority]
              ) {
                existingQueue.priority = priority;
                await existingQueue.save({ session });
              }
            }
          }

          await product.save({ session });
        }),
      );
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return order;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      err?.message ?? "Something went wrong...!",
    );
  }
};

const deleteOrder = async (orderId: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    // Restore stock if order was pending or confirmed
    if (["PENDING", "CONFIRMED"].includes(order.status)) {
      await Promise.all(
        order.items.map(async (item: IOrderItem) => {
          const product = await Product.findById(item.product).session(session);

          if (!product) return;

          product.stock += item.quantity;

          if (product.stock > 0) {
            product.status = "IN_STOCK";
          }

          const existingQueue = await RestockQueue.findOne({
            product: product._id,
          }).session(session);

          // Check if product stock is now above minStock → remove restock queue
          if (product.stock > product.minStock) {
            if (existingQueue) {
              await existingQueue.deleteOne({ session });
            }
          } else {
            let priority: "HIGH" | "MEDIUM" | "LOW" = "LOW";

            const ratio = product.stock / product.minStock;

            if (ratio <= 0.3) priority = "HIGH";
            else if (ratio <= 0.7) priority = "MEDIUM";

            const existingQueue = await RestockQueue.findOne({
              product: product._id,
            }).session(session);

            const priorityRank = {
              LOW: 1,
              MEDIUM: 2,
              HIGH: 3,
            };

            if (!existingQueue) {
              await RestockQueue.create(
                [
                  {
                    product: product._id,
                    priority,
                  },
                ],
                { session },
              );
            } else {
              // update only if new priority is changed
              if (
                priorityRank[priority] !== priorityRank[existingQueue.priority]
              ) {
                existingQueue.priority = priority;
                await existingQueue.save({ session });
              }
            }
          }

          await product.save({ session });
        }),
      );
    }

    await Order.findByIdAndDelete(orderId).session(session);

    await session.commitTransaction();
    await session.endSession();

    return { message: "Order deleted successfully" };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      err?.message ?? "Something went wrong...!",
    );
  }
};

const getOrderById = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("items.product");
  if (!order) throw new Error("Order not found");
  return order;
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("items.product");
  return orders;
};

export const OrderServices = {
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getAllOrders,
};
