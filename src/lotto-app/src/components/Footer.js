import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-16 fixed bottom-0 w-full">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Lucky Shiba. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
