const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err.message));
};

module.exports = { dbConnection };
