import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import Cart from './Pages/Cart';
import AdminDashboard from './Pages/admin/Dashboard';
import ManageMenu from './Pages/admin/ManageMenu';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Student Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/menu/:categoryName" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage" element={<ManageMenu />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;