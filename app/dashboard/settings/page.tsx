// app/dashboard/settings/page.tsx

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
        <h1 className="text-3xl font-bold mb-6">Security Settings</h1>
        <div className="max-w-lg p-6 bg-card rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication (2FA)</h2>
          {/* We assume if the page is loaded, 2FA is not yet enabled. 
              A real app would fetch user status to show "Disable 2FA" button instead. */}
          
          {step === 1 && (
            <div>
              <p className="text-muted-foreground mb-4">Add an extra layer of security to your account by enabling 2FA. You'll need an authenticator app like Google Authenticator or Authy.</p>
              <button onClick={handleSetup} className="w-full p-2 text-white bg-primary rounded-md">
                Enable 2FA
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Step 1: Scan QR Code</h3>
                <p className="text-sm text-muted-foreground">Use your authenticator app to scan the image below.</p>
                <div className="p-4 my-2 bg-white rounded-md inline-block">
                  <img src={qrCode} alt="2FA QR Code" />
                </div>
              </div>
              <form onSubmit={handleVerify}>
                <h3 className="font-semibold">Step 2: Verify Code</h3>
                <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
                <input 
                  type="text" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                  className="p-2 border rounded w-full my-2 bg-input"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
                <button type="submit" className="w-full p-2 text-white bg-green-600 rounded-md">Verify & Enable</button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-green-600 font-semibold p-4 bg-green-500/10 rounded-md">
              {message}
            </div>
          )}

          {message && step !== 3 && <p className="text-red-500 mt-4">{message}</p>}
        </div>
      </div>
    </>
  );
}