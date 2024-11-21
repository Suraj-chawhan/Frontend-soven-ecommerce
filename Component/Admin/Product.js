"use client";

import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import ConfirmationDialog from "../ConfirmRemove";
function Product() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizes, setSizes] = useState(""); // JSON input for sizes
  const [colors, setColors] = useState(""); // JSON input for colors
  const [thumbnail, setThumbnail] = useState(null);
  const [sideImages, setSideImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productAsync, setProductAsync] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [moreInformation, setMoreInformation] = useState("");
  const [returnExchange, setReturnExchange] = useState("");
  const [description, setDescription] = useState("");
  const handleRemoveClick = (product) => {
    setProductToRemove(product);
    setIsDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!productToRemove) return;
    try {
      await fetch(`/api/admin/products/${productToRemove._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productToRemove._id)
      );
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error removing product:", error);
      alert("Failed to remove the product.");
    } finally {
      setProductToRemove(null);
    }
  };

  const cancelRemove = () => {
    setIsDialogOpen(false);
    setProductToRemove(null);
  };

  const handleCategorySelect = (event) => {
    const selected = event.target.value;

    setSelectedCategories(selected);
  };

  const handleUpload =
    (type) =>
    ({ info }) => {
      const imageUrl = info.secure_url;
      if (type === "thumbnail") {
        setThumbnail(imageUrl);
      } else if (type === "sideview") {
        setSideImages((prevImages) => [...prevImages, imageUrl]);
      }
    };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();

    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();

        data ? setCategories(data) : setCategories([]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchCategories();
  }, [productAsync]);

  const handleSubmit = async () => {
    let parseSize = [];
    let parseColors = [];

    try {
      if (sizes) {
        parseSize = JSON.parse(sizes);
      }
      if (colors) {
        parseColors = JSON.parse(colors);
      }
    } catch (error) {
      alert("Invalid JSON input for sizes or colors. Please check your input.");
      return;
    }

    try {
      const method = selectedProduct ? "PUT" : "POST";
      const endpoint = selectedProduct
        ? `/api/admin/products/${selectedProduct._id}`
        : "/api/admin/products";

      const response = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          sizes: parseSize,
          colors: parseColors,
          title,
          quantity,
          slug,
          price,
          thumbnail,
          sideImages,
          categories: selectedCategories,
          description,
          moreInformation,
          returnExchange,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert(
          selectedProduct
            ? "Product updated successfully"
            : "Product submitted successfully"
        );
        setTitle("");
        setSlug("");
        setPrice("");
        setQuantity("");
        setSizes("");
        setColors("");
        setThumbnail(null);
        setSideImages([]);
        setSelectedCategories("");
        setReturnExchange("");
        setDescription("");
        setMoreInformation("");
        setProductAsync((v) => !v);
      } else {
        const error = await response.json();
        alert("Error submitting product: " + error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  };

  function call(product) {
    setSelectedProduct(product);
    setTitle(product.title);
    setSlug(product.slug);
    setPrice(product.price);
    setQuantity(product.quantity);
    product.colors ? setColors(JSON.stringify(product.colors)) : setColors("");
    product.sizes ? setSizes(JSON.stringify(product.sizes)) : setSizes("");
    setThumbnail(product.thumbnail);
    setSideImages(product.sideImages);
    setSelectedCategories(product.categories);
    setReturnExchange(product.moreInformation);
    setDescription(product.description);
    setMoreInformation(product.returnExchange);
  }

  function Back() {
    setSelectedProduct(null);
    setTitle("");
    setSlug("");
    setPrice("");
    setQuantity("");
    setSizes("");
    setColors("");
    setThumbnail(null);
    setSideImages([]);
    setSelectedCategories("");
    setReturnExchange("");
    setDescription("");
    setMoreInformation("");
  }

  return (
    <div className="admin-panel p-6 bg-gray-100 rounded-lg shadow-lg max-w-7xl mx-auto flex gap-8 text-gray-700">
      {/* Product List */}
      <div className="product-list w-2/3 bg-white p-6 rounded-lg shadow-md overflow-y-auto h-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Product List
        </h2>
        {products?.length ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg mb-4 shadow-sm transition"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.thumbnail || "/placeholder.png"}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="rounded-md border"
                />
                <div>
                  <h3 className="font-medium text-lg text-gray-900">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Price: ${product.price}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow transition"
                  onClick={() => call(product)}
                >
                  Update
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow transition"
                  onClick={() => handleRemoveClick(product)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available.</p>
        )}
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
          message={`Are you sure you want to remove "${productToRemove?.title}"?`}
        />
      </div>

      {/* Product Form */}
      <div className="product-form w-1/3 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {selectedProduct ? "Edit Product" : "Add Product"}
          </h1>
          {selectedProduct && (
            <button
              onClick={Back}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border transition"
            >
              Back
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Title"
            required
            className="border rounded p-3 text-gray-700"
          />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Product Slug"
            required
            className="border rounded p-3 text-gray-700"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
            className="border rounded p-3 text-gray-700"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            required
            className="border rounded p-3 text-gray-700"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="border rounded p-3 text-gray-700"
          />
          <input
            type="text"
            value={returnExchange}
            onChange={(e) => setReturnExchange(e.target.value)}
            placeholder="Return exchange"
            required
            className="border rounded p-3 text-gray-700"
          />
          <input
            type="text"
            value={moreInformation}
            onChange={(e) => setMoreInformation(e.target.value)}
            placeholder="More information"
            required
            className="border rounded p-3 text-gray-700"
          />
          {/* Sizes and Colors */}
          <textarea
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder='Enter Sizes as JSON, e.g., [{"size":"M","enabled":true}]'
            className="border rounded p-3 text-gray-700"
          ></textarea>
          <textarea
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder='Enter Colors as JSON, e.g., [{"color":"Red","hex":"#FF0000"}]'
            className="border rounded p-3 text-gray-700"
          ></textarea>

          {/* Image Upload */}
          <CldUploadWidget
            uploadPreset="fgl3bmtq"
            onSuccess={handleUpload("thumbnail")}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={open}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Upload Thumbnail
              </button>
            )}
          </CldUploadWidget>
          <CldUploadWidget
            uploadPreset="fgl3bmtq"
            onSuccess={handleUpload("sideview")}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={open}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Upload Side Images
              </button>
            )}
          </CldUploadWidget>

          {/* Categories */}
          <select
            onChange={handleCategorySelect}
            className="border rounded p-3 text-gray-700 bg-white"
          >
            <option value="">Select Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
          >
            {selectedProduct ? "Update Product" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
