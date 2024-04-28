"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import BidForm from "../../components/bidForm";
import AuthRoute from "../(auth)/AuthRoute";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const BidCard = ({ bid, onDelete }) => {
  const router = useRouter();

  const deleteBid = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this bid!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/bids/${bid._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onDelete(bid._id);
        Swal.fire({
          icon: 'success',
          title: 'Bid Deleted',
          text: 'The bid has been successfully deleted.',
        }).then(() => {
          router.refresh();
        });
      } catch (error) {
        console.error("Error deleting bid:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting the bid.',
        });
      }
    }
  };

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-md bg-white custom-box-shadow relative">
      <button
        className="absolute top-2 right-2 bg-white rounded-full p-1 text-green-500 hover:text-green-700"
        onClick={deleteBid}
      >
        <IoClose size={20} />
      </button>
      <img className="w-full" src={bid.service.imageUrl} alt={bid.service.name} />
      <div className="px-6 py-4">
        <div className="font-medium text-black text-lg mb-2">{bid.service.name}</div>
        <p className="text-gray-700 text-base">{bid.description}</p>
        <p className="text-gray-600 text-base font-medium mt-2">
          Expiry Date: {new Date(bid.expireDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-base font-medium">Budget: ${bid.budget}</p>
      </div>
    </div>
  );
};

const BidsList = ({ bids, onDelete }) => {
  return (
    <div className="mb-10 flex justify-center">
      <div>
        <h2 className="text-xl text-black font-medium mb-4">My bids</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bids.map((bid, index) => (
            <BidCard
              key={index}
              bid={bid}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const JobPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousBids, setPreviousBids] = useState([]);
  const [isLoadingPreviousBids, setIsLoadingPreviousBids] = useState(false);

  const handleServiceClick = (categoryName) => {
    setSelectedCategory(categoryName);
    fetchServices(categoryName);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async (categoryName) => {
    setIsLoading(true);
    try {
      const categoryId = categories.find(
        (category) => category.name === categoryName
      )._id;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services?category=${categoryId}`
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreviousBids = async () => {
    setIsLoadingPreviousBids(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const customerId = user._id;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/bids?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPreviousBids(response.data.bids);
    } catch (error) {
      console.error("Error fetching previous bids:", error);
    } finally {
      setIsLoadingPreviousBids(false);
    }
  };

  const handleDeleteBid = (bidId) => {
    setPreviousBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
  };

  useEffect(() => {
    fetchCategories();
    fetchPreviousBids();
  }, []);

  return (
    <>
      <AuthRoute>
        <div className="flex flex-col my-10 mx-4 sm:mx-20 items-center justify-center p-6 py-8 bg-teal-500 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-2">Create your own bid</h1>
          <h2 className="text-base mb-8">Choose the service you want</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <ThreeDots color="#4FB8B3" height={80} width={80} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8">
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleServiceClick(category.name)}
                  className="flex flex-row sm:flex-row items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50"
                >
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    className="w-6 h-6 mb-2 sm:mb-0 sm:mr-2"
                  />
                  <span className="text-teal-500">{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedCategory && (
          <BidForm category={selectedCategory} services={services} />
        )}
        <div className="mt-4 mx-14">
          {isLoadingPreviousBids ? (
            <div className="flex items-center justify-center">
              <ThreeDots color="#4FB8B3" height={40} width={40} />
            </div>
          ) : (
            <BidsList bids={previousBids} onDelete={handleDeleteBid} />
          )}
        </div>
      </AuthRoute>
    </>
  );
};

export default JobPage;