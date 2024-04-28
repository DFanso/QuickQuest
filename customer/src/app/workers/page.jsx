"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaCaretDown } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ServicePopularWorkers from "../../components/oneServiceWorkers";
import OneServicePopularWorkers from "../../components/oneServicePopularWorkers";
import { ThreeDots } from 'react-loader-spinner';

const OneServicePage = () => {
  const [service, setService] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Nattandiya');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [sId, setSId] = useState('');
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const searchParams = useSearchParams();

  const fetchServiceData = async (serviceId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services/${serviceId}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service data:', error);
    }
  };

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    if (serviceId) {
      setSId(serviceId);
      fetchServiceData(serviceId);
    }

    const user = localStorage.getItem('user');
    setIsUserLoggedIn(!!user);
  }, [searchParams]);

  return (
    <>
      {service ? (
        <div className="relative">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-[50vh] object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-white bg-opacity-90">
            {/* Service title and location dropdown */}
            <div className="flex justify-between items-center lg:px-16">
              <h1 className="text-sm md:text-2xl font-medium text-gray-800">{service.name}</h1>
              <div className="flex items-center">
                {/* Location dropdown */}
                <IoLocationSharp className="text-teal-500 mr-2" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-transparent md:text-base text-xs border-none text-gray-800 mr-2"
                >
                  <option value="Athurugiriya">Athurugiriya</option>
                  <option value="Homagama">Homagama</option>
                  {/* Add more location options here */}
                </select>
                <FaCaretDown className="text-gray-600" />
              </div>
            </div>
          </div>
          {/* Add additional content below */}
          {/* ... */}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ThreeDots color="#4FB8B3" height={80} width={80} />
        </div>
      )}

      {isUserLoggedIn && <ServicePopularWorkers serviceId={sId} />}

      <div className="flex justify-between items-center mb-6 mt-6 lg:px-16">

        <div>
          <div className="relative">


            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-32 border border-gray-200 bg-white shadow-md rounded-md py-1">
                <li className="px-4 py-2 hover:bg-gray-100 text-teal-500 cursor-pointer">Recent</li>
                <li className="px-4 py-2 hover:bg-gray-100 text-teal-500 cursor-pointer">Oldest</li>
                {/* Add more dropdown items as needed */}
              </ul>
            )}
          </div>
          {/* <span className="text-gray-600 text-sm">67 Reviews</span> */}
        </div>
      </div>

      <OneServicePopularWorkers serviceId={sId} />
      <div className='mt-4'></div>

      <div className='mb-6'></div>


    </>
  );
};

export default OneServicePage;