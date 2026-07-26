import Link from 'next/link';

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold mb-4">Playground</h1>
        <p className="text-lg leading-8 mb-8">
          This space is under construction. You can use it to experiment with new ideas, preview features, or build quick prototypes.
        </p>
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
