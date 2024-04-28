"use client";
import React, { useState, useRef, useEffect,Suspense } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../globals.css';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import uploadImage from '@/app/lib/api/uploadImage';

const EditCategoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchCategory();
    }
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories/${id}`);
      const categoryData = response.data;
      setCategoryName(categoryData.name);
      setDescription(categoryData.description);
      setImage(categoryData.iconUrl);
    } catch (error) {
      console.error('Error fetching category:', error);
      Swal.fire('Error', 'An error occurred while fetching the category', 'error');
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => setImage(e.target.result);
      fileReader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please log in to update the category', 'error');
      setIsLoading(false);
      return;
    }

    try {
      let iconUrl = image;
      if (selectedFile) {
        iconUrl = await uploadImage(selectedFile);
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories/${id}`,
        {
          name: categoryName,
          description,
          iconUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire('Success', 'Category updated successfully', 'success').then(() => {
          router.push('/categories');
        });
      } else {
        Swal.fire('Error', 'Failed to update category', 'error');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      Swal.fire('Error', 'An error occurred while updating the category', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start h-screen pt-20">
      <div className="w-2/5 rounded-lg p-5">
        <h2 className="text-2xl font-semibold mb-8 text-black">Edit Category</h2>
        <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
        <div className="flex items-center justify-center">
          <div className="relative group mb-4 cursor-pointer" onClick={triggerFileInput}>
            <img src={image} alt="Category" className="w-20 h-20 rounded-lg object-cover mb-2" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300">
              <FaPlus className="text-white text-xl" />
              <span className="text-white text-xs mt-2">Change Image</span>
            </div>
          </div>
        </div>
        <div className="flex mb-4 text-gray-500">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border-2 border-gray-300 p-2 rounded mr-2 flex-grow text-black"
            placeholder="Category Name"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 p-2 border-2 border-gray-300 rounded text-black"
            placeholder="Category Description"
          />
        </div>
        <div className="flex justify-center space-x-2">
          <button
            className="bg-teal-500 text-white px-10 py-0 rounded-lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <ThreeDots color="#FFFFFF" height={20} width={40} /> : 'Save'}
          </button>
          <button
            className="text-teal-500 border border-teal-500 text-black px-6 py-1 rounded-lg"
            onClick={() => router.push('/categories')}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCategoryPage />
    </Suspense>
  );
}