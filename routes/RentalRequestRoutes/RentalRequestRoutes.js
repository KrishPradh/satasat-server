const express = require('express');
const rentalRequest = express.Router();
const { createRequest, getRentRequests, getRentRequestById, updateRentRequestStatus } = require('../../controller/RentalRequestController/RentalRequestController');

// Route to create a rental request
rentalRequest.post('/createrentalrequest', createRequest);
rentalRequest.get('/getrequest', getRentRequests);
rentalRequest.get("/getrequestbyid/:id", getRentRequestById);
rentalRequest.put("/updatestatus",updateRentRequestStatus);

module.exports = rentalRequest;
