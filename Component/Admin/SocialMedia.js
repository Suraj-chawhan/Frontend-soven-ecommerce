"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

function SocialMedia() {
  const [socialLinks, setSocialLinks] = useState(null);
  const [formData, setFormData] = useState({
    youtube: "",
    facebook: "",
    linkedin: "",
    pinterest: "",
    instagram: "",
    twitter: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    if (session?.user?.accesstoken) {
      setJwt(session?.user?.accesstoken);
    }
  }, [session]);

  // Fetch social media links
  const fetchSocialLinks = async () => {
    try {
      const response = await fetch("/api/admin/social-media");
      const data = await response.json();
      setSocialLinks(data);
      setFormData(data); // Pre-fill form for editing if data exists
    } catch (error) {
      console.error("Error fetching social media links:", error);
    }
  };

  // Handle form submission for creating/updating links
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "/api/admin/social-media";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          youtube: formData.youtube,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          pinterest: formData.pinterest,
          twitter: formData.twitter,
          facebook: formData.facebook,
        }),
      });

      if (response.ok) {
        fetchSocialLinks(); // Refresh data
        setIsEditing(false);
      } else {
        console.error("Error saving social media links");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  // Handle deleting the object
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/admin/social-media", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        setSocialLinks(null);
        setFormData({
          youtube: "",
          facebook: "",
          linkedin: "",
          pinterest: "",
          instagram: "",
          twitter: "",
        });
      } else {
        console.error("Error deleting social media links");
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  // Set editing state
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  if (status === "loading") {
    return <h1>loading</h1>;
  }
  return (
    <div className="flex gap-8 p-4">
      {/* Form Section */}
      <div className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-lg text-gray-500">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Social Media Links" : "Add Social Media Links"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            "youtube",
            "facebook",
            "linkedin",
            "pinterest",
            "instagram",
            "twitter",
          ].map((platform) => (
            <div key={platform} className="flex flex-col">
              <label htmlFor={platform} className="text-lg font-medium">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              <input
                type="url"
                id={platform}
                name={platform}
                value={formData[platform]}
                onChange={(e) =>
                  setFormData({ ...formData, [platform]: e.target.value })
                }
                className="p-2 border rounded"
                placeholder={`Enter ${platform} link`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            {isEditing ? "Update Links" : "Add Links"}
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="w-1/2 text-black-500">
        <h2 className="text-2xl font-bold mb-4">Social Media Links</h2>
        {!socialLinks ? (
          <p>No social media links found.</p>
        ) : (
          <div className="p-4 border rounded-lg shadow-lg">
            <p className="font-medium">
              YouTube: {socialLinks.youtube || "N/A"}
            </p>
            <p className="font-medium">
              Facebook: {socialLinks.facebook || "N/A"}
            </p>
            <p className="font-medium">
              LinkedIn: {socialLinks.linkedin || "N/A"}
            </p>
            <p className="font-medium">
              Pinterest: {socialLinks.pinterest || "N/A"}
            </p>
            <p className="font-medium">
              Instagram: {socialLinks.instagram || "N/A"}
            </p>
            <p className="font-medium">
              Twitter: {socialLinks.twitter || "N/A"}
            </p>
            <div className="flex gap-2 mt-2">
              {!isEditing ? (
                <button
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing((val) => !val)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                >
                  Cancel
                </button>
              )}
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SocialMedia;
