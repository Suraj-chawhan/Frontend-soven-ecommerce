// next.config.js
module.exports = {
    images: {
      domains: ['res.cloudinary.com'], // Allow Cloudinary images
    },
    reactStrictMode: true,
    experimental: {
      appDir: true, // Ensure app directory is enabled
    },
  };
  