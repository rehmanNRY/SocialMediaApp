"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from './Loading';

// Create a context for the loading state
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  showLoadingFor: () => {},
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  
  const pathname = usePathname();

  // Clear any existing timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loadingTimeout]);

  // Show loading state for navigation changes
  useEffect(() => {
    setIsLoading(true);
    
    // Hide loading after a short delay to ensure the page has loaded
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    setLoadingTimeout(timeout);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  // Function to show loading for a specific duration
  const showLoadingFor = (duration = 500) => {
    setIsLoading(true);
    
    if (loadingTimeout) clearTimeout(loadingTimeout);
    
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, duration);
    
    setLoadingTimeout(timeout);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoadingFor }}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider; 