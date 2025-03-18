'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import ModelViewer from '@/components/AR/ModelViewer';
import ModelViewerScript from '@/components/AR/ModelViewerScript';

export default function PackageDetailPage() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showARModel, setShowARModel] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    // Initial fetch of package data
    const fetchPackage = async () => {
      try {
        const docRef = doc(db, 'packages', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPackageData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Package not found');
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();

    // Set up real-time listener for price updates
    const docRef = doc(db, 'packages', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPackageData({ id: docSnap.id, ...docSnap.data() });
      }
    }, (err) => {
      console.error('Error in real-time updates:', err);
    });

    return () => unsubscribe();
  }, [id]);

  // Placeholder data for when Firestore doesn't have data yet
  const placeholderPackage = {
    name: "Space Package",
    destination: "Loading destination...",
    duration: 0,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    description: "Loading description...",
    amenities: [],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000',
    gallery: [],
    departure: new Date().toISOString(),
    rating: 4.5,
    reviews: [],
    capacity: 12,
    availableSeats: 6,
  };

  // Use placeholder when loading or actual data when available
  const pkg = loading ? placeholderPackage : (packageData || placeholderPackage);

  // Determine model for AR view
  const getModelInfo = () => {
    // Default model if not specified in package data
    return {
      modelPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      iosSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
      posterPath: 'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
    };
  };

  // Handle booking button click
  const handleBookNow = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/packages/${id}`;
      return;
    }
    
    // Redirect to checkout page with package ID
    window.location.href = `/checkout?packageId=${id}`;
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">{error}</h1>
            <p className="text-white mb-6">The package you're looking for might have been removed or doesn't exist.</p>
            <Link href="/packages" className="bg-primary text-black px-6 py-3 rounded-md font-medium">
              View All Packages
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero section with package image */}
        <div className="relative h-[60vh]">
          <Image 
            src={pkg.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000'} 
            alt={pkg.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{pkg.name}</h1>
              <p className="text-xl text-gray-200">{pkg.destination}</p>
            </div>
          </div>
        </div>
        
        {/* Package details */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left column - Details */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 mb-6">{pkg.description || "Experience the wonders of space travel with our premium package. Enjoy breathtaking views, luxurious accommodations, and unforgettable adventures beyond Earth's atmosphere."}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-800/80 rounded-lg">
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-semibold">{pkg.duration} days</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/80 rounded-lg">
                    <p className="text-gray-400 text-sm">Departure</p>
                    <p className="text-white font-semibold">{new Date(pkg.departure || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/80 rounded-lg">
                    <p className="text-gray-400 text-sm">Rating</p>
                    <p className="text-white font-semibold">{pkg.rating || 4.5}/5</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/80 rounded-lg">
                    <p className="text-gray-400 text-sm">Available Seats</p>
                    <p className="text-white font-semibold">{pkg.availableSeats || 6}/{pkg.capacity || 12}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowARModel(!showARModel)} 
                  className="inline-flex items-center text-primary hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                  {showARModel ? 'Hide AR View' : 'View in AR'}
                </button>
                
                {showARModel && (
                  <div className="mt-6">
                    <ModelViewerScript />
                    <ModelViewer 
                      modelPath={getModelInfo().modelPath}
                      iosSrc={getModelInfo().iosSrc}
                      posterPath={getModelInfo().posterPath}
                      alt={pkg.name}
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(pkg.amenities || [
                    "Zero-G Spa", 
                    "Space Walk Experience", 
                    "Gourmet Space Cuisine", 
                    "Observation Deck", 
                    "Virtual Reality Games",
                    "Private Cabin"
                  ]).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Itinerary</h2>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="text-white font-semibold">Day 1: Departure from Earth</h3>
                    <p className="text-gray-300">Board our state-of-the-art spacecraft and prepare for launch. Experience the thrill of liftoff and enjoy your first views of Earth from space.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="text-white font-semibold">Day 2-3: Transit to Destination</h3>
                    <p className="text-gray-300">Enjoy the journey with various onboard activities. Take in breathtaking views of the solar system and adjust to zero gravity.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="text-white font-semibold">Day 4-{pkg.duration - 3}: Destination Exploration</h3>
                    <p className="text-gray-300">Arrive at {pkg.destination} and begin your adventure. Participate in guided tours, scientific activities, and leisure time.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="text-white font-semibold">Day {pkg.duration - 1}-{pkg.duration}: Return Journey</h3>
                    <p className="text-gray-300">Begin your journey back to Earth, with farewell activities and celebration dinner. Prepare for re-entry and landing.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-800/70 rounded-lg p-6 shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Book Your Trip</h2>
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-1">Current Price</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-primary neon-text animate-pulse">
                      ${pkg.price ? pkg.price.toLocaleString() : '0'}
                    </p>
                    <p className="text-gray-400 text-sm ml-2 mb-1">per person</p>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Price ranges from ${pkg.minPrice ? pkg.minPrice.toLocaleString() : '0'} to ${pkg.maxPrice ? pkg.maxPrice.toLocaleString() : '0'} based on demand
                  </p>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white">Available Seats</p>
                    <p className="text-white font-semibold">{pkg.availableSeats || 6}/{pkg.capacity || 12}</p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${((pkg.capacity - (pkg.availableSeats || 0)) / pkg.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {pkg.availableSeats <= 3 ? 'Hurry, seats are filling fast!' : 'Book now to secure your spot'}
                  </p>
                </div>
                
                <button
                  onClick={handleBookNow}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 px-4 rounded-md transition-colors neon-border mb-4"
                >
                  Book Now
                </button>
                
                {!user && (
                  <p className="text-gray-400 text-xs text-center">
                    You need to <Link href={`/login?redirect=/packages/${id}`} className="text-primary hover:underline">sign in</Link> to book this package
                  </p>
                )}
                
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">What's Included:</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Return journey from Earth</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Accommodation during your stay</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>All meals and beverages</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Space suit and gear rental</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Training and safety briefing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 