import { useState, useEffect } from "react";
import "./styles/OrderPage.css";
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

const API_URL = "http://localhost:5000/api";

export default function OrderPage() {
  const [items, setItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Fetch available items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/items`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load items. Please try again later.");
        setLoading(false);
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  const handleQuantityChange = (itemId, change) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1 && change > 0) {
        // Add new item to cart
        const item = availableItems.find(item => item.id === itemId);
        return [...prevCart, { ...item, quantity: 1 }];
      }

      const newCart = [...prevCart];
      const newQuantity = (prevCart[itemIndex]?.quantity || 0) + change;

      if (newQuantity <= 0) {
        // Remove item from cart
        return prevCart.filter(item => item.id !== itemId);
      }

      newCart[itemIndex] = { ...newCart[itemIndex], quantity: newQuantity };
      return newCart;
    });
  };

  const addToCart = (itemId) => {
    handleQuantityChange(itemId, 1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="order-page">
      <h1 className="main-title">Snackee - Delicious Indian Snacks</h1>
      
      <div className="menu-section">
        <h2 className="section-title">Menu</h2>
        <div className="food-items-grid">
          {availableItems.map(item => (
            <div key={item.id} className="food-item-card">
              <div className="food-item-image">
                {item.name[0]}
              </div>
              <div className="food-item-details">
                <h3 className="food-item-name">{item.name}</h3>
                <div className="food-item-price">₹{item.price}</div>
                {cart.find(cartItem => cartItem.id === item.id) ? (
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">
                      {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                    </span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                ) : (
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item.id)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <h2 className="cart-title">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty. Add some delicious snacks!</p>
        ) : (
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="cart-item-price">₹{item.price * item.quantity}</div>
              </div>
            ))}
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}