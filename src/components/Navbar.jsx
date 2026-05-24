import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminNavbar() {
  return (
    <nav style={{ background: '#1e293b', padding: '15px', display: 'flex', gap: '20px' }}>
      <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Live Orders</Link>
      <Link to="/admin/manage" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Manage Menu</Link>
      <Link to="/" style={{ color: '#fb923c', textDecoration: 'none', marginLeft: 'auto' }}>Logout</Link>
    </nav>
  );
}