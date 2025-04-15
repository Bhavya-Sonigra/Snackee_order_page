import { useState, useEffect } from 'react';
import FoodItem3D from './FoodItem3D';

export default function FoodItemsDisplay({ selectedItems, availableItems }) {
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    // Filter out items with valid item_id and map to include the full item details
    const itemsToDisplay = selectedItems
      .filter(item => item.item_id)
      .map(item => {
        const fullItemDetails = availableItems.find(avItem => 
          avItem.id.toString() === item.item_id.toString()
        );
        return {
          ...item,
          fullDetails: fullItemDetails || {}
        };
      });
    
    setDisplayItems(itemsToDisplay);
  }, [selectedItems, availableItems]);

  if (displayItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        <p>Select food items to see 3D previews</p>
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>3D Food Preview</h4>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: '20px'
      }}>
        {displayItems.map((item, idx) => (
          <div key={idx} style={{ 
            textAlign: 'center',
            background: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <FoodItem3D 
              itemName={item.fullDetails.name || 'Unknown'} 
              size={120} 
            />
            <div style={{ marginTop: '8px' }}>
              <strong>{item.fullDetails.name || 'Unknown'}</strong>
              <div>Qty: {item.quantity}</div>
              {item.weight && <div>Weight: {item.weight}g</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}