// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import SideMenu from './components/SideMenu';
import TopBar from './components/TopBar';
import PastRounds from './pages/PastRounds';
import Footer from './components/Footer';
import { useWeb3React } from '@web3-react/core';
import { useSnackBar } from './contexts/SnackBarContext';
import Main from './pages/Main';

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
