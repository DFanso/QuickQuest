import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const BidCard = ({ title, description, expireDate, budget, imageUrl, customerId }) => {
  const router = useRouter();

  const handleContactCustomer = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to contact the customer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, contact customer!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const workerId = user._id;

        // Create the chat
        const chatResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/chats`, {
          workerId,
          customerId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const chatId = chatResponse.data.chatId;

        // Send a message regarding the bid to the customer
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/chats/${chatId}/messages`, {
          contentType: 'TEXT',
          content: `Hello, I'm interested in your bid "${description}". Let's discuss further.`
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        Swal.fire(
          'Message Sent!',
          'You have successfully contacted the customer.',
          'success'
        ).then(() => {
          router.push('/chat');
        });
      } catch (error) {
        console.error('Error contacting customer:', error);
        Swal.fire(
          'Error',
          'An error occurred while contacting the customer.',
          'error'
        );
      }
    }
  };

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white m-4">
      <img className="w-full" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-medium text-black text-lg mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
        <p className="text-gray-600 text-base font-medium mt-2">Expiry Date: {formatDate(expireDate)}</p>
        <p className="text-gray-600 text-base font-medium">Budget: ${budget}</p>
        <div className='flex items-center justify-center'>
          <button
            className="w-2/4 bg-teal-500 text-sm text-white rounded-md py-2 mb-2 hover:bg-teal-600 mt-4"
            onClick={handleContactCustomer}
          >
            Contact Customer
          </button>
        </div>
      </div>
    </div>
  );
};

const BidsList = ({ bids, category, iconUrl }) => {
  const settings = {
    dots: true,
    infinite: bids.length > 1,  // Only set infinite to true if there are more than one bid
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: bids.length > 1,  // Apply the same logic here for mobile responsiveness
          dots: true
        }
      },
      {
        breakpoint: 769,
        settings: "unslick" // Consider managing or adjusting this if needed
      }
    ]
  };

  return (
    <div className='mb-10'>
      <div className="flex items-center justify-center mb-4">
        <div className="flex flex-row sm:flex-row items-center justify-center px-4 py-2">
          <img src={iconUrl} alt='service icon' className="w-6 h-6 mb-2 sm:mb-0 sm:mr-2" />
          <span className="text-teal-500 text-2xl">{category}</span>
        </div>
      </div>
      <div className="block sm:hidden">
        <Slider {...settings}>
          {bids.map((bid, index) => (
            <div key={index} className="px-4">
              <BidCard
                title={bid.service.name}
                description={bid.description}
                expireDate={bid.expireDate}
                budget={bid.budget}
                imageUrl={bid.service.imageUrl}
                customerId={bid.customer._id}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bids.map((bid, index) => (
            <BidCard
              key={index}
              title={bid.service.name}
              description={bid.description}
              expireDate={bid.expireDate}
              budget={bid.budget}
              imageUrl={bid.service.imageUrl}
              customerId={bid.customer._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/bids/matching`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBids(response.data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    fetchBids();
  }, []);

  const categorizedBids = bids.reduce((acc, bid) => {
    const category = bid.service.category.name;
    if (!acc[category]) {
      acc[category] = {
        iconUrl: bid.service.category.iconUrl,
        bids: [],
      };
    }
    acc[category].bids.push(bid);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      {Object.entries(categorizedBids).map(([category, { iconUrl, bids }]) => (
        <BidsList key={category} bids={bids} category={category} iconUrl={iconUrl} />
      ))}
    </div>
  );
};

export default App;