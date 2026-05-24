import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      navigate('/home'); // Go to categories after login
    }
  };

  return (
    <div className="login-container">
      <h2 style={{color: '#f97316'}}>College Canteen</h2>
      <p>Login to order your meal</p>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="College Email" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}