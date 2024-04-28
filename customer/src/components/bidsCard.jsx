import React from 'react';

// Bid Card Component
const BidCard = ({ title, description, expiryDate, budget, imageUrl }) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-md bg-white" style={{ boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)' }}>
      <img className="w-full" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-medium text-black text-lg mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
        <p className="text-gray-600 text-base font-medium mt-2">Expiry Date: {expiryDate}</p>
        <p className="text-gray-600 text-base font-medium">Budget: {budget}</p>
      </div>
    </div>
  );
};

// Bids List Component
const BidsList = ({ bids }) => {
  return (
    <div className='mb-10'>
      <h2 className="text-xl text-black font-medium mb-4">My bids</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bids.map((bid, index) => (
          <BidCard key={index} {...bid} />
        ))}
      </div>
    </div>
  );
};


const myBids = [
  {
    title: 'Lawn mowing',
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    expiryDate: '2024/04/01',
    budget: '2024/04/01',
    imageUrl: '/images/lawn-mowing.png'
  },
  {
    title: 'Lawn mowing',
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    expiryDate: '2024/04/01',
    budget: '2024/04/01',
    imageUrl: '/images/lawn-mowing.png'
  },
  {
    title: 'Lawn mowing',
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    expiryDate: '2024/04/01',
    budget: '2024/04/01',
    imageUrl: '/images/lawn-mowing.png'
  },
  {
    title: 'Lawn mowing',
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    expiryDate: '2024/04/01',
    budget: '2024/04/01',
    imageUrl: '/images/lawn-mowing.png'
  },

];

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <BidsList bids={myBids} />
    </div>
  );
};

export default App;
