// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import Home from './Home';
import Profile from './Profile';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <SideMenu />
        <div className="flex-grow flex flex-col">
          <TopBar />
          <div className="container mx-auto p-4 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
