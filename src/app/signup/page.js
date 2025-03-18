'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';

// Separate component that uses useSearchParams
function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { signupWithEmail, signInWithGoogle, signInWithApple } = useAuth();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      await signupWithEmail(email, password);
      router.push(redirectPath);
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push(redirectPath);
    } catch (err) {
      console.error('Error during Google sign-in:', err);
      setError(err.message || 'An error occurred during Google sign-in');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithApple();
      router.push(redirectPath);
    } catch (err) {
      console.error('Error during Apple sign-in:', err);
      setError(err.message || 'An error occurred during Apple sign-in');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-bold text-white">
            Space<span className="text-primary neon-text">Travel</span>
          </h1>
        </Link>
      </div>
      
      {/* Signup form */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create an Account</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-4 rounded-md transition-colors neon-border"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          
          <button
            onClick={handleAppleSignIn}
            disabled={loading}
            className="flex items-center justify-center bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5725 12.0333C17.537 9.35089 19.717 8.05887 19.819 7.99443C18.6178 6.17875 16.7588 5.93161 16.0911 5.90825C14.4694 5.74499 12.8999 6.86337 12.0766 6.86337C11.2368 6.86337 9.93369 5.93161 8.57103 5.96747C6.81471 6.00334 5.17414 7.09835 4.28151 8.75866C2.43343 12.1284 3.83703 17.0879 5.6149 19.7352C6.49503 21.0272 7.54124 22.475 8.91639 22.404C10.2507 22.3271 10.7488 21.5154 12.3624 21.5154C13.9596 21.5154 14.4245 22.404 15.8282 22.3599C17.2811 22.3271 18.1777 21.0435 19.0163 19.7434C20.0213 18.2306 20.4282 16.7383 20.4527 16.6532C20.4037 16.6369 17.6134 15.5748 17.5725 12.0333Z" fill="currentColor"/>
              <path d="M15.2248 4.29742C15.9498 3.40478 16.4397 2.17542 16.2928 0.916992C15.2329 0.966268 13.9245 1.63862 13.1669 2.50789C12.4911 3.27591 11.8989 4.55306 12.0703 5.76005C13.2632 5.85142 14.474 5.18159 15.2248 4.29742Z" fill="currentColor"/>
            </svg>
            Apple
          </button>
        </div>
      </div>
      
      <div className="text-center mt-6 text-gray-300">
        Already have an account?{' '}
        <Link href={`/login${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`} className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

// Loading fallback
function SignupFormFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-block">
          <h1 className="text-3xl font-bold text-white">
            Space<span className="text-primary neon-text">Travel</span>
          </h1>
        </div>
      </div>
      
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Loading...</h2>
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1470" 
          alt="Space background" 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 flex-grow">
        <Suspense fallback={<SignupFormFallback />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
} 