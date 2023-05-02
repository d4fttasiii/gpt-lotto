// src/components/CopyToClipboardText.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { formatAddress } from '../utils/formatAddress';
import { useSnackBar } from '../contexts/SnackBarContext';

const CopyToClipboardText = ({ text, maxLength }) => {
  const { showSnackBar } = useSnackBar();

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        window.Clipboard.writeText(text);
      }
      showSnackBar('Copied', 'warning');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="inline-flex items-center space-x-2">
      <span className="text-sm sm:text-2xl font-bold text-yellow-500">{formatAddress(text, maxLength)}</span>
      <button
        className='ml-2 w-8 h-8 text-white rounded-full focus:outline-none bg-yellow-600 hover:bg-yellow-700 animate__animated animate__infinite animate__pulse'
        onClick={handleCopy}
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>
    </div>
  );
};

export default CopyToClipboardText;
