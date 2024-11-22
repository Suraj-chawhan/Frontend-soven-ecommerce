import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useSession } from "next-auth/react";

function BannerAdmin() {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [banners, setBanners] = useState([]);
  const [flag, setFlag] = useState(false);
  const { data: session } = useSession();
  const [jwt, setJwt] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [description, setDescription] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);

  useEffect(() => {
    if (session) {
      setJwt(session?.user?.accessToken);
    }
  }, [session]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch("/api/admin/banner");
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    }
    fetchBanners();
  }, [flag]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleUpload = (result) => {
    const uploadedImageUrl = result.info.secure_url;
    setBannerPreview(uploadedImageUrl);
  };

  const postBannerToAPI = async (img, categories, description) => {
    try {
      const response = await fetch("/api/admin/banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ img, categories, description }),
      });

      if (!response.ok) {
        alert("Error uploading banner");
        return;
      }

      const newBanner = await response.json();
      setBanners((prevBanners) => [...prevBanners, newBanner]);
      alert("Banner uploaded successfully!");
      resetForm();
    } catch (error) {
      console.error("Error posting banner:", error);
      alert("Error uploading banner");
    }
  };

  const updateBanner = async (id, img, categories, description) => {
    try {
      const response = await fetch(`/api/admin/banner/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ img, categories, description }),
      });

      if (!response.ok) {
        alert("Error updating banner");
        return;
      }

      const updatedBanner = await response.json();
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner._id === id ? { ...banner, ...updatedBanner } : banner
        )
      );
      alert("Banner updated successfully!");
      resetForm();
    } catch (error) {
      console.error("Error updating banner:", error);
      alert("Error updating banner");
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/admin/banner/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (res.ok) {
        setBanners((prevBanners) =>
          prevBanners.filter((banner) => banner._id !== id)
        );
        alert("Banner removed successfully!");
      }
    } catch (err) {
      console.error("Error removing banner:", err);
    }
  };

  const handleEdit = (banner) => {
    setIsEditing(true);
    setEditingBannerId(banner._id);
    setBannerPreview(banner.img);
    setSelectedCategories(banner.categories);
    setDescription(banner.description);
  };

  const resetForm = () => {
    setBannerPreview(null);
    setSelectedCategories("");
    setDescription("");
    setIsEditing(false);
    setEditingBannerId(null);
    setFlag((v) => !v);
  };

  const handleCategorySelect = (event) => {
    setSelectedCategories(event.target.value);
  };

  function call(banner) {
    setSelectedCategories(banner.categories);
    setDescription(banner.description);
    handleEdit(banner);
  }

  return (
    <div className="flex">
      {/* Right side: Display banners */}
      <div className="w-1/2 p-4 border-r">
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

                {!isEditing ? (
                  <button
                    className="absolute bottom-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing((val) => !val)}
                    className="absolute bottom-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No banners available.</p>
          )}
        </div>
      </div>

      {/* Left side: Upload/Edit form */}
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          {isEditing ? "Edit Banner" : "Upload Banner"}
        </h2>
        <select
          onChange={handleCategorySelect}
          value={selectedCategories}
          className="border rounded p-3 text-gray-700 bg-white"
        >
          <option value="">Select Categories</option>
          {categories?.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-3 w-full mt-2 text-gray-500"
        ></textarea>
        <CldUploadWidget uploadPreset="fgl3bmtq" onSuccess={handleUpload}>
          {({ open }) => (
            <button
              type="button"
              onClick={open}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-2"
            >
              {isEditing ? "Replace Image" : "Add Image"}
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
              onClick={() =>
                isEditing
                  ? updateBanner(
                      editingBannerId,
                      bannerPreview,
                      selectedCategories,
                      description
                    )
                  : postBannerToAPI(
                      bannerPreview,
                      selectedCategories,
                      description
                    )
              }
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
            >
              {isEditing ? "Update Banner" : "Upload Image"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BannerAdmin;
