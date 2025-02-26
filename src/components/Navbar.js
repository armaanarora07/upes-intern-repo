import React from 'react';
import { useSelector } from 'react-redux';

const Navbar = () => {
    
  const {title} = useSelector((state)=> state.navbar);

  return (
    <nav className="bg-[#F9FAFC] bg-opacity-60 backdrop-blur-md h-16 flex items-center px-6 shadow-xl fixed top-0 right-0 left-64 z-10">
      <h1 className="text-[#4154f1] font-bold text-3xl">
        {title}
      </h1>
    </nav>
  );
};

export default Navbar;