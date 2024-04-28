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

const CategoryCard = ({ category, selectedCategory, setSelectedCategory, selectedServices, setSelectedServices }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services?category=${category._id}`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, [category._id]);

  const handleServiceChange = (serviceId) => {
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
                      checked={selectedServices.includes(service._id)}
                      onChange={() => handleServiceChange(service._id)}
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
  const router = useRouter();

  useEffect(() => {
    const tempUser = localStorage.getItem('tempUser');

      if (!tempUser) {
        router.push('/signup');
        return;
      }
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

  const handleCreateAccount = async () => {
    setIsLoading(true);
  
    try {
      const tempUser = localStorage.getItem('tempUser');
  
      if (!tempUser) {
        Swal.fire('Error', 'User data not found. Please sign up again.', 'error');
        router.push('/signup');
        return;
      }
  
      const userData = JSON.parse(tempUser);
      userData.services = selectedServices;
      delete userData.confirmPassword;
  
      const requestData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        aboutMe: userData.aboutMe,
        services: userData.services,
        type: userData.type,
        status: userData.status,
        location: userData.location,
        profileImage: userData.profileImage,
      };
  
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/register`, requestData);
      console.log('User registered:', response.data);
  
      localStorage.removeItem('tempUser');
  
      Swal.fire('Success', 'Worker account created successfully!', 'success');
      router.push(`/verifyEmail?email=${userData.email}`);
    } catch (error) {
      console.error('Error registering user:', error);
      Swal.fire('Error', 'An error occurred while creating the worker account. Please try again.', 'error');
    }
  
    setIsLoading(false);
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
        breakpoint: 768, // TailwindCSS 'md' breakpoint
        settings: 'unslick'
      }
    ]
  };

  return (
    <>
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
                />
              ))}
            </div>
          </div>
        </RadioGroup>
        <div className="flex justify-center mt-6">
        <button
          className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg md:mt-4 mt-4 md:mb-6 mb-6"
          onClick={handleCreateAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <ThreeDots color="#ffffff" height={20} width={40} />
          ) : (
            'Create Worker Account'
          )}
        </button>
      </div>
      </div>
    </>
  );
}