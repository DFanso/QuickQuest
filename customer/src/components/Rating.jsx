import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const RatingComponent = ({ orderId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const submitFeedback = async () => {
    try {
      // Show loader
      Swal.fire({
        title: 'Submitting Feedback...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Get the token from localStorage
      const token = localStorage.getItem('token');

      // Prepare the feedback data
      const feedbackData = {
        job: orderId,
        description: comment,
        stars: rating,
      };

      // Make the API request using Axios
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/feedback`, feedbackData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Hide loader
      Swal.close();

      // Show success alert
      Swal.fire('Success', 'Feedback submitted successfully!', 'success').then(() => {
        // Close the component after the success alert is closed
        window.location.reload();
      });

      // Reset the form
      setRating(0);
      setComment('');
    } catch (error) {
      // Hide loader
      Swal.close();

      // Show error alert
      Swal.fire('Error', 'Failed to submit feedback. Please try again.', 'error');

      // Handle the error
      console.error(error);
    }
  };

  return (
    <div className="p-2 bg-white rounded-lg shadow-sm">
      <p className="text-lg font-semibold text-gray-700 mb-2 text-center">Rate the service</p>
      <div className="flex items-center justify-center mb-4 space-x-1 py-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <FaStar
              key={index}
              className={`h-8 w-8 cursor-pointer transition-colors duration-150 ${
                ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(ratingValue)}
            />
          );
        })}
      </div>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button
        className="mt-2 w-full py-2 duration-700 px-4 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={submitFeedback}
      >
        Submit
      </button>
    </div>
  );
};

export default RatingComponent;