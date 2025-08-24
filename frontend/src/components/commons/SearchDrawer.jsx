import React, { useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";

const SearchDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-[9999] ${isOpen ? 'block' : 'hidden'}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10  bg-opacity-50"></div>

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`absolute top-0 right-0 w-full max-w-md h-full bg-black text-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex  justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl">Search</h2>
          <IoClose onClick={onClose} className="text-3xl cursor-pointer" />
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchDrawer;
