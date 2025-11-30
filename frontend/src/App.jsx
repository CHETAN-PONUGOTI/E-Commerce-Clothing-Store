// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

const App = () => {
  return (
    <Router>
      <CartProvider> 
        <AuthProvider>
          <Navbar />
          <main className="container py-8">
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id" element={<OrderSuccess />} />
            </Routes>
          </main>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
};

export default App;