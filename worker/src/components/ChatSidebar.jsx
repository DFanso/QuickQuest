import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

export default function MobileChatSidebar({ chats, onSelectChat }) {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat._id);
    onSelectChat(chat);

  };

  return (
    <div className="w-1/3 md:w-1/4 md:text-base text-xs md:m-2 p-4 bg-white rounded-xl shadow" style={{ boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)', borderRadius: '10px', height: "90%" }}>
      <div className="flex items-center p-1 rounded" style={{ backgroundColor: 'rgba(79, 184, 179, 0.30)', color: '#173735' }}>
        <FaSearch className="mr-2 text-teal-900" />
        <input className="flex-grow rounded bg-transparent focus:outline-none placeholder-teal-900" placeholder="Search" />
      </div>
      <div className="mt-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        {chats.map((chat) => (
          <div key={chat._id} onClick={() => handleSelectChat(chat)} className={`flex items-center p-2 rounded cursor-pointer border-2 mt-2 ${selectedChat === chat._id ? 'border-teal-500' : 'border-transparent'} hover:border-teal-500 `}>
            <img className="md:w-10 md:h-10 w-5 h-5 rounded-full mr-2 object-cover" src={chat.customer.profileImage} alt={`${chat.customer.firstName} ${chat.customer.lastName}`} />
            <div className="flex-grow ">
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color: '#173735' }}>{chat.customer.firstName} {chat.customer.lastName}</span>
                <span className=" text-xs" style={{ color: '#828282' }}>{new Date(chat.updatedAt).toLocaleString()}</span>
              </div>
              {chat.messages.length > 0 && (
                <p className="text-sm text-gray-500">
                  {typeof chat.messages[chat.messages.length - 1].content === 'string'
                    ? chat.messages[chat.messages.length - 1].content
                    : 'Offer'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}