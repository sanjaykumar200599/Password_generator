// components/Navbar.tsx

"use client";

import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <nav className="bg-card shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Secure Vault
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Settings
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}