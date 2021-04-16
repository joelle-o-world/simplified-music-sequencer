import React from 'react';
import {useState, useEffect} from 'react';

export function useUrlHash(handleChange: (newHash: string) => void) {
  const [currentHash, setCurrentHash] = useState('');
  
  useEffect(() => {
    const hashWatcher = setInterval(() => {
      let hash = decodeURIComponent(window.location.hash.slice(1));
      if(hash != currentHash) {
        setCurrentHash(hash);
        handleChange(hash);
      }
    }, 200);

    return () => clearInterval(hashWatcher);
  }, [currentHash]);

  const setUrlHash = (hash: string) => {
    window.location.hash = hash;
    setCurrentHash(hash);
  }

  return {urlHash: currentHash, setUrlHash};
}

export default useUrlHash;
