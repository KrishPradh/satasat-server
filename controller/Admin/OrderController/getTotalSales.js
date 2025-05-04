// controllers/adminController.js (or similar)
const Order = require('../../../models/Admin/order');

exports.getOverallSales = async (req, res) => {
  try {
    // Filter only completed payments
    const completedOrders = await Order.find({ paymentStatus: 'completed' });

    // Sum up totalAmount from all completed orders
    const totalSales = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({ totalSales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
