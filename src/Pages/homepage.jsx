import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">POFO*</div>
        <nav>
          <ul className="flex space-x-4">
            <li>HOME</li>
            <li>PAGES</li>
            <li>PORTFOLIO</li>
            <li>BLOG</li>
            <li>ELEMENTS</li>
            <li>FEATURES</li>
          </ul>
        </nav>
        <div className="flex space-x-4">
          <span>f</span>
          <span>t</span>
          <span>G</span>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center">
          <div className="w-1/2">
            <p className="text-pink-500 mb-2">Branding and Identity</p>
            <h1 className="text-6xl font-bold mb-6">Rubber Design</h1>
            <button className="bg-black text-white px-6 py-2">EXPLORE WORK</button>
          </div>
          <div className="w-1/2">
            <img src="/path-to-bottle-image.jpg" alt="The Wolf bottle" className="w-full" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;