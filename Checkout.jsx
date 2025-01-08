import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart } = location.state || {}; 
  const [orderDetails, setOrderDetails] = useState(cart || []);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    // If cart is empty or undefined, redirect to store page
    if (!orderDetails || orderDetails.length === 0) {
      navigate("/store");
    }
  }, [orderDetails, navigate]);

  const calculateSubtotal = () => {
    return orderDetails.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  // Calculate delivery date (7 days from now)
  const calculateDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const day = today.getDate();
    const month = today.getMonth() + 1; 
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Validation function to check if fields are filled properly
  const validateFields = () => {
    const { name, address, phone } = shippingDetails;

    // Full name validation (must have first and last name, only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name || name.split(" ").length < 2 || !nameRegex.test(name)) {
      return "Please provide your full name (first and last name). Only letters and spaces are allowed.";
    }

    // Address validation
    if (!address) {
      return "Please provide your address.";
    }

    // Phone number validation (only numbers, basic validation for length)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return "Please provide a valid 10-digit phone number.";
    }

    return ""; // No error
  };
  const handlePlaceOrder = () => {
    const validationError = validateFields();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
  
    // Prepare order data
    const orderData = {
      shipping: shippingDetails, 
      paymentMethod: "cod", 
    };
  
    axios
      .post("http://localhost:5000/api/store/order", orderData)
      .then((response) => {
        const orderId = response.data.order._id;
        // Redirect to the payment page with the order ID
        navigate("/payment", { state: { orderId } });
      })
      .catch((error) => {
        alert("Something went wrong. Please try again.");
      });
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
      )}

      {/* Shipping Details */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingDetails.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingDetails.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingDetails.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </form>
      </section>

      {/* Order Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {orderDetails.map((item) => (
            <div className="flex items-center space-x-4 border-b pb-4" key={item.productId._id}>
              <div className="flex-1">
                <p className="font-semibold">{item.productId.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="text-gray-500">₹{item.productId.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal and Final Total */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹50.00</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{calculateSubtotal() + 50}</span>
          </div>
        </div>

        {/* Delivery Date */}
        <div className="mt-4">
          <div className="flex justify-between">
            <span>Estimated Delivery Date:</span>
            <span>{calculateDeliveryDate()}</span>
          </div>
        </div>
      </section>

      {/* Checkout Button */}
      <div className="flex justify-center">
        <button
          onClick={handlePlaceOrder}
          className="w-full md:w-auto py-3 px-8 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
