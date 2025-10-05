// app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import Link from 'next/link';

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
          Cookies.set('token', data.token, { expires: 1/24, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
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
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md border border-border">
        <h1 className="text-2xl font-bold text-center">{step === 1 ? 'Login to Your Account' : 'Enter 2FA Code'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 mt-1 border rounded-md bg-input" />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 mt-1 border rounded-md bg-input" />
              </div>
            </>
          )}
          {step === 2 && (
            <div>
              <label>Authenticator Code</label>
              <input type="text" value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)} required className="w-full p-2 mt-1 border rounded-md bg-input" placeholder="123456" />
            </div>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full p-2 text-white bg-primary rounded-md hover:opacity-90">
            {step === 1 ? 'Login' : 'Verify'}
          </button>
        </form>
         <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}