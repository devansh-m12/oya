import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-black mb-4">Welcome to Oya</h1>
        <p className="text-gray-600 mb-8">Multi-persona AI assistant platform with on-chain capabilities.</p>
        <div className="space-y-4">
          <Link href="/testChat">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl text-lg w-full">
              Start Casino Butler Chat
            </Button>
          </Link>
          <p className="text-sm text-gray-500">Connect your wallet and experience fair on-chain games.</p>
        </div>
      </div>
    </div>
  );
}
