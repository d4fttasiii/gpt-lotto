// src/contexts/SnackBarContext.js
import { createContext, useContext, useState } from 'react';
import SnackBar from '../components/SnackBar';

const SnackBarContext = createContext();

export const useSnackBar = () => {
  const context = useContext(SnackBarContext);
  if (!context) {
    throw new Error('useSnackBar must be used within a SnackBarProvider');
  }
  return context;
};

export const SnackBarProvider = ({ children }) => {
  const [snackBarConfig, setSnackBarConfig] = useState({});

  const showSnackBar = (message, type, duration) => {
    setSnackBarConfig({ message, type, duration });
  };

  const closeSnackBar = () => {
    setSnackBarConfig({});
  };

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      {children}
      {snackBarConfig.message && (
        <SnackBar
          message={snackBarConfig.message}
          type={snackBarConfig.type}
          duration={snackBarConfig.duration}
          onClose={closeSnackBar}
        />
      )}
    </SnackBarContext.Provider>
  );
};
