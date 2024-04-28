"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import LocationPicker from '../../components/locationInput';
import { ThreeDots } from 'react-loader-spinner';
import AuthRoute from '../(auth)/AuthRoute';
import axios from 'axios';
import Swal from 'sweetalert2';
import uploadImage from '@/app/lib/api/uploadImage';

interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    location: { type: 'Point'; coordinates: [number, number] } | null;
}

export default function EditProfile() {
    const [profile, setProfile] = useState<Profile>({
        firstName: '',
        lastName: '',
        email: '',
        profileImage: '',
        location: null,
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Retrieve user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData: Profile = JSON.parse(userData);
            setProfile({
                firstName: parsedUserData.firstName || '',
                lastName: parsedUserData.lastName || '',
                email: parsedUserData.email || '',
                location: parsedUserData.location || null,
                profileImage: parsedUserData.profileImage || '',
            });

            // Retrieve profile image from localStorage
            const profileImage = parsedUserData.profileImage;
            console.log(profileImage);
            if (profileImage) {
                setImagePreview(profileImage);
            }
        }
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLocationSelect = (location: { lat: number; lng: number }) => {
        setProfile({ ...profile, location: { type: 'Point', coordinates: [location.lng, location.lat] } });
        console.log(location);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = localStorage.getItem('user');
            const parsedUserData: Profile = JSON.parse(userData || '{}');
            const token = localStorage.getItem('token');

            let profileImage: string | null = null;
            if (image) {
                profileImage = await uploadImage(image);
            }

            const updatedProfile: Partial<Profile> = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                location: profile.location,
                profileImage: profileImage || profile.profileImage,
                // Include other properties from the UpdateUserDto class if needed
            };

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/user/profile`, updatedProfile, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully',
                showConfirmButton: false,
                timer: 1500,
            });

            // Update user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href ='/profile';
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthRoute>
            <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6'>
                <h1 className="text-lg font-medium text-black">Get Started</h1>
                <p className="text-center text-base my-2 mb-4" style={{ color: "#02615D" }}>Welcome to QuickQuest - lets create your account</p>
                <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full overflow-hidden mb-4 object-cover">
                    <input type="file" id="imageUpload" className="hidden" onChange={handleImageUpload} />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <img src="/images/profile-icon.png" alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        )}
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <FontAwesomeIcon icon={faCamera} className="text-white" />
                            <span className="text-white text-xs">Add image</span>
                        </div>
                    </label>
                </div>
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                id="first-name"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-1 rounded-md shadow-sm text-black`}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                id="last-name"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-1 rounded-md shadow-sm text-black`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                    </div>
                    <LocationPicker initialLocation={profile.location} onLocationSelect={handleLocationSelect} />
                    {errors.location && <p className="text-red-500 text-xs mt-1 text-black">{errors.location}</p>}

                    <div className='flex items-center justify-center mt-4'>
                        <button type="submit" className="w-2/5 bg-teal-500 text-white text-base rounded-md py-2 mb-2 hover:bg-teal-600" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <ThreeDots color="#ffffff" height={20} width={20} />
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthRoute>
    );
}