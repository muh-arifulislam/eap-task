import { Product } from "../product/product.model";
import { IOrderItem } from "./order.interface";
import { Order } from "./order.model";

const createOrder = async (orderData: any) => {
  const { customer, items } = orderData;

  if (!items || items.length === 0) throw new Error("No items provided");

  const seen = new Set<string>();
  let totalPrice = 0;

  for (const item of items as IOrderItem[]) {
    const prodId = item.product.toString();

    // Prevent duplicate products
    if (seen.has(prodId)) throw new Error("Product already added to order");
    seen.add(prodId);

    const product = await Product.findById(prodId);
    if (!product) throw new Error("Product not found");

    if (!product.isActive)
      throw new Error(`Product "${product.name}" is currently unavailable`);

    // Stock check
    if (product.stock < item.quantity)
      throw new Error(
        `Only ${product.stock} units of "${product.name}" available`,
      );

    // Deduct stock
    product.stock -= item.quantity;
    if (product.stock === 0) product.status = "OUT_OF_STOCK";

    await product.save();

    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    customer,
    items,
    totalPrice,
    status: "PENDING",
  });

  return order;
};

// const updateOrderStatus = async (orderId: string, status: IOrder["status"]) => {
//   const order = await Order.findById(orderId);
//   if (!order) throw new Error("Order not found");

//   order.status = status;
//   await order.save();

//   return order;
// };

// const deleteOrder = async (orderId: string) => {
//   const order = await Order.findById(orderId);
//   if (!order) throw new Error("Order not found");

//   // Restore stock if order was confirmed or pending
//   if (["PENDING", "CONFIRMED"].includes(order.status)) {
//     for (const item of order.items) {
//       const product = await Product.findById(item.product);
//       if (product) {
//         product.stock += item.quantity;
//         if (product.stock > 0) product.status = "ACTIVE";
//         await product.save();
//       }
//     }
//   }

//   await Order.findByIdAndDelete(orderId);

//   return { message: "Order deleted successfully" };
// };

// const getOrderById = async (orderId: string) => {
//   const order = await Order.findById(orderId).populate("items.product");
//   if (!order) throw new Error("Order not found");
//   return order;
// };

// const getAllOrders = async () => {
//   const orders = await Order.find()
//     .sort({ createdAt: -1 })
//     .populate("items.product");
//   return orders;
// };

// const getOrdersByMobile = async (mobile: string) => {
//   const orders = await Order.find({ "customer.mobile": mobile })
//     .sort({ createdAt: -1 })
//     .populate("items.product");
//   return orders;
// };

export const OrderServices = {
  createOrder,
};
