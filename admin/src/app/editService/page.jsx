"use client";
import React, { useState, useEffect, Suspense } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import uploadImage from "@/app/lib/api/uploadImage";

const EditServicePage = () => {
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchService(token);
    }
  }, [router, serviceId]);

  const fetchService = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      const { name, description, startingPrice, imageUrl } = response.data;
      setServiceName(name);
      setServiceDescription(description);
      setServicePrice(startingPrice.toString());
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageUrl("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "Authentication token not found", "error");
        return;
      }

      let updatedImageUrl = imageUrl;
      if (selectedImage) {
        updatedImageUrl = await uploadImage(selectedImage);
      }

      const updatedServiceData = {
        name: serviceName,
        description: serviceDescription,
        startingPrice: parseFloat(servicePrice),
        imageUrl: updatedImageUrl,
      };

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services/${serviceId}`,
        updatedServiceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("Success", "Service updated successfully", "success").then(() => {
        router.back();
      });
    } catch (error) {
      console.error("Error updating service:", error);
      Swal.fire("Error", "Failed to update service", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Service</h2>
        <div className="flex justify-center mb-6">
          <div className="relative">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Service"
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <span className="text-xl">&times;</span>
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
              >
                <FaPlus className="text-gray-400 text-3xl" />
                <span className="text-gray-400 text-sm mt-2">Choose Image</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              placeholder="Residential Construction"
            />
          </div>
          <div className="mb-4">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center px-4 bg-gray-200 rounded-l-lg text-gray-600">
                Starting at $
              </div>
              <input
                type="number"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 pl-32 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                placeholder="Price"
              />
            </div>
          </div>
          <div className="mb-6">
            <textarea
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              placeholder="Service Description"
              rows={4}
            ></textarea>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-teal-500 text-white py-2 px-8 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-teal-500 text-teal-500 py-2 px-8 rounded-lg hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditServicePage />
    </Suspense>
  );
}