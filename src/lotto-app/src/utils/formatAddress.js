// src/utils/formatAddress.js
export const formatAddress = (address, length = 6) => {
    if (!address) return '';
    return address.slice(0, length) + '...' + address.slice(-length);
  };
  