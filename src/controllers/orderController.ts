import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { ProtectedRequest } from '../middleware/protect';

// -----------------------------------------------------------------------------
// 1. Add Order Items (Guest Checkout) - Fixed for Images & Guest User
// -----------------------------------------------------------------------------
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    // Log incoming data for debugging
    console.log("Incoming Order Data:", JSON.stringify(req.body, null, 2));

    // Destructure request body
    const { user, orderItems, totalPrice, paymentMethod } = req.body;

    // 1. Validation: User Info (phone is optional)
    if (!user || !user.name || !user.email || !user.address || !user.city || !user.zip) {
      res.status(400).json({ message: 'User information (name, email, address, city, zip) is required' });
      return;
    }

    // 2. Validation: Order Items
    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'Order items cannot be empty' });
      return;
    }

    // 3. Transform Items (Ensure Image & Product ID are correct)
    const transformedItems = orderItems.map((item: any) => ({
      name: item.name,
      qty: item.qty,
      image: item.image, // ✅ Image zaroor save hogi
      price: item.price,
      product: item.product || item._id, // ✅ ID fix
    }));

    // 4. Create Order
    const order = new Order({
      user: user, // ✅ Guest User Object Direct Save
      orderItems: transformedItems,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod || 'Cash',
      isPaid: false,
      isDelivered: false,
      status: 'Processing'
    });

    // 5. Save to DB
    const createdOrder = await order.save();

    // 6. Update Stock (Optional - Fail-safe)
    for (const item of transformedItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { 
          $inc: { stock: -item.qty } 
        }).catch(err => console.log('Stock update ignored:', err.message));
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: createdOrder,
    });

  } catch (error: any) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 3. Get Order By ID
// -----------------------------------------------------------------------------
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
      // Removed populate for now to avoid errors if product is deleted
      // .populate('items.product', 'modelName brand price images');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 4. Get All Orders (Simple Admin View)
// -----------------------------------------------------------------------------
export const getOrders = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 5. Update Order Status (Admin Only) - FIXED & LOGGED ✅
// -----------------------------------------------------------------------------
export const updateOrderStatus = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`[Admin] Updating Order ${id} to status:`, status); // ✅ Debug Log added

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Update Status
    if (status) {
        order.status = status;
    }

    // Handle Delivery Logic
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === 'Processing' || status === 'Shipped') {
      // ✅ Logic: Agar wapis Processing/Shipped kiya to Delivered flag hatao
      order.isDelivered = false;
      order.deliveredAt = undefined;
    }

    const updatedOrder = await order.save();
    
    console.log("Order Saved Successfully:", updatedOrder.status); // ✅ Confirmation Log

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 6. Get All Orders with Pagination (Admin Only) - RESTORED
// -----------------------------------------------------------------------------
export const getAllOrders = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments();

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 8. Delete Order (Admin Only)
// -----------------------------------------------------------------------------
export const deleteOrder = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 9. Update Payment Status (Admin Only)
// -----------------------------------------------------------------------------
export const updatePaymentStatus = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.isPaid = !order.isPaid;
    order.paidAt = order.isPaid ? new Date() : undefined;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// -----------------------------------------------------------------------------
// 10. Get Admin Stats
// -----------------------------------------------------------------------------
export const getAdminStats = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments();
    
    // Revenue Calculation
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};