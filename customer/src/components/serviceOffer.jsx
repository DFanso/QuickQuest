import React from 'react';
import Link from 'next/link';
import { MdOutlineTimer, MdOutlineLocalOffer } from "react-icons/md";

export default function ServiceOffer({ offer }) {
  const isOfferAcceptedOrExpired = offer.status === 'ACCEPTED' || new Date(offer.expireDate) < new Date();

  return (
    <div
      className="md:w-3/5 w-full p-4 bg-white rounded-lg shadow-md my-4"
      style={{
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        background: '#FFF',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="icon text-white rounded-full p-2 mr-2">
            <img src={offer.icon} alt={offer.service.name} className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-teal-500">{offer.service.name}</h3>
        </div>
        <span className="text-teal-500 font-semibold text-lg">${offer.price}</span>
      </div>
      <p className="text-teal-900 my-2">{offer.description}</p>
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center">
          <MdOutlineTimer className="text-teal-500" size="1.5em" />
          <span className="ml-2 text-teal-500">{new Date(offer.deliveryDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <MdOutlineLocalOffer className="text-teal-500" size="1.5em" />
          <span className="ml-2 text-teal-900 font-medium">
            Offer expires in {Math.ceil((new Date(offer.expireDate) - new Date()) / (1000 * 60 * 60 * 24))} days
          </span>
        </div>
      </div>
      <div className="text-right">
        {isOfferAcceptedOrExpired ? (
          <button
            className="bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
            disabled
          >
            {offer.status}
          </button>
        ) : (
          <Link href={`/acceptOffer?offerId=${offer._id}`}>
            <button className="bg-teal-500 text-white py-2 px-4 rounded-lg">Accept Offer</button>
          </Link>
        )}
      </div>
    </div>
  );
}