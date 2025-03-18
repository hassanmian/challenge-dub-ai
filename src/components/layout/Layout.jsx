'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../chat/Chatbot';
import { useAuth } from '@/lib/auth';

export default function Layout({ children }) {
  const { loading } = useAuth();
  
  // Show loading indicator while auth state is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
} 