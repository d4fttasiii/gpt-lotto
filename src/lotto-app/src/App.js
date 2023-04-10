// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SideMenu from './components/SideMenu';
import TopBar from './components/TopBar';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <BrowserRouter>
      <div>
        <TopBar handleMenuToggle={handleMenuToggle} />
        <div className="mt-16">
          <SideMenu menuOpen={menuOpen} handleMenuToggle={handleMenuToggle} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
