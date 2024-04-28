"use client";
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaPencilAlt, FaTimes, FaPlus } from 'react-icons/fa';
import { IoCloseCircle } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Link from 'next/link';
import Swal from 'sweetalert2';

const ServiceCard = ({ service, onDelete }) => {
  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(service._id);
      }
    });
  };

  return (
    <div className="relative w-full flex flex-col border rounded-lg p-2 m-2" style={{ borderRadius: '10px' }}>
      <img src={service.imageUrl} alt={service.name} className="w-full object-cover rounded-t-lg" style={{ height: '200px' }} />
      <div className="absolute top-0 right-0 m-2 flex pt-2 pr-2">
        <Link href={`/editService?serviceId=${service._id}`}>
          <FaEdit className="text-teal-500 mr-2 text-lg cursor-pointer" />
        </Link>
        <IoCloseCircle className="text-red-600 text-xl cursor-pointer" onClick={handleDelete} />
      </div>
      <div className="text-center mt-2 text-black">
        <p>{service.name}</p>
      </div>
    </div>
  );
};

const Services = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catId = searchParams.get('catId');
  const [services, setServices] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services?category=${catId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    if (catId && token) {
      fetchServices();
    }
  }, [catId, token]);

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: '*/*',
        },
      });
      setServices((prevServices) => prevServices.filter((service) => service._id !== serviceId));
      Swal.fire('Deleted!', 'The service has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting service:', error);
      Swal.fire('Error', 'Failed to delete the service.', 'error');
    }
  };

  return (
    <div className="p-4 mt-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Services</h1>
        <div className="flex">
          <Link href={`/addService?catId=${catId}`}>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center mr-2">
              <FaPlus className="text-xl" />
              <span className="ml-2">Add Service</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start -mx-2">
        {services.map((service) => (
          <div className="w-full md:w-1/3 p-2" key={service._id}>
            <ServiceCard service={service} onDelete={handleDeleteService} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Services />
    </Suspense>
  );
}