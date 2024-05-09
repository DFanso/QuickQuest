"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing FontAwesome icons

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <Link href="/login">
                    <span className="text-black hover:text-teal-500 text-base transition duration-500">Login</span>
                </Link>
                <Link href="/signup">
                    <span className="text-black hover:text-teal-500 text-base transition duration-500 mr-6">Sign-up</span>
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
                        <div className="px-5 py-2">
                            <Link href="/">
                                <span onClick={closeMenu} className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Home</span>
                            </Link>
                            <Link href="/login">
                                <span onClick={closeMenu} className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Login</span>
                            </Link>
                            <Link href="/signup">
                                <span onClick={closeMenu} className="text-black hover:text-teal-500 block px-3 py-2 text-xl font-medium">Sign-up</span>
                            </Link>
                        </div>
                    </div>
                )}
            </Transition>
        </nav>
    );
};

export default Navbar;
