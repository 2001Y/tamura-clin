import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>たむらクリニック</h1>
      <Link href="/medical-card">
        <button>診察券をみる</button>
      </Link>
    </main>
  );
}