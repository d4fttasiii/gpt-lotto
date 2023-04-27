// src/components/SideMenu.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faHistory, faMoneyCheck, faClover } from '@fortawesome/free-solid-svg-icons';

const SideMenu = ({ menuOpen, handleMenuToggle }) => {
  return (
    <CSSTransition
      in={menuOpen}
      timeout={300}
      classNames="menu"
      unmountOnExit
      appear
    >
      <div className="bg-gray-800 z-10 w-64 fixed top-0 bottom-0 left-0 p-4 space-y-4">
        <div>
          <button
            className="text-green-400"
            onClick={handleMenuToggle}
          >
            <FontAwesomeIcon icon={faClover} size="lg" />
          </button>
          <span className="text-yellow-600 text-xl font-semibold ml-2">Lucky Shiba</span>
        </div>
        <NavLink
          to="/"
          className={"mb-3 text-white block hover:text-gray-400 transition-colors duration-200 " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon className='text-green-400 mr-1' icon={faHome}></FontAwesomeIcon> Home
        </NavLink>

        <NavLink
          to="/game"
          className={"mb-3 text-white block hover:text-gray-400 transition-colors duration-200 " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon className='text-green-400 mr-1' icon={faMoneyCheck}></FontAwesomeIcon> Game
        </NavLink>

        <NavLink
          to="/my-tickets"
          className={"mb-3 text-white block hover:text-gray-400 transition-colors duration-200 " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon className='text-green-400 mr-1' icon={faTicket}></FontAwesomeIcon> My Tickets
        </NavLink>

        <NavLink
          to="/past-rounds"
          className={"mb-3 text-white block hover:text-gray-400 transition-colors duration-200 " + (({ isActive, isPending }) => isActive ? "font-bold" : "")}
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon className='text-green-400 mr-1' icon={faHistory}></FontAwesomeIcon> Past Rounds
        </NavLink>
      </div>
    </CSSTransition>
  );
};

export default SideMenu;
