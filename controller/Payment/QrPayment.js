import Payment from '../../models/Payment.js';
import { uploadFromRequest } from '../../Cloudinary/Cloudinary.js';
import { createNotification } from '../Notification.controller/notfication.controller.js';

// export const createQrPayment = async (req, res) => {
//   try {
//     const {
//       buyerId,
//       sellerId,
//       bookId,
//       amount,
//       mobile,
//       shippingAddress
//     } = req.body;

//     // Check if file exists in request
//     if (!req.file) {
//       return res.status(400).json({ message: 'Payment slip is required' });
//     }

//     // Use uploadFromRequest which expects the req object
//     const uploadResult = await uploadFromRequest(req, buyerId);

//     const payment = new Payment({
//       buyerId,
//       sellerId,
//       bookId,
//       paymentMethod: 'qr',
//       amount,
//       mobile,
//       shippingAddress,
//       paymentSlip: uploadResult.secure_url,
//       status: 'pending'
//     });

//     await payment.save();
//     return res.status(200).json({
//       success: true,
//       message: "Order placed successfully! Payment verification pending.",
//       payment: savedPayment, // or whatever your payment object is
//     });
//   } catch (err) {
//     console.error('QR Payment error:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };  



export const createQrPayment = async (req, res) => {
  try {
    const {
      buyerId,
      sellerId,
      bookId,
      amount,
      mobile,
      shippingAddress
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment slip is required' });
    }

    const uploadResult = await uploadFromRequest(req, buyerId);

    const payment = new Payment({
      buyerId,
      sellerId,
      bookId,
      paymentMethod: 'qr',
      amount,
      mobile,
      shippingAddress,
      paymentSlip: uploadResult.secure_url,
      status: 'pending'
    });

    const savedPayment = await payment.save(); 

    await createNotification({
          userId: sellerId,    
          bookOwner: buyerId,  
          type: 'Qrpurchase',    
          bookId: bookId,      
        });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully! Payment verification pending.",
      payment: savedPayment,
    });

  } catch (err) {
    console.error('QR Payment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// export const getQrPaymentsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: 'User ID is required.' });
//     }

//     const payments = await Payment.find({
//       paymentMethod: 'qr',
//       $or: [{ buyerId: userId }, { sellerId: userId }],
//     })
//       .populate('bookId', 'title author price bookImage') // only needed fields
//       .populate('buyerId', 'fullName email')
//       .populate('sellerId', 'fullName email')
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       message: 'QR payments fetched successfully.',
//       payments,
//     });

//   } catch (err) {
//     console.error('Get QR payments error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching QR payments.',
//       error: err.message,
//     });
//   }
// };


export const getQrPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const payments = await Payment.find({
      paymentMethod: 'qr',
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate('bookId', 'title author price bookImage') // only needed fields
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'QR payments fetched successfully.',
      payments,
    });

  } catch (err) {
    console.error('Get QR payments error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching QR payments.',
      error: err.message,
    });
  }
};



export const updateQrPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, userId } = req.body;

    // Validate required fields
    if (!paymentId || !status || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment ID, status, and user ID are required.' 
      });
    }

    // Validate status
    if (!['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value.' 
      });
    }

    // Find the payment
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found.' 
      });
    }

    // Check if the user is the seller (only sellers can update status)
    if (payment.sellerId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only the seller can update payment status.' 
      });
    }

    // Update the payment status
    payment.status = status;
    await payment.save();

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}.`,
      payment
    });

  } catch (err) {
    console.error('Update QR payment status error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating QR payment status.',
      error: err.message,
    });
  }
};