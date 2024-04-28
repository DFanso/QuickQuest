"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { TiMessages } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { useAuth } from '@/app/contexts/AuthContext';

const LoggedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();


  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between p-4 shadow-md relative">
      <Link href="/">
        <div className="text-3xl font-bold text-teal-500">
          QuickQuest
        </div>
      </Link>
      <div className="hidden md:flex space-x-10">
        <Link href="/">
          <span className="text-black hover:text-teal-500 text-base transition duration-500">Home</span>
        </Link>
        <Link href="/bids">
          <span className="text-black hover:text-teal-500 text-base transition duration-500">Bids</span>
        </Link>
        <Link href="/chat">
          <div><TiMessages className='text-gray-500 text-2xl hover:text-teal-500 duration-500' /></div>
        </Link>
        <Link href="/profile">
          <div><CgProfile className='text-gray-500 text-2xl hover:text-teal-500 duration-500 mr-8' /></div>
        </Link>
      </div>
      <div className="md:hidden flex items-center">
        {!isMenuOpen && (
          <button onClick={() => setIsMenuOpen(true)}>
            <FaBars className="h-6 w-6 text-black" />
          </button>
        )}
      </div>
      <Transition
        show={isMenuOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-300 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="fixed inset-0 w-full h-full z-50 bg-white"
        aria-labelledby="mobile-menu"
      >
        {(ref) => (
          <div ref={ref} className="w-full h-full">
            <div className="flex justify-end p-8">
              <button onClick={() => setIsMenuOpen(false)}>
                <FaTimes className="h-6 w-6 text-black" />
              </button>
            </div>
            <div className="px-5 py-2" onClick={closeMenu}>
              <Link href="/">
                <span className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Home</span>
              </Link>
              <Link href="/bids" onClick={closeMenu}>
                <span className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Bids</span>
              </Link>
              <Link href="/chat" onClick={closeMenu}>
                <span className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Chat</span>
              </Link>
              <Link href="/profile" onClick={closeMenu}>
                <span className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Profile</span>
              </Link>
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
};

export default LoggedNavbar;