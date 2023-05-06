// src/components/SnackBar.js
import React, { useEffect, useState } from 'react';

const SnackBar = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  let bgColor;

  switch (type) {
    case 'error':
      bgColor = 'bg-red-400';
      break;
    case 'warning':
      bgColor = 'bg-yellow-400';
      break;
    case 'success':
      bgColor = 'bg-green-400';
      break;
    default:
      bgColor = 'bg-blue-400';
  }

  return (
    <div
      className={`w-80 sm:w-96 fixed bottom-4 font-bold right-4 p-4 rounded text-white shadow-md animate__animated animate__slideInUp ${bgColor}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default SnackBar;
