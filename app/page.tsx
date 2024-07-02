import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <header>
        <h1>たむらクリニック</h1>
      </header>
      <Link href="/medical-card">
        <button>診察券をみる</button>
      </Link>
    </main>
  );
}