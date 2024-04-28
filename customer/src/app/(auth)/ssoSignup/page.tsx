"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import LocationPicker from '../../../components/signupLocationInput';
import uploadImage from '@/app/lib/api/uploadImage';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

export default function SSOSignup() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/profile`, {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.data.status !== "GOOGLEAUTH") {
            router.push("/");
          }

          setUserProfile(response.data);
          setImagePreview(response.data.profileImage);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Swal.fire('Error', 'An error occurred while fetching your profile. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(userProfile?.profileImage || null);
    }
  };

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!location || (location.lat === 0 && location.lng === 0)) {
      Swal.fire('Error', 'Please select a valid location.', 'error');
      setLoading(false);
      return;
    }

    try {
      let profileImage = userProfile?.profileImage || '';

      if (selectedImage) {
        profileImage = await uploadImage(selectedImage);
      }

      const updatedUserData = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        profileImage,
        location: {
          type: 'Point',
          coordinates: location ? [location.lng, location.lat] : [0, 0],
        },
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/update-sso-profile/${userProfile._id}`,
        updatedUserData,
        {
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      Swal.fire('Success', 'Your profile has been updated successfully!', 'success').then(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire('Error', 'An error occurred while updating your profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
          <div className='mt-6'></div>
          <h1 className="text-lg font-medium text-black">Complete Your Profile</h1>
          <p className="text-center text-base my-2 mb-4" style={{ color: "#02615D" }}>
            Please provide additional details to complete your account setup.
          </p>
          <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full overflow-hidden">
            {/* Hidden file input */}
            <input type="file" id="imageUpload" className="hidden" onChange={handleImageUpload} />
            {/* Label wraps the profile picture and the overlay */}
            <label htmlFor="imageUpload" className="cursor-pointer w-full h-full rounded-full object-cover">
              {/* Profile picture */}
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : userProfile?.profileImage ? (
                <img src={userProfile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
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

          {userProfile && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium">
                {userProfile.firstName} {userProfile.lastName}
              </p>
              <p className="text-gray-600">{userProfile.email}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center">
              <ThreeDots color="#4FB8B3" height={80} width={80} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-lg text-black">
              <LocationPicker onLocationSelect={handleLocationSelect} />

              <hr className="border-gray-300 my-4" />

              <button type="submit" className="w-full bg-teal-500 text-sm text-white rounded-md py-2 mb-2 hover:bg-teal-600">
                Update Profile
              </button>
            </form>
          )}
        </div>

        <div className='mt-6'></div>
      </div>
    </>
  );
}