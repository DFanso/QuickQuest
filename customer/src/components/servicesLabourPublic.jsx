import React from 'react';
import '../styles/globals.css';

export default function LabourPageServices({ workerServices }) {
  return (
    <div className="mx-auto mt-4 py-4 md:py-2 max-w-screen-2xl px-2 md:px-20">
      <h2 className="text-lg pl-4 font-medium md:mb-6 mb-2 text-left text-black">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workerServices.map((service, index) => (
          <div key={index} className="p-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-black">
                  {service.name}
                </h3>
                <p className="text-gray-500">Starting at ${service.startingPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}