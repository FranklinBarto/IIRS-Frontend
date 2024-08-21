import React from 'react';
import Globe from '../Components/globe';
import Navbar from '../Components/navbar';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center">
          <div className="w-1/2 space-y-4 lg:space-y-8">
            <p className="text-xl text-pink-500 ml-6">Farming Decision Support</p>
            <h1 className="text-6xl font-bold mb-6 mt-2">Agriculture Geoportal</h1>
            <div className=" text-white">
              <a href={`/visualization`} className='bg-black text-xl px-6 py-2 font-semibold'>View Data</a>
            </div>
          </div>
          <div className="w-1/2">
            <Globe/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;