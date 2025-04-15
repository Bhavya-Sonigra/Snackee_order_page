import React from 'react';
import FoodItem3D from './FoodItem3D';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
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

  const handleIncrement = () => {
    onUpdateQuantity(item.item_id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.item_id, item.quantity - 1);
    } else {
      onRemove(item.item_id);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <div 
          className="cart-item-image"
          style={{ backgroundColor: generateColor(item.name) }}
        >
          <FoodItem3D itemName={item.name} size={60} />
        </div>
        <div>
          <div className="cart-item-name">{item.name}</div>
          <div className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
        </div>
      </div>
      
      <div className="cart-quantity-control">
        <button 
          className="quantity-btn" 
          onClick={handleDecrement}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button 
          className="quantity-btn" 
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}