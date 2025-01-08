import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };
  const handleGoStore = () => {
    navigate("/store");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-3xl font-semibold text-green-600 mb-4">Order Placed Successfully!</h2>
      <p className="text-xl text-gray-700 mb-6">
        Thank you for your order. Your order will be processed and shipped shortly.
      </p>
     
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Go to Home
      </button>
      <h3 className=' text-4xl justify-center items-center mt-4'>Or</h3>
      <div className='text-xl text-gray-700 mb-6 mt-3'>
      <p>Continue Shopping by going to Store</p>
      <button
      onClick={handleGoStore}
        className="px-6 py-3 mt-5 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"

      >Go to Store</button>
    </div>
    </div>
    
  );
};

export default OrderSuccess;
