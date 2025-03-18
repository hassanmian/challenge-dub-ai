'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold neon-text text-primary">SpaceX</span>
            <span className="hidden md:inline-block text-white text-lg">Space Travel</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/packages" className="text-white hover:text-primary transition-colors">
              Destinations
            </Link>
            <Link href="/about" className="text-white hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/ar-view" className="text-white hover:text-primary transition-colors">
              AR Experience
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-white hover:text-primary transition-colors"
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 px-2">
            <Link 
              href="/packages" 
              className="block text-white hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link 
              href="/about" 
              className="block text-white hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/ar-view" 
              className="block text-white hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              AR Experience
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="block w-full text-center bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 