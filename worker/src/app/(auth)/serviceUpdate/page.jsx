"use client";
import React, { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../globals.css';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import AuthRoute from '../AuthRoute';

const CategoryCard = ({ category, selectedCategory, setSelectedCategory, selectedServices, setSelectedServices, userData }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services?category=${category._id}`);
        const servicesWithCheckedState = response.data.map((service) => ({
          ...service,
          checked: selectedServices.includes(service._id),
        }));
        setServices(servicesWithCheckedState);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, [category._id, selectedServices]);

  const handleServiceChange = (serviceId) => {
    if (userData && userData.services.some((service) => service._id === serviceId)) {
      // Service is already part of the user's services, do nothing
      return;
    }

    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  return (
    <RadioGroup.Option value={category._id} as="div" className="w-full md:w-2/3 mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-2 md:mt-4">
      {({ checked }) => (
        <>
          <img className="w-20 h-20 object-cover" src={category.iconUrl} alt={category.name} />
          <div className="px-4 py-2" onClick={() => setSelectedCategory(category._id)}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-1 border border-teal-500 ${checked ? 'bg-teal-500' : ''}`} />
              <span className="text-base font-medium text-black">{category.name}</span>
            </div>
            <div className="mt-1">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ThreeDots color="#4FB8B3" height={30} width={30} />
                </div>
              ) : (
                services.map((service) => (
                  <div key={service._id} className="flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      id={`${category._id}-service-${service._id}`}
                      className="w-3 h-3 text-teal-500 rounded border-gray-300 focus:ring-teal-500"
                      checked={service.checked}
                      onChange={() => handleServiceChange(service._id)}
                      disabled={userData && userData.services.some((userService) => userService._id === service._id)}
                    />
                    <label htmlFor={`${category._id}-service-${service._id}`} className="ml-1 text-xs text-gray-600">
                      {service.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </RadioGroup.Option>
  );
};

export default function JoinPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = () => {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        setSelectedServices(parsedUserData.services.map((service) => service._id));
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories`);
        setCategories(response.data);
        setSelectedCategory(response.data[0]?._id);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddServices = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/workers/services`, {
        method: 'PATCH',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serviceIds: selectedServices })
      });

      if (response.ok) {
        // Handle successful response
        console.log('Services added successfully');
      } else {
        // Handle error
        console.error('Failed to add services');
      }
    } catch (error) {
      console.error('Error adding services:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640, // TailwindCSS 'sm' breakpoint
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: 'unslick'
      }
    ]
  };

  return (
    <>
      <AuthRoute>
        <div className="container mx-auto p-4 w-full md:w-11/12">
          <h2 className="text-center md:text-xl text-base font-medium md:mt-4 mt-2 text-black">
            Choose the services you want to provide
          </h2>

          <RadioGroup value={selectedCategory} onChange={setSelectedCategory}>
            <div className="block sm:hidden">
              <Slider {...settings}>
                {categories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedServices={selectedServices}
                    setSelectedServices={setSelectedServices}
                    userData={userData}
                  />
                ))}
              </Slider>
            </div>
            <div className="hidden sm:block">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedServices={selectedServices}
                    setSelectedServices={setSelectedServices}
                    userData={userData}
                  />
                ))}
              </div>
            </div>
          </RadioGroup>
          <div className="flex justify-center mt-6">
            <button
              className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg md:mt-4 mt-4 md:mb-6 mb-6"
              disabled={isSubmitting}
              onClick={handleAddServices}
            >
              {isSubmitting ? (
                <ThreeDots color="#ffffff" height={20} width={40} />
              ) : (
                'Add New Services'
              )}
            </button>
          </div>
        </div>
      </AuthRoute>
    </>
  );
}