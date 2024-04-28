"use client"
import React, { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import '../../globals.css';
import Link from 'next/link';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import LabourPageServices from "../../../components/servicesLabourPublic";
import CustomerFeedback from "../../../components/customerFeedback";
import { FaUser } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';


const getLocationName = async (latitude, longitude) => {
  try {
    const geocodingUrl = `https://us1.locationiq.com/v1/reverse?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();
    return geocodingData.display_name || '';
  } catch (error) {
    console.error('Error fetching location name:', error);
    return '';
  }
};


const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to log out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, log out',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href ='/';
  }
};

const LabourPublicPage = () => {




  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('');
  const [user, setUser] = useState(null);

  const openProfilePage = (workerId) => {
    const baseUrl = 'https://quick-quest.vercel.app/workerProfile?workerId=';
    const profileUrl = baseUrl + workerId;
    window.open(profileUrl, '_blank');
  };

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const storedUser = localStorage.getItem('user');

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const workerId = parsedUser._id; // Replace with the actual worker ID
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/workers/${workerId}/profile`);
        setWorker(response.data);

        const [longitude, latitude] = response.data.location.coordinates;
        const fetchedLocationName = await getLocationName(latitude, longitude);
        setLocationName(fetchedLocationName);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching worker profile:', error);
        setLoading(false);
      }
    };

    fetchWorkerProfile();
  }, []);

  const cardStyle = {
    borderRadius: '15px',
    background: '#FFF',
    boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#4FB8B3" height={80} width={80} />
      </div>
    );
  }

  const { avgRating, feedbackCount } = worker.feedbackSummary;

  return (
    <>
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 justify-center mt-4 items-center md:px-14">
        <div style={cardStyle} className="bg-white p-4 flex-1 pt-8 min-h-96">
          <div className="flex flex-row md:items-center">
            <img src={worker.profileImage} alt="Profile" className="rounded-full h-20 w-20 object-cover mr-4" />
            <div>
              <h2 className="text-lg font-medium text-black pb-2">{worker.firstName} {worker.lastName}</h2>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"} />
                ))}
                <span className="text-sm ml-2 text-black">{avgRating.toFixed(1)} ({feedbackCount})</span>
              </div>
              <div className="flex items-center my-2">
                <FaMapMarkerAlt className="text-teal-500 mr-1" />
                <span className='text-black text-sm'>{locationName}</span>
              </div>




              <div className="flex">
                {[...new Set(worker.services.map(service => service.category.iconUrl))].map((iconUrl, i) => (
                  <img key={i} src={iconUrl} alt="Service" className="h-5 w-5 mr-2" />
                ))}
              </div>
            </div>
          </div>
          <h3 className="text-md font-semibold mt-4 text-black">About</h3>
          <p className="text-sm text-gray-600">{worker.aboutMe}</p>
        </div>

        <div style={cardStyle} className="bg-white p-4 flex-1 w-full flex flex-col justify-between md:min-h-96">
          {/* <div className="bg-teal-500 text-white text-lg font-semibold rounded-t-xl p-2 text-center">Contact Me</div> */}
          <div className="flex flex-col items-center justify-center flex-grow">
            {/* <button className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white font-semibold py-2 px-4 rounded-md w-full mt-6 md:mt-0 md:w-2/5 mb-2 transition ease-in duration-200">
              Quick Chat
            </button> */}
            <Link href="">
              <button
                className="bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md w-full mb-4 transition ease-in duration-200 flex items-center justify-center"
                onClick={() => openProfilePage(worker._id)}
              >
                <FaUser className="mr-2" />
                Preview Profile
              </button>
            </Link>

            <Link href="/editProfile">
              <button className="bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded-md w-full md:full mb-4 transition ease-in duration-200 flex items-center justify-center">
                <FontAwesomeIcon icon={faUserPen} className="mr-2" />
                Edit Profile
              </button>
            </Link>

            <Link href="/bids">
              <button className="bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded-md w-full  mb-4 transition ease-in duration-200 flex items-center justify-center">
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View Bids
              </button>
            </Link>

            <Link href="">
              <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-10 rounded-md w-full  mb-4 transition ease-in duration-200 flex items-center justify-center"
               onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Log Out
              </button>
            </Link>



            {/* <span className="text-sm text-gray-600">Average Response Time: 1hr</span> */}
          </div>
          {/* Intentionally left blank for spacing */}
          <div></div>
        </div>

      </div>
      <LabourPageServices worker={worker} />
      <div className="flex flex-col items-center justify-center flex-grow mb-6">




      </div>
      <CustomerFeedback feedbacks={worker.feedbacks} />
    </>
  );
};

export default LabourPublicPage;
