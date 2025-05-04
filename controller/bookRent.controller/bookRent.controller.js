const Book = require('../../models/Books');

exports.getRentBooks = async (req, res) => {
    try {
        const books = await Book.find({ bookPurpose: 'Rent' }).populate("user","name");
        

        if(!books){
            return res.status(404).json({ message: 'books not available' });
        }
        res.status(200).json({message:'book exchange fetched',books});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
