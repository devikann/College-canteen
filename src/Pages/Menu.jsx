import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const { categoryName } = useParams(); // Gets 'Breakfast' or 'Lunch' from URL
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('category', categoryName);

      if (error) console.log("Error fetching menu:", error);
      else setFoodItems(data);
      setLoading(false);
    };

    fetchMenu();
  }, [categoryName]);

  return (
    <div className="menu-page">
      <div className="menu-header">
        <button onClick={() => navigate('/home')}>← Back</button>
        <h2>{categoryName} Menu</h2>
      </div>

      {loading ? <p>Loading delicious food...</p> : (
        <div className="food-list">
          {foodItems.map((item) => (
            <div key={item.id} className="food-card">
              <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} />
              <div className="food-info">
                <h3>{item.name}</h3>
                <p className="price">₹{item.price}</p>
                <button className="add-btn" onClick={() => addToCart(item)}>
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="cart-footer" onClick={() => navigate('/cart')}>
          <span>{cart.length} Items in Cart</span>
          <button>View Cart →</button>
        </div>
      )}
    </div>
  );
}