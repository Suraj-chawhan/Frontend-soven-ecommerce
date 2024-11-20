import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary'; // Cloudinary Upload Widget
import Image from 'next/image';
import { useSession } from 'next-auth/react';

function BannerAdmin() {
  const [bannerPreview, setBannerPreview] = useState(null); // For previewing the uploaded image
  const [banners, setBanners] = useState([]); // List of banners
  const [flag, setFlag] = useState(false); // To trigger banner re-fetch
  const { data: session } = useSession();
  const [jwt, setJwt] = useState("");

  // Set JWT on session load
  useEffect(() => {
    if (session) {
      setJwt(session?.user?.accessToken);
    }
  }, [session]);

  // Fetch banners on mount or when `flag` changes
  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch('/api/admin/banner');
        const data = await response.json();
        setBanners(data); // assuming the response is an array of banner objects
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    }
    fetchBanners();
  }, [flag]);

  // POST banner to backend
  const postBannerToAPI = async (img) => {
    try {
      const response = await fetch('/api/admin/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ img }),
      });

      if (!response.ok) {
        alert("Error uploading banner");
        return;
      }

      const newBanner = await response.json();
      setBanners((prevBanners) => [...prevBanners, newBanner]); // Add new banner to list
      alert('Banner uploaded successfully!');
      setBannerPreview(null); // Reset the preview
      setFlag((v) => !v);
    } catch (error) {
      console.error('Error posting banner:', error);
      alert('Error uploading banner');
    }
  };

  // Handle successful upload from Cloudinary
  const handleUpload = (result) => {
    const uploadedImageUrl = result.info.secure_url;
    setBannerPreview(uploadedImageUrl); // Set the preview for the uploaded image
  };

  // Remove banner
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/admin/banner/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${jwt}` },
      });

      const data = await res.json();
      if (res.ok) {
        setBanners((prevBanners) => prevBanners.filter((banner) => banner._id !== data._id));
        alert('Banner removed successfully!');
      }
    } catch (err) {
      console.error('Error removing banner:', err);
    }
  };

  return (
    <div className="flex">
      {/* Left side: Display banners */}
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Existing Banners</h2>
        <div className="grid grid-cols-1 gap-4">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div key={index} className="border p-2 h-[300px] relative">
                <Image
                  src={banner.img}
                  alt={`Banner ${index + 1}`}
                  width={100}
                  height={300}
                  className="relative w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemove(banner._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No banners available.</p>
          )}
        </div>
      </div>

      {/* Right side: Image upload */}
      <div className="w-1/2 p-4 border-l">
        <h2 className="text-xl font-bold mb-4">Upload Banner</h2>

        {/* Cloudinary Upload Widget */}
        <CldUploadWidget
          uploadPreset="fgl3bmtq"
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={open}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add Image
            </button>
          )}
        </CldUploadWidget>

        {/* Preview uploaded image */}
        {bannerPreview && (
          <div className="mt-4">
            <Image
              src={bannerPreview}
              alt="Preview Banner"
              width={300}
              height={200}
              className="rounded"
            />
            <button
              onClick={() => postBannerToAPI(bannerPreview)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
            >
              Upload Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BannerAdmin;
