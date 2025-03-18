'use client';

import { useEffect, useRef } from 'react';
// Remove the direct import that's causing the error
// import '@google/model-viewer';

export default function ModelViewer({ 
  modelPath, 
  posterPath,
  iosSrc,
  alt = "3D model of spacecraft or destination",
  showArButton = true
}) {
  const modelViewerRef = useRef(null);

  useEffect(() => {
    // Dynamically import model-viewer only on client side
    const loadModelViewer = async () => {
      try {
        await import('@google/model-viewer');
      } catch (error) {
        console.error('Error loading model-viewer:', error);
      }
    };

    // Make sure window is defined (client-side only)
    if (typeof window !== 'undefined') {
      loadModelViewer();
    }
  }, []);

  // Check if we're on the server side
  if (typeof window === 'undefined') {
    return <div className="ar-container w-full h-[500px] rounded-lg overflow-hidden shadow-xl border border-primary/20 bg-gray-800 flex items-center justify-center">
      <p className="text-white">AR Viewer loading...</p>
    </div>;
  }

  return (
    <div className="ar-container w-full h-[500px] rounded-lg overflow-hidden shadow-xl border border-primary/20">
      {/* @ts-ignore */}
      <model-viewer
        ref={modelViewerRef}
        src={modelPath}
        ios-src={iosSrc}
        poster={posterPath}
        alt={alt}
        ar={showArButton}
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        shadow-softness="1"
        exposure="0.8"
        style={{ width: '100%', height: '100%', backgroundColor: '#1a1c25' }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-center text-lg">
            {showArButton ? 'Use AR to see this in your space!' : alt}
          </p>
        </div>
        
        {/* Loading UI */}
        <div slot="poster" className="flex items-center justify-center w-full h-full bg-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Loading 3D model...</p>
          </div>
        </div>
        
        {/* AR button slot */}
        <button slot="ar-button" className="ar-button">
          View in AR
        </button>
      </model-viewer>
    </div>
  );
} 