'use client';
import PopularServices from "../components/poplarServices";
import Testimonials from "../components/Testimonial";
import './globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import RecommendedServices from "@/components/RecommendedServices";
import PopularWorkers from "@/components/popularWorkers";
import Link from 'next/link';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return;
    }
  
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/profile`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

    } catch (error) {
      window.location.reload();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories`, {
        headers: {
          'accept': '*/*'
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services`, {
        headers: {
          'accept': '*/*'
        }
      });
      setAllServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const isUserLoggedIn = () => {
    return localStorage.getItem('user') !== null;
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    const filtered = allServices.filter((service) =>
      service.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      service.category.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  return (
    <>
     <div className="text-black">
  <div className="flex justify-center items-center space-x-0 mt-4 py-6 md:py-8 relative">
    <input
      type="text"
      placeholder="What do you want to get done?"
      className="p-2 w-2/4 sm:w-2/3 md:w-1/2 lg:w-1/2 xl:w-1/4 border border-gray-400 rounded-l-lg text-sm md:text-base h-10" // Added h-10 for a height of 40px
      value={searchInput}
      onChange={handleSearchInputChange}
    />
    {searchInput && (
      <div className="absolute top-full left-0 right-0 sm:left-1/6 sm:right-1/6 md:left-1/4 md:right-1/4 lg:left-1/3 lg:right-1/3 xl:left-5/12 xl:right-5/12 bg-white border border-gray-400 rounded-b-lg shadow-lg z-10">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/workers?serviceId=${service._id}`)}
          >
            <img
            src={service.imageUrl}
            alt={service.name}
            style={{ borderRadius: '10px' }} // You can adjust the '10px' to get the desired curvature
            className="w-16 h-16 object-cover mr-4 h-12 w-12 mb-4 sm:mb-0"
          />
            <div>
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-gray-600">Starting from ${service.startingPrice}</p>
              <p className="text-gray-500">{service.category.name}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    <button className="bg-teal-500 text-white font-medium px-4 py-2 rounded-r-lg border border-gray-400 text-sm h-10"> {/* Added h-10 for a height of 40px */}
      Find Workers
    </button>
  </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <ThreeDots color="#4FB8B3" height={80} width={80} />
          </div>
        ) : (
          <>
            {/* Services Section for Desktop Views */}
            <div className="hidden sm:hidden md:grid md:grid-cols-5 gap-4 justify-items-center mt-1 md:mt-12 mb-12">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="text-center space-y-2 cursor-pointer"
                  onClick={() => router.push(`/services?categoryId=${category._id}`)}
                >
                  <div className="p-4 rounded-full">
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="h-14 w-14 mx-auto"
                    />
                  </div>
                  <div className="text-gray-700">{category.name}</div>
                </div>
              ))}
            </div>

            {/* Services Section for Mobile Views */}
            <div className="grid grid-cols-3 md:hidden gap-4 justify-items-center mt-1 mb-12">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="text-center space-y-2 cursor-pointer"
                  onClick={() => router.push(`/services?categoryId=${category._id}`)}
                >
                  <div className="p-4 rounded-full">
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="h-10 w-10 mx-auto"
                    />
                  </div>
                  <div className="text-gray-700 text-sm">{category.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Statistics Section */}
        <div className="grid grid-cols-1 text-lg sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center md:py-12 py-6 bg-teal-500 text-white">
          <div className="text-center">
            <p className="text-sm md:text-lg">Over 100,000 positive</p>
            <p className="text-sm md:text-lg">client reviews</p>
          </div>
          <div className="text-center">
            <p className="text-sm md:text-lg">Over 500 unique skills</p>
            <p className="text-sm md:text-lg">offered</p>
          </div>
          <div className="text-center">
            <p className="text-sm md:text-lg">Task Completed: </p>
            <p className="text-sm md:text-lg">10,000 +</p>
          </div>
          <div className="text-center">
            <p className="text-sm md:text-lg">96% customer</p>
            <p className="text-sm md:text-lg">satisfaction</p>
          </div>
        </div>
      </div>

      {isUserLoggedIn() && (
        <>
          <RecommendedServices />
          <PopularWorkers />
        </>
      )}

      {/* Popular Services Section */}
      <PopularServices />

      <div className="flex mt-2">
        {/* Left side with image and gradient overlay */}
        <div className="w-1/2 relative" style={{ height: '50vh' }}>
          <img src="/images/questor-bg-image.png" alt="Creative Work" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-teal-500"></div>
        </div>

        {/* Right side with text */}
        <div className="w-4/5 md:w-1/2 bg-teal-500 py-10 px-6 md:px-12 text-white relative flex flex-col justify-center" style={{ height: '50vh' }}>
          <h2 className="text-lg md:text-2xl font-bold mb-4 text-right">Over 10,000+ Questers</h2>
          <p className="ml-0 md:ml-0 lg::ml-52 text-base md:text-lg leading-6 md:leading-8 mb-6 text-right">
            Unlock endless possibilities by posting your job on our platform! Whether
            you are seeking a creative genius, a tech-savvy guru, or a strategic consultant,
            our network of talented freelancers is ready to bring your vision to life.
          </p>
          <div className="text-right">
          <Link href="https://worker-quick-quest.vercel.app/signup">
            <button className="bg-white text-teal-500 font-bold py-3 px-4 rounded-lg">
              Become a quester
            </button>
            </Link>
          </div>
        </div>
      </div>

      <Testimonials />
    </>
  );
}