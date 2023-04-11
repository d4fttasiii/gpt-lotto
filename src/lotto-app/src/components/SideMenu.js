// src/components/SideMenu.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
          className="absolute top-2 right-4 text-green-400 hover:text-white"
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <NavLink
          to="/"
          className={"text-white block " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          Home
        </NavLink>
        <NavLink
          to="/game"
          className={"text-white block " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          Game
        </NavLink>
        <NavLink
          to="/past-rounds"
          className={"text-white block " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          Past Rounds
        </NavLink>
      </div>
    </CSSTransition>
  );
};

export default SideMenu;
