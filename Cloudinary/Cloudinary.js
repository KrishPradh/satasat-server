// import { v2 as cloudinary } from 'cloudinary';

// // Configuration for Cloudinary
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET // Replace this with your actual API secret
// });

// // Function to upload a file
// const uploadFile = async (filePath, publicId) => {
//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//             public_id: publicId,
//         });
//         console.log('File uploaded successfully:', uploadResult);
//         return uploadResult;
//     } catch (error) {
//         console.log('Error uploading file:', error);
//     }
// };

// // Function to delete a file
// const deleteFile = async (publicId) => {
//     try {
//         const deleteResult = await cloudinary.uploader.destroy(publicId);
//         console.log('File deleted successfully:', deleteResult);
//         return deleteResult;
//     } catch (error) {
//         console.log('Error deleting file:', error);
//     }
// };

// // Export the functions so they can be used in other modules
// export { uploadFile, deleteFile };



import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import fs from 'fs';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Check if Cloudinary configuration exists
if(!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary config not found');
    process.exit(1);
}

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise} - Cloudinary upload result
 */
const uploadFile = async (filePath, folder) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: `/BookExchange/${folder}`
        });
        
        if(!uploadResult) {
            throw new Error('Error uploading file');
        }
        
        return uploadResult;
    } catch (error) {
        console.log("Error on cloudinary:", error);
        throw error;
    }
};

/**
 * Delete a file from Cloudinary
 * @param {string} public_id - Public ID of the file to delete
 * @returns {Promise} - Cloudinary delete result
 */
const deleteFile = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        
        if(!result) {
            throw new Error('Error deleting file');
        }
        
        return result;
    } catch (error) {
        console.log("Error on cloudinary:", error);
        throw error;
    }
};

/**
 * Upload a file from request to Cloudinary
 * @param {object} req - Express request object with file from multer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise} - Cloudinary upload result
 */
const uploadFromRequest = async (req, folder) => {
    try {
        if (!req.file) {
            throw new Error('No file in request');
        }
        
        const filePath = req.file.path;
        const uploadResult = await uploadFile(filePath, folder);
        
        // Remove temporary file after upload
        fs.unlinkSync(filePath);
        
        return uploadResult;
    } catch (error) {
        console.log("Error uploading from request:", error);
        throw error;
    }
};

export { uploadFile, deleteFile, uploadFromRequest };