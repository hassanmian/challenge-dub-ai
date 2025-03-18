'use client';

import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured packages from Firestore
    const q = query(collection(db, 'packages'), limit(3));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const packageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPackages(packageData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching packages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // If no packages are available yet (first load or empty database), show dummy data
  const featuredPackages = packages.length > 0 ? packages : [
    {
      id: 'mars-adventure',
      name: 'Mars Adventure',
      destination: 'Mars Base Alpha',
      duration: 14,
      price: 650000,
      imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000'
    },
    {
      id: 'moon-getaway',
      name: 'Lunar Getaway',
      destination: 'Moon Resort & Spa',
      duration: 7,
      price: 350000,
      imageUrl: 'https://images.unsplash.com/photo-1614726365891-151ea3a7c2fe?q=80&w=1000' 
    },
    {
      id: 'orbital-luxury',
      name: 'Orbital Luxury',
      destination: 'SpaceX Premium Station',
      duration: 3,
      price: 180000,
      imageUrl: 'https://images.unsplash.com/photo-1450944584139-ace2a3b70f7d?q=80&w=1000'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000" 
            alt="Space" 
            fill 
            quality={90}
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Experience the Future of <span className="text-primary neon-text">Space Travel</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Book your journey to the stars with our premium space travel packages. 
              Explore Mars, visit the Moon, and experience zero gravity in our luxury space stations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/packages" 
                className="bg-primary text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors neon-border"
              >
                View Destinations
              </Link>
              <Link 
                href="/ar-view" 
                className="bg-transparent border border-primary text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-primary/10 transition-colors"
              >
                AR Experience
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Featured Destinations</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Discover our most popular space travel packages with real-time pricing. 
            Our packages include luxury accommodations, stellar views, and unforgettable experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredPackages.map(pkg => (
              <div key={pkg.id} className="space-card rounded-xl overflow-hidden shadow-2xl border border-primary/20 transition-transform hover:scale-105 group">
                <div className="relative h-56">
                  <Image 
                    src={pkg.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000'}
                    alt={pkg.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    <p className="text-gray-300">{pkg.destination}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="text-gray-300">
                      <span className="block text-sm">Duration</span>
                      <span className="font-semibold">{pkg.duration} days</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-gray-300">Price</span>
                      <span className="font-semibold text-primary neon-text animate-pulse">
                        ${pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/packages/${pkg.id}`} 
                    className="block w-full text-center bg-primary/20 hover:bg-primary/30 text-white py-3 rounded transition-colors mt-4"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/packages" 
              className="inline-flex items-center text-primary hover:text-white text-lg font-medium transition-colors"
            >
              View All Destinations
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Why Choose SpaceX Travel</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            We provide the safest, most luxurious space travel experience with cutting-edge technology and exceptional service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-800/70 p-8 rounded-xl border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Cutting-edge Technology</h3>
              <p className="text-gray-300 text-center">
                Our spacecraft utilize the latest advancements in propulsion, life support, and artificial gravity systems to ensure a comfortable journey.
              </p>
            </div>
            
            <div className="bg-gray-800/70 p-8 rounded-xl border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Safety First</h3>
              <p className="text-gray-300 text-center">
                Your safety is our priority. All our journeys follow rigorous safety protocols developed with space agencies worldwide.
              </p>
            </div>
            
            <div className="bg-gray-800/70 p-8 rounded-xl border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Luxury Experience</h3>
              <p className="text-gray-300 text-center">
                Enjoy premium accommodations, gourmet space cuisine prepared by world-class chefs, and personalized concierge service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=1000" 
            alt="Space" 
            fill 
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore the Cosmos?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Book your space journey today and experience the wonders of the universe firsthand.
            </p>
            <Link 
              href="/signup" 
              className="bg-primary text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors neon-border inline-block"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
