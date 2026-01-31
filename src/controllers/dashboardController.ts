import { Response } from 'express';
import { ProtectedRequest } from '../middleware/protect';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

/**
 * Admin Dashboard Statistics
 * Get comprehensive analytics data for admin dashboard
 */
export const getDashboardStats = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin can access dashboard stats' });
      return;
    }

    // 1. Calculate total revenue (sum of all paid orders)
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 2. Count total orders
    const totalOrders = await Order.countDocuments();

    // 3. Count total users
    const totalUsers = await User.countDocuments();

    // 4. Get top 5 best-selling products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 1,
          brand: '$productDetails.brand',
          modelName: '$productDetails.modelName',
          price: '$productDetails.price',
          images: { $arrayElemAt: ['$productDetails.images', 0] },
          totalQuantitySold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // 5. Additional stats: Recent orders count, pending orders
    const recentOrdersCount = await Order.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    });

    const pendingOrders = await Order.countDocuments({
      orderStatus: 'processing',
    });

    // 6. Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          orders: 1,
        },
      },
    ]);

    res.status(200).json({
      summary: {
        totalRevenue,
        totalOrders,
        totalUsers,
        recentOrdersCount,
        pendingOrders,
      },
      topProducts,
      revenueByMonth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

/**
 * Get order statistics
 * Breakdown by order status
 */
export const getOrderStats = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin can access order stats' });
      return;
    }

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const ordersByPaymentStatus = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      ordersByStatus,
      ordersByPaymentStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};
