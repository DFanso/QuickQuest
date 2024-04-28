"use client";
import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
    <Oval
      height={80}
      width={80}
      color="#14b8a6"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#14b8a6"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  </div>
  );
};

export default Loader;