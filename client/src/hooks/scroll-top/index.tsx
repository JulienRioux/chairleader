import { useEffect } from 'react';

export const useScrollTop = () => {
  useEffect(() => {
    // Scroll on top when the user visit the page
    window.scrollTo(0, 0);
  }, []);
};
