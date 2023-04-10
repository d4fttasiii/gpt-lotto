// src/components/SideMenu.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClover } from '@fortawesome/free-solid-svg-icons';

const SideMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <button
        className="bg-gray-800 text-white p-2 rounded fixed top-4 left-4 z-50"
        onClick={handleMenuToggle}
      >
        <FontAwesomeIcon icon={faClover} size="lg" />
      </button>
      <CSSTransition
        in={menuOpen}
        timeout={300}
        classNames="menu"
        unmountOnExit
        appear
      >
        <div className="bg-gray-800 w-64 fixed top-0 bottom-0 left-0 p-4 space-y-4">
          <div className="text-white text-xl">App Name</div>
          <NavLink
            to="/"
            className="text-white block"
            activeClassName="font-bold"
            exact
            onClick={handleMenuToggle}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className="text-white block"
            activeClassName="font-bold"
            onClick={handleMenuToggle}
          >
            Profile
          </NavLink>
        </div>
      </CSSTransition>
    </>
  );
};

export default SideMenu;
