"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEdit, faEye, faregular } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../globals.css';
import { FaEdit } from "react-icons/fa";
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const CategoryItem = ({ category, onDeleteCategory }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please log in to delete a category', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this category. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories/${category._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onDeleteCategory(category._id);
        Swal.fire('Deleted!', 'The category has been deleted.', 'success');
        window.location.href = '/categories'
      } catch (error) {
        console.error('Error deleting category:', error);
        Swal.fire('Error', 'An error occurred while deleting the category', 'error');
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg mb-2">
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="text-red-500 text-xl mr-10 ml-2 cursor-pointer"
        onClick={handleDelete}
      />
      <img src={category.iconUrl || 'placeholder-image-path'} alt={category.name} className="h-8 w-8 rounded-full" />
      <p className="flex-1 ml-2 font-medium text-black">{category.name}</p>
      <Link href={`/editCategory?id=${category._id}`}>
        <button className="hover:bg-teal-700 py-2 px-4 bg-teal-500 rounded-lg mr-4">
          <FontAwesomeIcon icon={faEdit} />
          <span className="ml-1">Edit Category</span>
        </button>
      </Link>
      <Link href={`/services?catId=${category._id}`}>
        <button className="hover:bg-teal-700 py-2 px-4 bg-teal-500 rounded-lg">
          <FontAwesomeIcon icon={faEye} />
          <span className="ml-1">View Services</span>
        </button>
      </Link>
    </div>
  );
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeleteCategory = (deletedCategoryId) => {
    setCategories((prevCategories) => prevCategories.filter((category) => category._id !== deletedCategoryId));
  };

  return (
    <div className="p-8 mt-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Categories</h1>
        <div className='flex'>
          <Link href="/addCategory">
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center mr-2 hover:bg-teal-700 duration-700">
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-2">Add new category</span>
            </button>
          </Link>
        </div>
      </div>
      <div>
        {categories.map((category) => (
          <CategoryItem key={category._id} category={category} onDeleteCategory={handleDeleteCategory} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;