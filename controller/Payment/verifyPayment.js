// const Payment = require('../../models/Payment');

// const verifyKhaltiPayment = async (req, res) => {
//   const { token, amount, paymentId } = req.body;

//   try {
//     const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         token: token,
//         amount: amount * 100, // convert to paisa
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return res.status(400).json({
//         message: 'Payment verification failed with Khalti',
//         error: data,
//       });
//     }

//     if (data.state.name === 'Completed') {
//       const updatedPayment = await Payment.findByIdAndUpdate(
//         paymentId,
//         {
//           status: 'completed',
//           khaltiTransactionId: token,
//         },
//         { new: true }
//       );

//       if (!updatedPayment) {
//         return res.status(404).json({ message: 'Payment not found in DB' });
//       }

//       return res.status(200).json({
//         message: 'Payment verified and completed',
//         payment: updatedPayment,
//       });
//     } else {
//       return res.status(400).json({
//         message: 'Payment not completed yet',
//         khaltiState: data.state.name,
//       });
//     }
//   } catch (error) {
//     console.error('Error verifying Khalti payment:', error.message);
//     return res.status(500).json({
//       message: 'Internal server error during verification',
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   verifyKhaltiPayment,
// };




const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const Payment = require('../../models/Payment');

const verifyKhaltiPayment = async (req, res) => {
  const khaltiToken = req.cookies.khaltiToken;  // Get token from cookies
  const { amount, mobile, khaltiPayload } = req.body;

  if (!khaltiToken) {
    return res.status(400).json({ message: 'Token missing in cookies' });
  }

  try {
    // Step 1: Verify the payment with Khalti
    const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: khaltiToken,  // Send token retrieved from cookies
        amount: amount * 100, // Convert to paisa
      }),
    });

    const data = await response.json();

    // Log the full response to understand the error better
    console.log('Khalti API Response:', data);

    // Step 2: Handle the response
    if (data.status_code === 401) {
      return res.status(401).json({
        message: 'Unauthorized - Invalid token',
        error: data.detail,
        data,
      });
    }

    if (!data.state || !data.state.name) {
      return res.status(400).json({
        message: 'Payment verification failed - unexpected API response structure',
        error: 'Missing or invalid state in Khalti response',
        data,
      });
    }

    // Step 3: If payment is successful, update the payment status in the DB
    if (data.state.name === 'Completed') {
      // Step 4: Update payment status in the database
      const updatedPayment = await Payment.findByIdAndUpdate(
        khaltiPayload.pidx,
        {
          status: 'completed',
          khaltiTransactionId: khaltiToken,
        },
        { new: true }
      );

      if (!updatedPayment) {
        return res.status(404).json({ message: 'Payment not found in DB' });
      }

      return res.status(200).json({
        message: 'Payment verified and completed',
        payment: updatedPayment,
      });
    } else {
      return res.status(400).json({
        message: 'Payment verification failed - payment not completed',
        khaltiState: data.state.name,
      });
    }
  } catch (error) {
    console.error('Error verifying Khalti payment:', error.message);
    return res.status(500).json({
      message: 'Verification failed',
      error: error.message,
    });
  }
};

module.exports = {
  verifyKhaltiPayment,
};
