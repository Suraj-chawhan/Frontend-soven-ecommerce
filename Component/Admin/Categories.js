"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import ConfirmationDialog from "../ConfirmRemove";
import Image from "next/image";

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", slug: "", img: "" });
  const [val, setVal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState(null);
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    if (session?.user?.accessToken) {
      setJwt(session.user.accessToken);
    }
  }, [session]);

  useEffect(() => {
    async function fetchCategories() {
      if (!jwt) return;
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [val, jwt]);

  const handleUpload = ({ info }) => {
    const imageUrl = info.secure_url;

    setFormData((prev) => ({ ...prev, img: imageUrl }));
  };

  const handleSubmit = async () => {
    alert(formData.img);
    if (!formData.name || !formData.slug || !formData.img) {
      alert("All fields, including the image, are required.");
      return;
    }
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ name: "", slug: "", img: "" });
        setVal((v) => !v);
        console.log("Category added:", data);
      } else {
        console.error("Failed to add category:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = (category) => {
    setCategoryToRemove(category);
    setIsDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!categoryToRemove) return;
    try {
      const response = await fetch(
        `/api/admin/categories/${categoryToRemove._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      if (response.ok) {
        setCategories((prev) =>
          prev.filter((cat) => cat._id !== categoryToRemove._id)
        );
      } else {
        console.error("Failed to delete category:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const cancelRemove = () => {
    setIsDialogOpen(false);
    setCategoryToRemove(null);
  };

  return (
    <div className="flex p-8 space-x-6 bg-gray-100 min-h-screen">
      {/* Left Section - Categories List */}
      <div className="w-2/3 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Categories{" "}
        </h2>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">Slug: {category.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(category)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <h3 className="text-gray-600">No Categories Added Yet</h3>
        )}
      </div>

      {/* Right Section - Add New Category */}
      <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg text-gray-900">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Category
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 flex">
              Category Name {<p className="text-red-500">*</p>}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 flex">
              Slug {<p className="text-red-500">*</p>}
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Upload Image</label>
            <CldUploadWidget uploadPreset="fgl3bmtq" onSuccess={handleUpload}>
              {({ open }) => (
                <button
                  type="button"
                  onClick={open}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Upload Thumbnail
                </button>
              )}
            </CldUploadWidget>

            {formData.img && (
              <Image
                src={formData.img}
                alt="Uploaded Thumbnail"
                className="mt-4 w-full h-48 object-cover rounded-md"
                width={400}
                height={200}
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        message={`Are you sure you want to delete "${categoryToRemove?.name}"?`}
      />
    </div>
  );
}
