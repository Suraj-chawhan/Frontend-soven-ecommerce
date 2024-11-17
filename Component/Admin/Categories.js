"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", slug: "", img: "" });
  const [val, setVal] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    }
    fetchCategories();
  }, [val]);

  // Handle Submission
  const handleSubmit = async () => {
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.name, slug: formData.slug, img: formData.img }),
    });

    if (response.ok) {
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setFormData({ name: "", slug: "", img: "" });
      setVal((v) => !v);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Delete a Category
  const handleDelete = async (id) => {
    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.user.accessToken}` },
    });
    setCategories(categories.filter((category) => category._id !== id));
  };

  return (
    <div className="flex p-8 space-x-6 bg-gray-50">
      {/* Left Section - Display Categories */}
      <div className="w-2/3 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Categories List</h2>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(category._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-gray-600">No Categories Added Yet</h3>
        )}
      </div>

      {/* Right Section - Add New Category */}
      <div className="w-1/3 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Category</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className=" text-gray-500  w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className=" text-gray-500 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

      

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
}
