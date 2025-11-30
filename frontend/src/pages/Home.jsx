import React from 'react';
import Products from './Products';

const Home = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your DressUps!</h1>
        <Products />
    </div>
  );
};

export default Home;