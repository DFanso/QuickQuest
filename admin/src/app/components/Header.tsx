import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl">QuickQuest</h1>
                {/* Other header content */}
            </div>
        </header>
    );
};

export default Header;
