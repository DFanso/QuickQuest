"use client";
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './globals.css';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>ADMIN | Quick-Quest</title>
        <meta name="description" content="Book your favorite quest with Quick Quest!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <Sidebar />
          {/* Content area with header */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header />
            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;