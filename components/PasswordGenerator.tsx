// components/PasswordGenerator.tsx

"use client";

import { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const lowerLetters = 'abcdefghijkmnopqrstuvwxyz';
    const upperLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    let charSet = lowerLetters + upperLetters;
    if (includeNumbers) charSet += numbers;
    if (includeSymbols) charSet += symbols;
    if (!excludeLookalikes) charSet += 'iloILO01';

    let newPassword = '';
    const crypto = window.crypto || window.Crypto;
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      newPassword += charSet[randomValues[i] % charSet.length];
    }
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeNumbers, includeSymbols, excludeLookalikes]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold mb-3">Password Generator</h3>
      <div className="relative flex items-center mb-4">
        <input type="text" value={password} readOnly className="w-full p-2 pr-20 border rounded-md bg-muted" />
        <button onClick={generatePassword} className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
          <RefreshCw size={18} />
        </button>
        <button onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
          {copied ? <span className="text-xs text-primary">Copied!</span> : <Copy size={18} />}
        </button>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <label className="flex justify-between"><span>Length:</span> <span>{length}</span></label>
          <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex items-center"><input type="checkbox" id="numbers" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="mr-2" /> <label htmlFor="numbers">Include Numbers</label></div>
        <div className="flex items-center"><input type="checkbox" id="symbols" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="mr-2" /> <label htmlFor="symbols">Include Symbols</label></div>
        <div className="flex items-center"><input type="checkbox" id="lookalikes" checked={excludeLookalikes} onChange={() => setExcludeLookalikes(!excludeLookalikes)} className="mr-2" /> <label htmlFor="lookalikes">Exclude Look-Alikes</label></div>
      </div>
    </div>
  );
}