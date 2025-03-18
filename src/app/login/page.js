'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';

// Separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { login, signInWithGoogle, signInWithApple } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError('Failed to login. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      router.push(redirectPath);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithApple();
      router.push(redirectPath);
    } catch (error) {
      console.error('Apple sign-in error:', error);
      setError('Failed to sign in with Apple. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full border border-primary/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Sign In</h1>
        <p className="text-gray-400 mt-2">Access your space travel account</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="text-gray-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-primary text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading
              ? 'bg-primary/50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 neon-border'
          } text-black font-medium py-3 px-4 rounded-md transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900/70 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex justify-center items-center bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Google
          </button>

          <button
            onClick={handleAppleSignIn}
            disabled={loading}
            className="flex justify-center items-center bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.86-3.09.43-1.09-.46-2.09-.48-3.22 0-1.44.62-2.2.44-3.06-.42C2.7 15.25 3.27 7.59 8.6 7.31c1.6.04 2.62.96 3.38.92.89-.05 2.06-1.11 3.91-.95.67.03 2.53.27 3.72 2.02-3.95 2.58-2.06 8.4.44 11ZM12.03 7.25c-.19-2.57 1.99-4.8 4.59-5 .18 2.8-2.01 4.99-4.59 5Z"/>
            </svg>
            Apple
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// Loading fallback component
function LoginFormFallback() {
  return (
    <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full border border-primary/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Sign In</h1>
        <p className="text-gray-400 mt-2">Loading...</p>
      </div>
      <div className="flex justify-center my-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1770&auto=format&fit=crop"
          alt="Space background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary neon-text">SpaceX Travel</h1>
        </div>
        
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
} 