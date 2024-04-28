"use client"
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import uploadImage from '@/app/lib/api/uploadImage';

const AddCategory = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please log in to add a category', 'error');
      return;
    }

    try {
      setIsLoading(true);

      let iconUrl = '';
      if (selectedFile) {
        iconUrl = await uploadImage(selectedFile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories`,
        {
          name: categoryName,
          description: categoryDescription,
          iconUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire('Success', 'Category added successfully', 'success');
        setCategoryName('');
        setCategoryDescription('');
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        Swal.fire('Error', 'Failed to add category', 'error');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire('Error', 'An error occurred while adding the category', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 text-black">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-8 mt-16">Add new Category</h2>
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-200 shadow cursor-pointer"
          style={{
            width: '250px',
            height: '250px',
            borderRadius: '10px',
            boxShadow: '0px 0px 4px rgba(79, 184, 179, 0.25)',
          }}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <FaPlus className="text-teal-500 text-3xl" />
          )}
        </label>
        <input id="image-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        <span className="mt-2 mb-6">Add Icon</span>
        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <div className="flex flex-col mr-4 mb-2">
            <label htmlFor="category-name" className="mb-1 font-medium">
              Category Name
            </label>
            <input
              type="text"
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="New Category"
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="category-description" className="mb-1 font-medium">
              Category Description
            </label>
            <textarea
              id="category-description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Describe the Category"
              className="border border-gray-300 rounded p-2 h-32 resize-none"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <ThreeDots color="#FFFFFF" height={20} width={40} />
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;