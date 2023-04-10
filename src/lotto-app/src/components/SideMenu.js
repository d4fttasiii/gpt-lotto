// src/components/SideMenu.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

const SideMenu = ({ menuOpen, handleMenuToggle }) => {
  return (
    <CSSTransition
      in={menuOpen}
      timeout={300}
      classNames="menu"
      unmountOnExit
      appear
    >
      <div className="bg-gray-800 w-64 fixed top-0 bottom-0 left-0 p-4 space-y-4">
        <button
        className="absolute top-2 right-4 text-gray-200 hover:text-white"
        onClick={handleMenuToggle}
      >
        &times;
      </button>
        <NavLink
          to="/"
          className={"text-white block " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={"text-white block " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          Profile
        </NavLink>
      </div>
    </CSSTransition>
  );
};

export default SideMenu;
