import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;