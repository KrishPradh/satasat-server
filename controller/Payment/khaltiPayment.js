// const dotenv = require("dotenv");
// dotenv.config();
// const fetch = require("node-fetch");

// const khaltipayment = async (req, res) => {
//     const { id, name, amount, bookId } = req.body;
    
//     // Convert amount to paisa (1 NPR = 100 paisa)
//     // Make sure this is an integer
//     const amountInPaisa = Math.round(parseFloat(amount) * 100);
    
//     try {
//         const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
//             method: "POST",
//             headers: {
//                 Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 return_url: process.env.KHALTI_RETURN_URL || "http://localhost:3000/success",
//                 website_url: process.env.WEBSITE_URL || "http://localhost:3000/success",
//                 amount: amountInPaisa,
//                 purchase_order_id: id,
//                 purchase_order_name: name,
//                 // You might need additional required fields
//             }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Khalti API error:", errorData);
//             return res.status(response.status).json({
//                 success: false,
//                 message: errorData.detail || errorData.error || "Error initiating payment with Khalti.",
//             });
//         }
        
//         const data = await response.json();
//         return res.status(200).json({
//             success: true,
//             message: data.payment_url,
//         });
//     } catch (error) {
//         console.error("Payment processing error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "An unexpected error occurred",
//         });
//     }
// };

// module.exports = { khaltipayment };


// const khaltipayment = async (req, res) => {
//     const { id, name, amount, bookId, userId, mobile } = req.body;

//     const amountInPaisa = Math.round(parseFloat(amount) * 100);

//     try {
//         const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
//             method: "POST",
//             headers: {
//                 "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 return_url: process.env.KHALTI_RETURN_URL || "http://localhost:3000/success",
//                 website_url: process.env.WEBSITE_URL || "http://localhost:3000",
//                 amount: amountInPaisa,
//                 purchase_order_id: id,
//                 purchase_order_name: name,
//             }),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             console.error("Khalti API error:", data);
//             return res.status(response.status).json({
//                 success: false,
//                 message: data.detail || data.error || "Error initiating payment with Khalti.",
//             });
//         }

//         // Save payment record to database
//         const payment = new Payment({
//             buyerId: userId,  // Changed from userId to buyerId to match schema
//             sellerId: "default_seller_id", // You need to provide a seller ID
//             bookId: bookId || null,
//             transactionId: data.pidx,
//             amount: amountInPaisa,
//             status: 'pending',
//             mobile: mobile,
//             shippingAddress: {}, // You need to provide shipping address
//             payload: data,
//         });

//         await payment.save();

//         return res.status(200).json({
//             success: true,
//             payment_url: data.payment_url, // Changed from message to payment_url for clarity
//             pidx: data.pidx // Include pidx for reference
//         });
//     } catch (error) {
//         console.error("Payment processing error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "An unexpected error occurred",
//         });
//     }
// };

// module.exports = { khaltipayment };