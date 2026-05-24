import React from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, totalPrice, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    // 1. Get the current logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to place an order");
      return;
    }

    // 2. Prepare the order data
    const orderData = {
      user_id: user.id,
      items: cart, // This stores the array of food items as JSON
      total_price: totalPrice,
      status: 'Pending'
    };

    // 3. Insert into Supabase 'orders' table
    const { error } = await supabase.from('orders').insert([orderData]);

    if (error) {
      alert("Error placing order: " + error.message);
    } else {
      alert("Order Placed Successfully! Proceed to the counter.");
      clearCart(); // Empty the cart
      navigate('/home'); // Send student back to home
    }
  };

  return (
    <div className="cart-page" style={{ padding: '20px' }}>
      <h2>Your Cart 🛒</h2>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Your cart is empty!</p>
          <button onClick={() => navigate('/home')} className="add-btn">Browse Menu</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="food-card" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary" style={{ marginTop: '30px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
            <h3>Total: ₹{totalPrice}</h3>
            <button 
              onClick={handlePlaceOrder}
              className="login-btn"
              style={{ marginTop: '20px' }}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}