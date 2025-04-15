import { useState } from 'react';
import FoodItem3D from './FoodItem3D';
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

// Component to display a food item card with image and add to cart functionality
export default function FoodItemCard({ item, onAddToCart }) {
  const [showPreview, setShowPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Generate a color based on the item name for consistent background colors
  const generateColor = (name) => {
    const colors = [
      '#FFD8A9', // Light Orange
      '#F1F7B5', // Light Yellow
      '#D8F8B7', // Light Green
      '#B7E5F8', // Light Blue
      '#F8B7D8', // Light Pink
      '#E5B7F8', // Light Purple
    ];
    
    // Use the sum of character codes to pick a color
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };
  
  const handleAddToCart = () => {
    onAddToCart({
      item_id: item.id.toString(),
      name: item.name,
      quantity: quantity,
      price: item.price
    });
    
    // Reset quantity after adding to cart
    setQuantity(1);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };
  
  return (
    <ErrorBoundary>
      <div className="food-item-card">
        <div 
          className="food-item-image"
          style={{ backgroundColor: generateColor(item.name) }}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <FoodItem3D itemName={item.name} size={180} />
          ) : (
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.2)',
              textTransform: 'uppercase'
            }}>
              {item.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="food-item-details">
          <h3 className="food-item-name">{item.name}</h3>
          <div className="food-item-price">₹{(parseFloat(item.price) || 0).toFixed(2)}</div>
          
          <div className="food-item-actions">
            <div className="cart-quantity-control">
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}