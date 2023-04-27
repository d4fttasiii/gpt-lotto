// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import TopBar from './components/TopBar';
import { useSnackBar } from './contexts/SnackBarContext';
import Main from './pages/Main';
import MyTickets from './pages/MyTickets';
import Game from './pages/Game';
import PastRounds from './pages/PastRounds';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { showSnackBar } = useSnackBar();
  const { account } = useWeb3React();

  const handleMenuToggle = () => {
    if (!account) {
      showSnackBar('Metamask wallet needs to be connected first!', 'error');
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <BrowserRouter>
      <div>
        <TopBar handleMenuToggle={handleMenuToggle} />
        <div className="mt-16">
          <SideMenu menuOpen={menuOpen} handleMenuToggle={handleMenuToggle} />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/game" element={<Game />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/past-rounds" element={<PastRounds />} />
            <Route path="*" element={<Main />} />
          </Routes>
        </div>
        <Footer /> {/* Include the Footer component */}
      </div>
    </BrowserRouter>
  );
}

export default App;
