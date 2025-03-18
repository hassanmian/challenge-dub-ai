'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function ModelViewerScript() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if the script is already loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && customElements.get('model-viewer')) {
      setIsLoaded(true);
    }
  }, []);

  if (isLoaded) {
    return null;
  }

  return (
    <Script 
      type="module" 
      src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      onLoad={() => {
        console.log('Model Viewer script loaded successfully');
        setIsLoaded(true);
      }}
      onError={(e) => {
        console.error('Error loading Model Viewer script:', e);
      }}
      strategy="afterInteractive"
    />
  );
} 