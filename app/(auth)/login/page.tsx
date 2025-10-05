'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: setAuthContext } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, token: twoFactorToken }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.twoFactorRequired) {
          setStep(2);
        } else {
          Cookies.set('token', data.token, {
            expires: 1 / 24,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
          setAuthContext(password, email);
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed!');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md p-10 space-y-6 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-primary/70 to-secondary/70 rounded-full">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">
            {step === 1 ? 'Secure Vault Login' : 'Two-Factor Authentication'}
          </h1>
          <p className="mt-2 text-gray-400 text-sm">
            {step === 1
              ? 'Welcome back! Enter your credentials to continue.'
              : 'Please enter the 6-digit code from your authenticator app.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="2fa-token" className="block text-sm font-medium text-gray-400">
                6-Digit Code
              </label>
              <input
                id="2fa-token"
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value)}
                required
                className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all"
                placeholder="· · · · · ·"
                maxLength={6}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center font-medium mt-1">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-colors"
          >
            {step === 1 ? 'Login' : 'Verify'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
