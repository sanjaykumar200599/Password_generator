import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4">Welcome to Secure Vault</h1>
      <p className="text-xl mb-8 text-muted-foreground">Your personal, secure password manager.</p>
      <div className="space-x-4">
        <Link href="/login" className="px-6 py-2 text-lg font-semibold text-white bg-primary rounded-md hover:opacity-90">
          Login
        </Link>
        <Link href="/signup" className="px-6 py-2 text-lg font-semibold border rounded-md hover:bg-muted">
          Sign Up
        </Link>
      </div>
    </div>
  );
}