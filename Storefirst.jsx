import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa"; 
import "./Storefirst.css";

const Storefirst = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartVisible, setCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch products from the backend
    axios.get("http://localhost:5000/api/store/products").then((response) => {
      setProducts(response.data);
    });

    // Fetch cart data
    axios.get("http://localhost:5000/api/store/cart").then((response) => {
      setCart(response.data.products);
    });
  }, []);

  const addToCart = (productId) => {
    axios.post("http://localhost:5000/api/store/cart", { productId }).then((response) => {
      setCart(response.data.products);
      alert("Product added to cart!");
    });
  };

  const updateQuantity = (productId, quantity) => {
    axios.put("http://localhost:5000/api/store/cart", { productId, quantity }).then((response) => {
      setCart(response.data.products);
    });
  };

  const removeProductFromCart = (productId) => {
    axios.delete(`http://localhost:5000/api/store/cart/${productId}`).then((response) => {
      setCart(response.data.products);
    });
  };

  const removeAllFromCart = () => {
    axios.delete("http://localhost:5000/api/store/cart").then(() => {
      setCart([]);
    });
  };

  const toggleCartVisibility = () => {
    setCartVisible(!isCartVisible);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = (productId = null) => {
    navigate("/checkout", {
      state: { productId, cart },
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans mb-10 relative">
      {/* Cart Slider */}
      <div className={`cart-slider ${isCartVisible ? "cart-slider-open" : ""}`}>
        <div className="cart-header">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={toggleCartVisibility} className="close-cart-btn">
            X
          </button>
        </div>
        <div className="cart-content">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.productId._id} className="cart-item">
                <img
                  src={item.productId.defaultImage}
                  alt={item.productId.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <p>{item.productId.name}</p>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                      disabled={item.quantity <= 0}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeProductFromCart(item.productId._id)}
                    className="remove-product-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty!</p>
          )}
        </div>
        <div className="cart-footer">
          <button onClick={removeAllFromCart} className="remove-all-btn">
            Remove All
          </button>
          <button
            onClick={() => handleCheckout()}
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md p-4 text-center">
        <p className="text-md text-gray-500 hover:text-sky-400 hover:text-lg">
          All Puja Essentials, Gemstones, and More
        </p>
      </header>

      {/* Cart Button with react-icons */}
      {!isCartVisible && (
        <button
          className="cart-btn bg-green-500 text-white px-4 py-2 rounded-md absolute top-4 right-4"
          onClick={toggleCartVisibility}
        >
          <FaShoppingCart size={24} color="white" />
          {cart.length > 0 && (
            <span className="cart-count absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      )}
      

      {/* Search */}
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-l-md p-2 w-1/3"
        />
        <button className="bg-yellow-500 text-white px-4 rounded-r-md hover:bg-yellow-600">
          Search
        </button>
      </div>

      {/* Products */}
      <section className="mt-8 px-4">
        {filteredProducts.length > 0 ? (
          <>
            {["SPIRITUAL PRODUCT", "GEMSTONE"].map((category) => (
              <div key={category}>
                <h2
                  className={`text-xl font-bold text-center mt-8 font-serif text-${
                    category === "SPIRITUAL PRODUCT" ? "lime-500" : "green-700"
                  }`}
                >
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {filteredProducts
                    .filter((product) => product.category === category)
                    .map((product) => (
                      <div
                        className="p-4 product-card"
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative border rounded-lg p-4">
                          <img
                            src={product.defaultImage}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <h3 className="mt-4 text-lg font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-gray-500">₹{product.price}</p>
                          <button
                            className="mt-4 py-2 px-4 w-full rounded bg-blue-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product._id);
                            }}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="mt-2 py-2 px-4 w-full rounded bg-green-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product._id);

                            }}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-lg text-gray-600 mt-8">
            No Matches Found
          </div>
        )}
      </section>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              X
            </button>
            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <div className="images flex space-x-4 mt-4 justify-center">
              <img
                src={selectedProduct.defaultImage}
                alt="Main"
                className="w-1/3 h-auto object-cover"
              />
              <img
                src={selectedProduct.hoverImage}
                alt="Hover"
                className="w-1/3 h-auto object-cover"
              />
            </div>
            <p className="mt-4 text-gray-600">{selectedProduct.description}</p>
            <p className="mt-2 font-bold">Price: ₹{selectedProduct.price}</p>
            <button
              className="mt-4 py-2 px-4 w-full bg-green-600 text-white"
              onClick={() => addToCart(selectedProduct._id)}
            >
              Add to Cart
            </button>
            <button
              className="mt-2 py-2 px-4 w-full bg-blue-600 text-white"
              onClick={() => addToCart(selectedProduct._id)}

            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefirst;
