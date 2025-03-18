'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    destination: '',
    duration: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortBy, setSortBy] = useState('price-asc');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesQuery = query(
          collection(db, 'packages'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(packagesQuery);
        
        const packageData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPackages(packageData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages based on current filters
  const filteredPackages = packages.filter(pkg => {
    if (filters.destination && !pkg.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
      return false;
    }
    if (filters.duration && pkg.duration > parseInt(filters.duration)) {
      return false;
    }
    if (filters.minPrice && pkg.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && pkg.price > parseInt(filters.maxPrice)) {
      return false;
    }
    return true;
  });

  // Sort filtered packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'duration-asc':
        return a.duration - b.duration;
      case 'duration-desc':
        return b.duration - a.duration;
      case 'departure-asc':
        return new Date(a.departure) - new Date(b.departure);
      case 'departure-desc':
        return new Date(b.departure) - new Date(a.departure);
      default:
        return 0;
    }
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      destination: '',
      duration: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">Space Travel Packages</h1>
        <p className="text-gray-300 mb-8">Explore our selection of premium space travel experiences</p>
        
        {/* Filters and Sorting */}
        <div className="bg-gray-800/80 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h2 className="text-xl font-bold text-white mb-4 md:mb-0">Filters</h2>
            <button 
              onClick={clearFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-1">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                name="destination"
                value={filters.destination}
                onChange={handleFilterChange}
                placeholder="Search destinations"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                Max Duration (days)
              </label>
              <select
                id="duration"
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              >
                <option value="">Any duration</option>
                <option value="3">Up to 3 days</option>
                <option value="7">Up to 7 days</option>
                <option value="14">Up to 14 days</option>
                <option value="21">Up to 21 days</option>
                <option value="30">Up to 30 days</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-300 mb-1">
                Min Price ($)
              </label>
              <input
                id="minPrice"
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Minimum price"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300 mb-1">
                Max Price ($)
              </label>
              <input
                id="maxPrice"
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Maximum price"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-300 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Shortest First</option>
              <option value="duration-desc">Duration: Longest First</option>
              <option value="departure-asc">Departure: Earliest First</option>
              <option value="departure-desc">Departure: Latest First</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {sortedPackages.length} {sortedPackages.length === 1 ? 'package' : 'packages'}
          </p>
        </div>
        
        {/* Package Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : sortedPackages.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No packages found</h3>
            <p className="text-gray-300 mb-4">Try adjusting your filters or check back later for new packages.</p>
            <button 
              onClick={clearFilters}
              className="bg-primary text-black px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPackages.map(pkg => (
              <div key={pkg.id} className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-primary/20 hover:border-primary/50">
                <div className="relative h-48">
                  <Image 
                    src={pkg.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000'}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />
                  {pkg.featured && (
                    <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 m-2 rounded">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                    <p className="text-gray-300">{pkg.destination}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <span className="block text-xs text-gray-400">Duration</span>
                      <span className="text-white">{pkg.duration} days</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400">Departure</span>
                      <span className="text-white">{new Date(pkg.departure).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-gray-400">Price</span>
                      <span className="text-primary font-bold">${pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Available Seats</span>
                      <span className="text-xs text-white">{pkg.availableSeats}/{pkg.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${((pkg.capacity - pkg.availableSeats) / pkg.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/packages/${pkg.id}`}
                    className="block w-full bg-transparent hover:bg-primary/20 text-white text-center py-2 rounded border border-primary/50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 