import { Request, Response } from "express";
import { Order } from "../modules/order/order.model";
import { Product } from "../modules/product/product.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Total orders today
    const totalOrdersToday = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    // Completed orders
    const completedOrders = await Order.countDocuments({
      status: "Completed",
    });

    // Revenue today
    const revenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const revenueToday =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Low stock products
    const lowStockItems = await Product.countDocuments({
      stock: { $lte: 5 },
    });

    // Product summary
    const productSummary = await Product.find()
      .select("name stock")
      .limit(5)
      .lean();

    const formattedProducts = productSummary.map((p) => ({
      name: p.name,
      stock: p.stock,
      status: p.stock <= 5 ? "Low Stock" : "OK",
    }));

    res.json({
      success: true,
      data: {
        totalOrdersToday,
        pendingOrders,
        completedOrders,
        revenueToday,
        lowStockItems,
        productSummary: formattedProducts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
