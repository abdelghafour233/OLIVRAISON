import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Admin Route - No Layout */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/:category" element={<Layout><Home /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;