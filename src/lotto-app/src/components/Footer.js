import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-16 fixed bottom-0 w-full">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <a
            href="https://github.com/d4fttasiii/gpt-lotto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
          <a
            href="https://twitter.com/d4fttasiii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-800 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
        </div>
        <p className="text-sm font-bold">
          <FontAwesomeIcon icon={faCopyright} /> {new Date().getFullYear()} Lucky Shiba. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
