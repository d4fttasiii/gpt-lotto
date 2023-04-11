// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import SideMenu from './components/SideMenu';
import TopBar from './components/TopBar';
import PastRounds from './pages/PastRounds';

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
            <Route path="/game" element={<Game />} />
            <Route path="/past-rounds" element={<PastRounds />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
