"use client";
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import LocationPicker from '../../../components/signupLocationInput';
import uploadImage from '@/app/lib/api/uploadImage';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
  status: string;
  location: {
    type: string;
    coordinates: number[];
  };
  profileImage: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function SignUp() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
    location: '',
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form fields
    const validationErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImage: '',
      location: '',
    };

    const form = event.target as HTMLFormElement;
    const firstName = (form.elements.namedItem('first-name') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('last-name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirm-password') as HTMLInputElement).value;

    if (!firstName) {
      validationErrors.firstName = 'First name is required';
    }
    if (!lastName) {
      validationErrors.lastName = 'Last name is required';
    }
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(password)) {
      validationErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      validationErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(password)) {
      validationErrors.password = 'Password must contain at least one number';
    } else if (!/[@$!%*?&|#]/.test(password)) {
      validationErrors.password = 'Password must contain at least one special character';
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    if (!selectedImage) {
      validationErrors.profileImage = 'Please select an image';
    }
    if (!location || (location.lat === 0 && location.lng === 0)) {
      validationErrors.location = 'Please select a valid location';
    }

    if (
      validationErrors.firstName ||
      validationErrors.lastName ||
      validationErrors.email ||
      validationErrors.password ||
      validationErrors.confirmPassword ||
      validationErrors.profileImage ||
      validationErrors.location
    ) {
      setErrors(validationErrors);
      return;
    }
    console.log('Password:', password);
console.log('Password regex test:', passwordRegex.test(password));

    setLoading(true);

    try {
      let profileImage = '';

      if (selectedImage) {
        profileImage = await uploadImage(selectedImage);
      }

      const userData: UserData = {
        firstName,
        lastName,
        email,
        password,
        type: 'CUSTOMER',
        status: 'UNVERIFIED',
        location: {
          type: 'Point',
          coordinates: location ? [location.lng, location.lat] : [0, 0],
        },
        profileImage,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/register`, userData);

      Swal.fire('Success', 'Your account has been created successfully!', 'success').then(() => {
        // Redirect to verification page
        window.location.href = `/verifyEmail?email=${email}`;
      });
    } catch (error) {
      console.error('Error creating account:', error);
      Swal.fire('Error', 'An error occurred while creating your account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
          <div className='mt-6'></div>
          <h1 className="text-lg font-medium text-black">Get Started</h1>
          <p className="text-center text-base my-2 mb-4" style={{ color: "#02615D" }}>Welcome to QuickQuest - lets create your account</p>
          <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full overflow-hidden">
            {/* Hidden file input */}
            <input type="file" id="imageUpload" className="hidden" onChange={handleImageUpload} />
            {/* Label wraps the profile picture and the overlay */}
            <label htmlFor="imageUpload" className="cursor-pointer w-full h-full rounded-full object-cover">
              {/* Profile picture */}
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <img src="/images/profile-icon.png" alt="Profile" className="w-full h-full rounded-full object-cover" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <FontAwesomeIcon icon={faCamera} className="text-white w-6 h-6" />
                <span className="text-white text-xs">Add image</span>
              </div>
            </label>
          </div>
          {errors.profileImage && <p className="text-red-500 text-xs mt-1 object-cover">{errors.profileImage}</p>}

          {loading ? (
            <div className="flex items-center justify-center">
              <ThreeDots color="#4FB8B3" height={80} width={80} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-lg text-black">
              <div className="flex gap-4 mb-1">
                <div className="w-1/2">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="first-name"
                    className={`mt-1 block w-full border ${errors.firstName ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="last-name"
                    className={`mt-1 block w-full border ${errors.lastName ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="flex flex-col mb-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="flex flex-col mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  id="password"
                  className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex flex-col mb-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  className={`mt-1 block w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <LocationPicker onLocationSelect={handleLocationSelect} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}

              <hr className="border-gray-300 my-4" />

              <p className="text-center text-sm text-gray-600 mb-4">
                By clicking Create Account, you agree to the Terms of Use and Privacy Policy.
              </p>
              <button type="submit" className="w-full bg-teal-500 text-sm text-white rounded-md py-2 mb-2 hover:bg-teal-600">
                Create Account
              </button>

              <p className="text-center text-sm text-black">
                Already have an account?{' '}
                <Link href="/login">
                  <span className="text-teal-600 hover:text-teal-500 mb-4">Log in.</span>
                </Link>
              </p>
            </form>
          )}
        </div>

        <div className='mt-6'></div>

      </div>
    </>
  );
}