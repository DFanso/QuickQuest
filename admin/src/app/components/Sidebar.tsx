import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTags, faShoppingCart } from '@fortawesome/free-solid-svg-icons';


const Sidebar = () => {
    return (
        <aside className="bg-[rgba(79,184,179,0.20)] border-r border-gray-200 h-full w-15 min-h-screen text-black pt-16">
            <nav className="flex flex-col p-4">
                <a href="/" className="flex items-center p-4 text-black hover:bg-gray-100 rounded-md">
                    <FontAwesomeIcon icon={faHome} className="h-5 w-5 mr-4" />
                    Dashboard
                </a>
                <a href="/categories" className="flex items-center p-4 text-black hover:bg-gray-100 rounded-md">
                    <FontAwesomeIcon icon={faTags} className="h-5 w-5 mr-4" />
                    Categories
                </a>
                <a href="/orders" className="flex items-center p-4 text-black hover:bg-gray-100 rounded-md">
                    <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5 mr-4" />
                    Orders
                </a>

            </nav>
        </aside>
    );
};

export default Sidebar;
