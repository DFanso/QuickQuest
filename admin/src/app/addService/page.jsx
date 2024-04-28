"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import uploadImage from '@/app/lib/api/uploadImage';

const AddService = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="p-4 text-black">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-8 mt-16">Add new service</h2>
        <label htmlFor="image-upload" className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-200 shadow cursor-pointer" style={{ width: '250px', height: '250px', borderRadius: '10px', boxShadow: '0px 0px 4px rgba(79, 184, 179, 0.25)' }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Selected" className="object-cover w-full h-full rounded-lg" />
          ) : (
            <FaPlus className="text-teal-500 text-3xl" />
          )}
        </label>
        <input id="image-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        <span className="mt-2 mb-6">Add Image</span>
        <Suspense fallback={<div>Loading...</div>}>
          <AddServiceForm selectedFile={selectedFile} />
        </Suspense>
      </div>
    </div>
  );
};

const AddServiceForm = ({ selectedFile }) => {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const catId = searchParams.get('catId');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'Authentication token not found', 'error');
        return;
      }

      const imageUrl = await uploadImage(selectedFile);

      const serviceData = {
        name: serviceName,
        description: serviceDescription,
        category: catId,
        startingPrice: Number(servicePrice),
        imageUrl: imageUrl,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Swal.fire('Success', 'Service added successfully', 'success');
      router.push(`/services?catId=${catId}`);
    } catch (error) {
      console.error('Error adding service:', error);
      Swal.fire('Error', 'Failed to add service', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className='flex items-center justify-center'>
        <div className="flex flex-col mr-4">
          <label htmlFor="service-name" className="mb-1 font-medium">Service</label>
          <input type="text" id="service-name" value={serviceName} onChange={e => setServiceName(e.target.value)} placeholder="New Service" className="border border-gray-300 rounded p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="service-price" className="mb-1 font-medium">Starting at</label>
          <div className="flex">
            <span className="border border-gray-300 rounded-l p-2 bg-gray-200">$</span>
            <input type="number" id="service-price" value={servicePrice} onChange={e => setServicePrice(e.target.value)} placeholder="100" className="border border-gray-300 rounded-r p-2 flex-grow" />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="service-description" className="mb-1 font-medium">Description</label>
        <textarea id="service-description" value={serviceDescription} onChange={e => setServiceDescription(e.target.value)} placeholder="Enter service description" className="border border-gray-300 rounded p-2 w-full" />
      </div>
      <div className="flex justify-center mt-6">
        <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600">
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddService;