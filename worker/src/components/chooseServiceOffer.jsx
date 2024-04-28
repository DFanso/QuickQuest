import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import SendServiceOffer from './sendServiceOffer';

export default function ServiceOffer({ aChat }) {
  const [showSendServiceOffer, setShowSendServiceOffer] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Get the user data from local storage
  const storedUser = localStorage.getItem('user');
  const parsedUser = JSON.parse(storedUser);
  const services = parsedUser?.services || [];

  const handleCreateOfferClick = (service) => {
    setSelectedService(service);
    setShowSendServiceOffer(true);
  };

  if (showSendServiceOffer) {
    return <SendServiceOffer service={selectedService} aChat={aChat} />;
  }

  return (
    <div className="md:w-2/5 w-full p-4 bg-white rounded-lg shadow-md my-4" style={{ boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius: '10px', background: '#FFF' }}>
      <div className=" flex-wrap justify-between items-center my-4">
        <div className="flex items-center md:mb-4 mb-4">
          <FontAwesomeIcon icon={faPercent} className="text-teal-500 mr-2" size="1.5em" />
          <span className="text-teal-500">Create an offer</span>
        </div>

        {services.map((service) => (
          <div key={service._id} className="flex items-center md:mb-2 mb-2 sm:mb-0 sm:ml-4">
            <button
              onClick={() => handleCreateOfferClick(service)}
              className="flex flex-row items-center justify-center md:px-4 px-2 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50"
            >
              <img src={service.category.iconUrl} alt={service.name} className="w-4 h-4 mr-2" />
              <span className="text-teal-500">{service.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}