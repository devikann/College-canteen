import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddFoodItem() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      if (!imageFile) throw new Error('Please select an image!');

      // 1. Create a unique filename (e.g., 1672534-dosa.jpg)
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload image to Supabase Storage bucket 'food-images'
      let { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 3. Get the Public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('food-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 4. Save the Food Item details (including image URL) to the database
      const { error: dbError } = await supabase
        .from('food_items')
        .insert([{ 
            name, 
            price: parseFloat(price), 
            category, 
            image_url: imageUrl 
        }]);

      if (dbError) throw dbError;

      alert('Food Item Added Successfully!');
      setName(''); setPrice(''); setImageFile(null); // Clear form
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Add New Food Item</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="text" placeholder="Food Name (e.g. Masala Dosa)" 
          className="w-full border p-2 rounded" 
          value={name} onChange={(e) => setName(e.target.value)} required 
        />
        <input 
          type="number" placeholder="Price (₹)" 
          className="w-full border p-2 rounded" 
          value={price} onChange={(e) => setPrice(e.target.value)} required 
        />
        <select 
          className="w-full border p-2 rounded" 
          value={category} onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snacks">Snacks</option>
          <option value="Drinks">Drinks</option>
        </select>
        
        <label className="block text-sm font-medium text-gray-700">Food Image</label>
        <input 
          type="file" accept="image/*" 
          onChange={(e) => setImageFile(e.target.files[0])} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        />

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Add Item to Menu'}
        </button>
      </form>
    </div>
  );
}