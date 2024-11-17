import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (imagePath) => {
  try {
    console.log("Starting image upload to Cloudinary...");
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: 'products', // Folder for organizing images
      use_filename: true,
      unique_filename: false,
    });
    console.log("Upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
