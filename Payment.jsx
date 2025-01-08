import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null); 

  const { orderId } = location.state || {}; 

  useEffect(() => {
    if (orderId) {
      // Fetch order details from the backend using the order ID
      axios
        .get(`http://localhost:5000/api/store/order/${orderId}`)
        .then((response) => {
          setOrder(response.data);
        })
        .catch((error) => {
          alert("Failed to fetch order details.");
        });
    }
  }, [orderId]);

  const handlePayment = () => {
    // Simulate the payment process
    alert("Payment successful! Thank you for your order.");

    // Redirect to the order summary page after payment
    navigate("/order-summary", { state: { order } });
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Payment</h1>

      {/* Order Details / Invoice */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Invoice</h2>
        <div className="space-y-4">
          <p><strong>Order ID:</strong> {order._id}</p>
          {order.products.map((item) => (
            <div key={item.productId._id} className="flex items-center space-x-4 border-b pb-4">
              <p className="font-semibold">{item.productId.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p className="text-gray-500">₹{item.productId.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Subtotal and Final Total */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹50.00</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{order.totalAmount + 50 }</span>
          </div>
        </div>
      </section>

      {/* Payment Option */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div>
          <button
            onClick={handlePayment}
            className="w-full py-3 px-8 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Cash on Delivery
          </button>
        </div>
      </section>
    </div>
  );
};

export default Payment;
