const jwt = require("jsonwebtoken");
const RentRequest = require("../../models/RentalRequest");
const Book = require("../../models/Books");
const { createNotification } = require("../Notification.controller/notfication.controller");

exports.createRequest = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // Verify and decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecretKey"
    );
    const renterUserId = decoded.id; // Extract user ID from token

    // Destructure request body
    const {
      bookId,
      ownerUserId,
      duration,
      totalPrice,
      securityDeposit,
      rentalTerms,
      location,
      phoneNumber,
    } = req.body;

    // Check if the requested book exists
    const getBook = await Book.findById(bookId);
    if (!getBook) {
      return res.status(404).json({ message: "Requested book not found" });
    }

    // Create a new rental request
    const newRequest = new RentRequest({
      renterUserId: renterUserId,
      ownerUserId: ownerUserId,
      bookId: bookId,
      // ownerBookImage: ownerBookImage,
      duration,
      totalPrice,
      securityDeposit,
      rentalTerms,
      location,
      phoneNumber,
      status: "pending",
    });

    await newRequest.save();

    await createNotification({
      userId: ownerUserId, 
      bookOwner: renterUserId, 
      type: "rental_request",
      bookId: bookId,
    });

    res
      .status(201)
      .json({ message: "Rental request sent", request: newRequest });
  } catch (error) {
    console.error("Error sending rental request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getRentRequests = async (req, res) => {
  try {
    const userId = req.query.userId;
    // Validate userId
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Get requests where user is renter (sent) or owner (received)
    const sentRequests = await RentRequest.find({ renterUserId: userId })
      .populate("bookId", "title bookImage")
      .populate("ownerUserId", "name");

    const receivedRequests = await RentRequest.find({ ownerUserId: userId })
      .populate("bookId", "title bookImage  ")
      .populate("renterUserId", "name");

    res.status(200).json({
      success: true,
      sentRequests,
      receivedRequests,
    });
  } catch (error) {
    console.error("Error fetching rent requests:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

exports.getRentRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;

    const rentRequest = await RentRequest.findById(requestId)
      .populate("renterUserId", "name") // Populate renter name
      .populate("ownerUserId", "name") // Populate owner name
      .populate("bookId", "title bookImage"); // Populate book title only

    if (!rentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Rent request not found" });
    }

    res.status(200).json({ success: true, request: rentRequest });
  } catch (error) {
    console.error("Error fetching rent request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateRentRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Missing requestId or status" });
    }

    const rentRequest = await RentRequest.findById(requestId);

    if (!rentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Rent request not found" });
    }

    rentRequest.status = status;


    await rentRequest.save();

    await createNotification({
      userId: rentRequest.renterUserId,             
      bookOwner: rentRequest.ownerUserId,           
      type: `rental_${status}`,                     
      bookId: rentRequest.bookId
    });

    res
      .status(200)
      .json({ success: true, message: `Request updated to ${status}` });
  } catch (error) {
    console.error("Error updating rent request:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
