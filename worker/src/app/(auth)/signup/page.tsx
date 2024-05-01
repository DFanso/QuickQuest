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
import { useRouter } from 'next/navigation';

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
  aboutMe: string;
}

export default function SignUp() {
const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    aboutYourself: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
    location: '',
    aboutYourself: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImage: '',
      location: '',
      aboutYourself: '',
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }  else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
        isValid = false;
      }}

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!selectedImage) {
      newErrors.profileImage = 'Profile image is required';
      isValid = false;
    }

    if (!location) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.aboutYourself.trim()) {
      newErrors.aboutYourself = 'About Yourself is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, proceed with submission
      setLoading(true);

      try {
        // Upload the profile image
        const profileImage = selectedImage ? await uploadImage(selectedImage) : '';

        // Create the user data object
        const userData: UserData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          type: 'WORKER',
          status: 'UNVERIFIED',
          location: {
            type: 'Point',
            coordinates: location ? [location.lng, location.lat] : [0, 0],
          },
          aboutMe: formData.aboutYourself,
          profileImage,
        };

        // Save the user data in local storage
        localStorage.setItem('tempUser', JSON.stringify(userData));

        // Redirect to the chooseServiceOffer page
        router.push('/join');
      } catch (error) {
        console.error('Error saving user data:', error);
        Swal.fire('Error', 'An error occurred while saving user data. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
          <div className='mt-6'></div>
          <h1 className="text-lg font-meduim text-black">Get Started</h1>
          <p className="text-center text-base my-2 mb-4" style={{ color: "#02615D" }}>Welcome to QuickQuest - lets create your account!</p>
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
          {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}

          <div className="w-full max-w-lg text-black">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 mb-1">
                <div className="w-1/2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className={`mt-1 block w-full border ${errors.firstName ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className={`mt-1 block w-full border ${errors.lastName ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                    value={formData.lastName}
                    onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="flex flex-col mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  id="password"
                  className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex flex-col mb-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`mt-1 block w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <LocationPicker onLocationSelect={handleLocationSelect} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}

              <div className="flex flex-col mb-1">
                <label htmlFor="aboutYourself" className="block text-sm font-medium text-gray-700">Write about yourself</label>
                <textarea
                  id="aboutYourself"
                  className={`mt-1 block h-32 w-full border ${errors.aboutYourself ? 'border-red-500' : 'border-green-800'} p-1 rounded-md shadow-sm`}
                  placeholder="Type your message here..."
                  value={formData.aboutYourself}
                  onChange={handleChange}
                />
                {errors.aboutYourself && <p className="text-red-500 text-xs mt-1">{errors.aboutYourself}</p>}
              </div>

              <hr className="border-gray-300 my-4" />

              <p className="text-center text-sm text-gray-600 mb-4">
                By clicking Create Account, you agree to the Terms of Use and Privacy Policy.
              </p>
              <button type="submit" className="w-full bg-teal-500 text-sm text-white rounded-md py-2 mb-2 hover:bg-teal-600" disabled={loading}>
                {loading ? (
                 <div className="flex items-center justify-center">
                 <ThreeDots color="#4FB8B3" height={80} width={80} />
                </div>
                ) : (
                'Continue'
                )}
            </button>
            </form>

            <p className="text-center text-sm text-black">
              Already have an account?{' '}
              <Link href="/login">
                <span className="text-teal-600 hover:text-teal-500 mb-4">Log in.</span>
              </Link>
            </p>
          </div>
        </div>

        <div className='mt-6'></div>
      </div>
    </>
  );
}