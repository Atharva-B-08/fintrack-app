import React from 'react';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="mt-16 ">
            <Outlet />
        </div>  
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
