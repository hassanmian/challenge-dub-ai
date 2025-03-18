'use client';

import Layout from '@/components/layout/Layout';
import ModelViewer from '@/components/AR/ModelViewer';
import ModelViewerScript from '@/components/AR/ModelViewerScript';
import { useState } from 'react';

export default function ARViewPage() {
  const [selectedModel, setSelectedModel] = useState('spaceship');
  
  const models = {
    spaceship: {
      modelPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      iosSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
      posterPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
      description: 'The latest SpaceX spacecraft designed for long-distance space travel. This cutting-edge vessel features advanced life support systems, artificial gravity, and revolutionary propulsion technology.',
    },
    marsBase: {
      modelPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      iosSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
      posterPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
      description: 'Mars Base Alpha is our premier Martian colony destination. The base includes luxurious habitation domes, research facilities, and recreational areas with stunning views of the Martian landscape.',
    },
    moonStation: {
      modelPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      iosSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
      posterPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
      description: 'The Lunar Gateway Station orbits the Moon and serves as both a research facility and luxury space hotel. Enjoy breathtaking views of both Earth and the lunar surface from our observation decks.',
    },
  };
  
  return (
    <Layout>
      <ModelViewerScript />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white neon-text text-center">
          AR Experience
        </h1>
        <p className="text-xl text-gray-300 text-center mb-10">
          Explore our spacecraft and destinations in augmented reality
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(models).map(([key, model]) => (
            <button
              key={key}
              className={`p-4 rounded-lg transition-colors ${
                selectedModel === key 
                  ? 'bg-primary/30 border border-primary neon-border' 
                  : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
              }`}
              onClick={() => setSelectedModel(key)}
            >
              <h3 className={`text-xl font-semibold mb-2 ${
                selectedModel === key ? 'text-primary' : 'text-white'
              }`}>
                {key === 'spaceship' ? 'Aurora Spacecraft' : 
                 key === 'marsBase' ? 'Mars Base Alpha' : 
                 'Lunar Gateway Station'}
              </h3>
              <p className="text-gray-300 text-sm">
                {model.description.substring(0, 60)}...
              </p>
            </button>
          ))}
        </div>
        
        <div className="bg-gray-800/30 rounded-xl p-6 mb-10">
          <ModelViewer 
            modelPath={models[selectedModel].modelPath}
            iosSrc={models[selectedModel].iosSrc}
            posterPath={models[selectedModel].posterPath}
            alt={selectedModel === 'spaceship' ? 'Aurora Spacecraft' : 
                selectedModel === 'marsBase' ? 'Mars Base Alpha' : 
                'Lunar Gateway Station'}
          />
          
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedModel === 'spaceship' ? 'Aurora Spacecraft' : 
               selectedModel === 'marsBase' ? 'Mars Base Alpha' : 
               'Lunar Gateway Station'}
            </h2>
            <p className="text-gray-300">
              {models[selectedModel].description}
            </p>
            
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
              <h3 className="text-primary font-semibold">AR Viewing Instructions:</h3>
              <ol className="list-decimal pl-5 mt-2 text-gray-300 space-y-1">
                <li>Click the "View in AR" button on the 3D model above</li>
                <li>On mobile devices, you'll be prompted to view in your environment</li>
                <li>Allow camera access when prompted</li>
                <li>Point your camera at a flat surface</li>
                <li>The model will appear in your environment</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 