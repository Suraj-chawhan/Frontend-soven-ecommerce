

import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary'; // Assuming you're using Next.js Cloudinary SDK
import Image from 'next/image';

import { useSession } from 'next-auth/react';
function BannerAdmin() {
  const [banner, setBanner] = useState(null);
  const [banners, setBanners] = useState([]);
  const[flag,setFlag]=useState(false)
  const{data:session}=useSession()
  const[jwt,setJwt]=useState("")
  // Fetch banners on component mount



  useEffect(()=>{
   if(session){
    setJwt(session?.user?.accessToken)
   } 
  },[session])
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

  // Handle upload success
  const handleUpload = (result) => {

    const uploadedImageUrl = result.info.secure_url;
   alert(uploadedImageUrl)
    // Update the state with the uploaded image URL
    setBanner(uploadedImageUrl);

    // Now, post this image URL to the backend to save it
    postBannerToAPI(uploadedImageUrl);
  };

  // Post banner to backend
  const postBannerToAPI = async (img) => {
    try {
      const response = await fetch('/api/admin/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization":`Bearer ${jwt}`
        },
        body: JSON.stringify({ img }),
      });
    if(!response.ok){
      alert("Error in upload")
      return
    }
    
        const newBanner = await response.json();
        setBanners((prevBanners) => [...prevBanners, newBanner]); // Add new banner to list
        alert('Banner uploaded successfully!');
    
    } catch (error) {
      console.error('Error posting banner:', error);
      alert('Error uploading banner');
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
              <div key={index} className="border p-2 h-[300px]">
              <Image
              src={banner.img} // Assuming 'banner.img' contains the image URL
              alt={`Banner ${index + 1}`}
              width={100}
              height={300}
              
              className="relative w-full h-full" // Set the parent container's size
           
              objectFit="cover" // Ensures the image covers the area without distortion
               />

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
              Upload Banner Image
            </button>
          )}
        </CldUploadWidget>

      </div>
    </div>
  );
}

export default BannerAdmin;
