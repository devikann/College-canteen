import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import Cart from './Pages/Cart';
import AdminDashboard from './Pages/admin/Dashboard'; // We will do this next
import { CartProvider } from './context/CartContext';
// Add this import
import ManageMenu from './Pages/admin/ManageMenu';

// Add this route inside <Routes>
<Route path="/admin/manage" element={<ManageMenu />} />

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu/:categoryName" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
export default App;
