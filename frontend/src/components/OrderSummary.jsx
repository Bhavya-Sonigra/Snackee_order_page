import React from 'react';

export default function OrderSummary({ cartItems, paymentMethod, onChangePayment }) {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const deliveryFee = subtotal > 500 ? 0 : 50;
  

  const tax = subtotal * 0.05;
  

  const total = subtotal + deliveryFee + tax;
  

  const paymentMethods = ["Card", "Cash on Delivery", "UPI"];
  
  return (
    <div className="order-summary">
      <h3 className="section-title">Order Summary</h3>
      
      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="summary-row">
        <span>Delivery Fee</span>
        <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
      </div>
      
      <div className="summary-row">
        <span>Tax (5%)</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      
      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label className="form-label">Payment Method</label>
        <select 
          className="form-control"
          value={paymentMethod}
          onChange={(e) => onChangePayment(e.target.value)}
        >
          {paymentMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>
    </div>
  );
}