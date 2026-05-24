import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('food_items').select('*');
    setItems(data || []);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      // 1. Upload Image to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('food-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // 2. Save Item to Database
      const { error } = await supabase.from('food_items').insert([
        { name, price: parseFloat(price), category, image_url: imageUrl }
      ]);

      if (error) throw error;

      alert("Item added successfully!");
      setName(''); setPrice(''); setImageFile(null);
      fetchItems(); // Refresh list
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete this item?")) {
      await supabase.from('food_items').delete().eq('id', id);
      fetchItems();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Canteen Menu</h2>

      {/* Form to Add New Item */}
      <form onSubmit={handleAddItem} style={{ background: '#f3f4f6', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
        <h3>Add New Item</h3>
        <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required style={styles.input} />
        
        <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snacks">Snacks</option>
          <option value="Hot & Cold">Hot & Cold</option>
        </select>

        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={styles.input} />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Adding..." : "Add to Menu"}
        </button>
      </form>

      {/* List of Current Items */}
      <h3>Current Menu</h3>
      <div className="food-list">
        {items.map(item => (
          <div key={item.id} className="food-card" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={item.image_url} alt="" style={{ width: '50px', height: '50px', borderRadius: '5px', marginRight: '10px' }} />
              <div>
                <strong>{item.name}</strong> - ₹{item.price}
                <div style={{ fontSize: '12px', color: 'gray' }}>{item.category}</div>
              </div>
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  input: { display: 'block', width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' },
  button: { background: '#f97316', color: 'white', border: 'none', padding: '12px', width: '100%', borderRadius: '8px', fontWeight: 'bold' }
};