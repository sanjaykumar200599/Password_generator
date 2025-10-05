'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SettingsPage() {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState(1); // 1: initial, 2: scan QR, 3: success

  const handleSetup = async () => {
    setMessage('');
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setQrCode(data.qrCodeUrl);
        setStep(2);
      } else {
        setMessage('Failed to start 2FA setup. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setMessage('2FA has been enabled successfully!');
        setStep(3);
      } else {
        setMessage('Invalid token. Please check the code and try again.');
      }
    } catch (err) {
      setMessage('An error occurred during verification.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Security Settings</h1>

        <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 space-y-6">
          <h2 className="text-xl font-semibold text-white">Two-Factor Authentication (2FA)</h2>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-400">
                Add an extra layer of security to your account by enabling 2FA. 
                You'll need an authenticator app like Google Authenticator or Authy.
              </p>
              <button
                onClick={handleSetup}
                className="w-full py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition"
              >
                Enable 2FA
              </button>
              {message && <p className="text-red-500">{message}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white">Step 1: Scan QR Code</h3>
                <p className="text-sm text-gray-400">Use your authenticator app to scan the image below.</p>
                <div className="p-4 my-2 bg-white rounded-lg inline-block shadow">
                  <img src={qrCode} alt="2FA QR Code" />
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <h3 className="font-semibold text-white">Step 2: Verify Code</h3>
                <p className="text-sm text-gray-400">Enter the 6-digit code from your authenticator app.</p>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/70 transition"
                />
                <button
                  type="submit"
                  className="w-full py-2 text-white bg-green-600 rounded-lg hover:opacity-90 transition"
                >
                  Verify & Enable
                </button>
                {message && <p className="text-red-500">{message}</p>}
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="p-4 bg-green-500/10 text-green-600 font-semibold rounded-lg text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
