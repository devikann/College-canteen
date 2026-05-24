import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Breakfast', icon: '🍳', color: '#FFF7ED' },
  { id: 2, name: 'Lunch', icon: '🍱', color: '#F0FDF4' },
  { id: 3, name: 'Snacks', icon: '🍔', color: '#EFF6FF' },
  { id: 4, name: 'Hot & Cold', icon: '☕', color: '#FFF1F2' }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header>
        <h1>Welcome! 👋</h1>
        <p>Select a category to see the menu</p>
      </header>

      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="category-card"
            style={{ backgroundColor: cat.color }}
            onClick={() => navigate(`/menu/${cat.name}`)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}