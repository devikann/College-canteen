import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    // REAL-TIME: This listens for new orders automatically!
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        setOrders(current => [payload.new, ...current]);
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const updateStatus = async (orderId, newStatus) => {
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    fetchOrders(); // Refresh list
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#2563eb' }}>Canteen Admin Dashboard</h1>
      <div className="order-list">
        {orders.map(order => (
          <div key={order.id} className="food-card" style={{ display: 'block', borderLeft: '10px solid #f97316' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order ID: #{order.id}</strong>
              <span style={{ background: '#fef3c7', padding: '2px 10px', borderRadius: '10px' }}>{order.status}</span>
            </div>
            
            <p>Items: {order.items.map(i => i.name).join(', ')}</p>
            <p><strong>Total: ₹{order.total_price}</strong></p>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => updateStatus(order.id, 'Preparing')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Mark Preparing</button>
              <button onClick={() => updateStatus(order.id, 'Ready')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Mark Ready</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}