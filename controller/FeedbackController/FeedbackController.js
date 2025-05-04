// const Feedback = require('../../models/Feedback');

// exports.submitFeedback = async (req, res) => {
//     try {
//         const { name, email, message } = req.body;

//         if (!name || !email || !message) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         const newFeedback = new Feedback({ name, email, message });
//         await newFeedback.save();

//         res.status(201).json({ message: 'Feedback submitted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: 'Server error while submitting feedback' });
//     }
// };

// exports.getAllFeedback = async (req, res) => {
//     try {
//         const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//         res.status(200).json(feedbacks);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error while fetching feedbacks' });
//     }
// };



// const Feedback = require('../../models/Feedback');

// exports.submitFeedback = async (req, res) => {
//     try {
//         const { name, email, message, rating } = req.body;

//         if (!name || !email || !message || rating === undefined) {
//             return res.status(400).json({ error: 'All fields including rating are required' });
//         }

//         // Ensure rating is within valid range
//         if (rating < 1 || rating > 5) {
//             return res.status(400).json({ error: 'Rating must be between 1 and 5' });
//         }

//         const newFeedback = new Feedback({ name, email, message, rating });
//         await newFeedback.save();

//         res.status(201).json({ message: 'Feedback submitted successfully' });
//     } catch (err) {
//         console.error('Feedback submission error:', err);
//         res.status(500).json({ error: 'Server error while submitting feedback' });
//     }
// };




const Feedback = require('../../models/Feedback');
const User = require('../../models/User'); // Import User model

exports.submitFeedback = async (req, res) => {
    try {
        const { userId, message, rating } = req.body;

        if (!userId || !message || rating === undefined) {
            return res.status(400).json({ error: 'All fields including rating are required' });
        }

        // Ensure rating is within valid range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Fetch user to get their details and ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new feedback with user reference
        const newFeedback = new Feedback({
            name: user._id, // Reference to User _id (not a string name)
            email: user.email, // Email is stored as the reference in the schema
            message,
            rating,
        });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Feedback submission error:', err);
        res.status(500).json({ error: 'Server error while submitting feedback' });
    }
};



// exports.getAllFeedback = async (req, res) => {
//     try {
//         const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//         res.status(200).json(feedbacks);
//     } catch (err) {
//         console.error('Fetch feedback error:', err);
//         res.status(500).json({ error: 'Server error while fetching feedbacks' });
//     }
// };

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate("name", "name email")  // Populate 'name' with 'name' and 'email' fields from User model
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, feedbacks });
    } catch (err) {
        console.error('Fetch feedback error:', err);
        res.status(500).json({ error: 'Server error while fetching feedbacks' });
    }
};

