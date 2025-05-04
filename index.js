const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./connectDb');
const { signupRoute } = require('./routes/LoginSignup/signupRoute');
const { loginRoute } = require('./routes/LoginSignup/loginRoute');
const { bookRoute } = require('./routes/bookRoutes/bookRoute');
const cookieParser = require('cookie-parser');
const getAllBookRouter = require('./routes/bookRoutes/getAllBookRoute');
const bookExchangerouter = require('./routes/exchangeBookRoutes/exchangeBook');
const singleBookrouter = require('./routes/singleBookRouter/singleBookRouter');
const bookRentrouter = require('./routes/rentBookRoutes/rentBook');
const bookBuySellrouter = require('./routes/buysellBookRoutes/buysellBooks');
const ExchangeRequestRoutes = require('./routes/ExchangeRequestRoutes/ExchangeRequestRoutes');
const ProfileRoute = require('./routes/ProfileRoutes/ProfileRoutes');
const rentalRequest = require('./routes/RentalRequestRoutes/RentalRequestRoutes');
const BuySellRequestrouter = require('./routes/BuySellRequestRoutes/BuySellRequestRoutes');
const Profilerouter = require('./routes/ProfileRoutes/ProfileRoutes');
const logoutRouter = require('./routes/logoutRoutes/logoutRoutes');
const feedBackrouter = require('./routes/feedBackRoutes/feedBackRoutes');
const userPostRouter = require('./routes/getUserPostRoutes/getUserPostRoutes');
const cartRouter = require('./routes/cartRoutes/cartRoutes.js');
const paymentRouter = require('./routes/paymentRoutes/paymentRoutes.js');
// const { loginAdmin } = require('./controller/adminLogin/adminLogin.js');
// const adminRouter = require('./routes/AdminRoutes/adminLogin/adminLoginRoutes.js');
const verifypaymentRouter = require('./routes/paymentRoutes/verifyPaymentRoutes.js');
const codRouter = require('./routes/paymentRoutes/codRoutes.js');
const adminRouter = require('./routes/Admin/adminLogin/adminLoginRoutes.js');
const { adminbookRoute } = require('./routes/Admin/adminBooksRoutes/adminBooksRoutes.js');
const singleAdminBookrouter = require('./routes/Admin/adminSingleBooksRoutes/adminSingleBooksRoutes.js');
const orderRouter = require('./routes/Admin/ordersRoutes/ordersRoutes.js');
const orderHistoryRouter = require('./routes/Admin/orderHistoryRoutes/orderHistoryRoutes.js');
const codadminRouter = require('./routes/Admin/ordersRoutes/codordersRoutes.js');
const qrPaymentRouter = require('./routes/paymentRoutes/qrPaymentRoutes.js');
const notificationRouter = require('./routes/notificationRoutes/notificationRoutes.js');
const adminNotificationRouter = require('./routes/Admin/adminNotificationRoutes/adminNotificationRoutes.js');
const forgotPasswordRouter = require('./routes/LoginSignup/forgotPasswordRoutes.js');
const totalSalesRouter = require('./routes/Admin/ordersRoutes/getOverallSalesRoutes.js');
// const { adminbookRoute } = require('./routes/AdminRoutes/adminBooksRoutes/adminBooksRoutes.js');
require('dotenv').config();

dbConnection();

const app = express();

// Middleware
app.use(cors({  
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', signupRoute);
app.use('/api', loginRoute);
app.use('/api', logoutRouter);
app.use('/api/forgot', forgotPasswordRouter);
app.use('/api', bookRoute,getAllBookRouter);
app.use('/api/singlebook', singleBookrouter);
app.use('/api/exchange', bookExchangerouter);
app.use('/api/rent', bookRentrouter);
app.use("/api/ExchangeRequest", ExchangeRequestRoutes);
app.use("/api/rentrequest", rentalRequest);
app.use("/api/buysellrequest", BuySellRequestrouter);
app.use('/api/buysell', bookBuySellrouter);
app.use('/api/user', Profilerouter);
app.use('/api/post', userPostRouter);
app.use('/api/feedback', feedBackrouter);
app.use('/api/cart', cartRouter);
// app.use('/api/payments', paymentRouter);
// app.use('/api/verify', verifypaymentRouter);
app.use('/api/codpayment', codRouter);
app.use('/api/qrpayment', qrPaymentRouter);
app.use('/api/notification', notificationRouter);

// Admin
app.use('/api/admin', adminRouter);
app.use('/api/admin', adminbookRoute);
app.use('/api/admin', singleAdminBookrouter);
app.use('/api/payment', orderRouter);
app.use('/api/order', orderHistoryRouter);
app.use('/api/admin', codadminRouter);
app.use('/api/admin', adminNotificationRouter);
app.use('/api/admin', totalSalesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// // index.js
// const express = require('express');
// const http = require('http'); // Use http server for Socket.IO
// const cors = require('cors');
// const path = require('path');
// const { dbConnection } = require('./connectDb');
// const { signupRoute } = require('./routes/LoginSignup/signupRoute');
// const { loginRoute } = require('./routes/LoginSignup/loginRoute');
// const { bookRoute } = require('./routes/bookRoutes/bookRoute');
// const cookieParser = require('cookie-parser');
// const getAllBookRouter = require('./routes/bookRoutes/getAllBookRoute');
// const bookExchangerouter = require('./routes/exchangeBookRoutes/exchangeBook');
// const singleBookrouter = require('./routes/singleBookRouter/singleBookRouter');
// const bookRentrouter = require('./routes/rentBookRoutes/rentBook');
// const bookBuySellrouter = require('./routes/buysellBookRoutes/buysellBooks');
// const ExchangeRequestRoutes = require('./routes/ExchangeRequestRoutes/ExchangeRequestRoutes');
// const ProfileRoute = require('./routes/ProfileRoutes/ProfileRoutes');
// const rentalRequest = require('./routes/RentalRequestRoutes/RentalRequestRoutes');
// const BuySellRequestrouter = require('./routes/BuySellRequestRoutes/BuySellRequestRoutes');
// const Profilerouter = require('./routes/ProfileRoutes/ProfileRoutes');
// const logoutRouter = require('./routes/logoutRoutes/logoutRoutes');
// const feedBackrouter = require('./routes/feedBackRoutes/feedBackRoutes');
// const userPostRouter = require('./routes/getUserPostRoutes/getUserPostRoutes');
// const cartRouter = require('./routes/cartRoutes/cartRoutes.js');
// const Message = require('../Backend/models/Message.js'); // Import the message model
// const socketIo = require('socket.io'); // Import socket.io
// const chatRouter = require('./routes/messageRoutes/messageRoutes.js');

// require('dotenv').config();

// dbConnection();

// const app = express();

// // Creating the HTTP server to allow Socket.IO to work
// const server = http.createServer(app);

// // Initialize Socket.IO with the HTTP server
// const io = socketIo(server, {
//   cors: {
//     origin: "*", // Allowing all origins, you can restrict it later
//   }
// });

// // Middleware
// app.use(cors({  
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));

// // Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api', signupRoute);
// app.use('/api', loginRoute);
// app.use('/api', logoutRouter);
// app.use('/api', bookRoute, getAllBookRouter);
// app.use('/api/singlebook', singleBookrouter);
// app.use('/api/exchange', bookExchangerouter);
// app.use('/api/rent', bookRentrouter);
// app.use("/api/ExchangeRequest", ExchangeRequestRoutes);
// app.use("/api/rentrequest", rentalRequest);
// app.use("/api/buysellrequest", BuySellRequestrouter);
// app.use('/api/buysell', bookBuySellrouter);
// app.use('/api/user', Profilerouter);
// app.use('/api/post', userPostRouter);
// app.use('/api/feedback', feedBackrouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/chat', chatRouter);

// // Handle Socket.IO real-time chat
// io.on("connection", (socket) => {
//   console.log("User connected");

//   socket.on("sendMessage", async (data) => {
//     const { text, sender, receiver } = data;

//     // Save message to the database
//     const newMessage = new Message({ sender, receiver, text });
//     await newMessage.save();

//     // Emit the message to both users
//     io.to(receiver).emit("receiveMessage", { sender, text });
//     io.to(sender).emit("receiveMessage", { sender, text });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// // Set the port and listen for connections
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
