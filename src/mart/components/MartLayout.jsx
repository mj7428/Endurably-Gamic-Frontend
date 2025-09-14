import React from 'react';
import { Outlet } from 'react-router-dom';
import MartNavbar from './MartNavbar';
import Footer from '../../components/Footer';

const MartLayout = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans flex flex-col">
      <MartNavbar />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MartLayout;
