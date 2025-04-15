import { useState, useEffect } from "react";
import FoodItemCard from "./components/FoodItemCard";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";
import FoodItemsDisplay from "./components/FoodItemsDisplay";
import "./styles/OrderPage.css";

const API_URL = "http://localhost:5000/api";

export default function NewOrderPage() {
  // Customer information state
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  
  // Payment method state
  const [payment, setPayment] = useState("Card");
  
  // Available items state
  const [availableItems, setAvailableItems] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Order success state
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Active section state (for mobile view)
  const [activeSection, setActiveSection] = useState('menu'); // 'menu' or 'cart'
  // Track window width for responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle customer information changes
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Add item to cart
  const handleAddToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.item_id === item.item_id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, item];
      }
    });
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.item_id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // Remove item from cart
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.item_id !== itemId));
  };

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

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate cart is not empty
    if (cartItems.length === 0) {
      setError("Please add at least one item to your cart.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for backend submission
      const orderData = {
        customer,
        items: cartItems.map(item => ({
          item_id: parseInt(item.item_id),
          quantity: parseInt(item.quantity),
          weight: ""
        })),
        payment
      };
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrderDetails(data);
      setOrderSuccess(true);
      
      // Reset form
      setCustomer({ name: "", email: "", phone: "" });
      setCartItems([]);
      setPayment("Card");
    } catch (err) {
      setError(err.message || "Failed to submit order. Please try again.");
      console.error("Error submitting order:", err);
    } finally {
      setLoading(false);
    }
  };

  // If order was successful, show confirmation
  if (orderSuccess) {
    return (
      <div className="order-page-container">
        <div className="section">
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Order Confirmed!</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '5rem', color: 'var(--success-color)', marginBottom: '1rem' }}>✓</div>
            <p>Thank you for your order, {orderDetails.customer_name}!</p>
            <p>Your order ID is: <strong>#{orderDetails.id}</strong></p>
            <p>Total amount: <strong>₹{orderDetails.total_amount}</strong></p>
            <p>Payment method: <strong>{orderDetails.payment_method}</strong></p>
          </div>
          
          <button 
            className="btn btn-primary btn-block"
            onClick={() => setOrderSuccess(false)}
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && !error) {
    return (
      <div className="order-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading...</h2>
          <p>Please wait while we prepare your delicious snacks!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page-container">
      <h1 className="page-title">Snackee - Delicious Indian Snacks</h1>
      
          {/* Mobile view tabs */}
      <div className="mobile-tabs" style={{ display: windowWidth <= 768 ? 'flex' : 'none', marginBottom: '1rem' }}>
        <button 
          className={`tab-btn ${activeSection === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveSection('menu')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px 0 0 8px' }}
        >
          Menu
        </button>
        <button 
          className={`tab-btn ${activeSection === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveSection('cart')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '0 8px 8px 0' }}
        >
          Cart ({cartItems.length})
        </button>
      </div>
      
      {/* Main content */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {/* Menu section */}
        <div style={{ flex: '1 1 600px', display: activeSection === 'cart' && windowWidth <= 768 ? 'none' : 'block' }}>
          <div className="section">
            <h2 className="section-title">Menu</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            {availableItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No items available at the moment. Please check back later.</p>
              </div>
            ) : (
              <div className="food-items-grid">
                {availableItems.map(item => (
                  <FoodItemCard 
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Cart section */}
        <div style={{ flex: '1 1 350px', display: activeSection === 'menu' && windowWidth <= 768 ? 'none' : 'block' }}>
          <div className="section">
            <h2 className="section-title">Your Cart</h2>
            
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Your cart is empty. Add some delicious snacks!</p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div style={{ marginBottom: '2rem' }}>
                  {cartItems.map(item => (
                    <CartItem
                      key={item.item_id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
                
                {/* Order summary */}
                <OrderSummary 
                  cartItems={cartItems}
                  paymentMethod={payment}
                  onChangePayment={setPayment}
                />
              </>
            )}
            
            {/* Customer information form */}
            {cartItems.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 className="section-title">Customer Information</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    style={{ marginTop: '1.5rem' }}
                  >
                    Place Order
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 3D Food Preview Section */}
      {cartItems.length > 0 && (
        <div className="preview-section">
          <FoodItemsDisplay 
            selectedItems={cartItems} 
            availableItems={availableItems} 
          />
        </div>
      )}
    </div>
  );
}