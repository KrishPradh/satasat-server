const express = require('express');
const feedBackrouter = express.Router();
const {
    submitFeedback,
    getAllFeedback,
    // getUserById
} = require('../../controller/FeedbackController/FeedbackController');

// POST /api/feedback
feedBackrouter.post('/submitFeedback', submitFeedback);

// GET /api/feedback
feedBackrouter.get('/getAllFeedback', getAllFeedback);
// feedBackrouter.get('/getAllFeedback', getUserById);

module.exports = feedBackrouter;
