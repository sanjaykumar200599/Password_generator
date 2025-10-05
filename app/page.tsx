import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
        Welcome to <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Secure Vault</span>
      </h1>
      <p className="text-lg md:text-xl mb-12 text-gray-400 text-center">
        Your personal, secure password manager.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/login"
          className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition"
        >
          Login 
        </Link>
        <Link
          href="/signup"
          className="px-8 py-3 text-lg font-semibold border border-gray-700 rounded-lg hover:bg-gray-800 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
