import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6">
      <h1 className="text-2xl font-bold mb-8">House Data</h1>

      <nav className="space-y-3">
        <Link href="/" className="block bg-zinc-800 rounded-xl px-4 py-3">
          Dashboard
        </Link>

        <Link
          href="/building"
          className="block text-zinc-400 px-4 py-3 hover:text-white"
        >
          Taloyhtiö
        </Link>

        <Link
          href="/building/new"
          className="block text-zinc-400 px-4 py-3 hover:text-white"
        >
          Lisää taloyhtiö
        </Link>

        <Link
          href="/documents"
          className="block text-zinc-400 px-4 py-3 hover:text-white"
        >
          Dokumentit
        </Link>

        <Link
          href="/tasks"
          className="block text-zinc-400 px-4 py-3 hover:text-white"
        >
          Tehtävät
        </Link>

        <div className="text-zinc-400 px-4 py-3">Vikailmoitukset</div>
        <div className="text-zinc-400 px-4 py-3">Kunnossapito</div>
        <div className="text-zinc-400 px-4 py-3">AI-yhteenveto</div>
      </nav>
    </aside>
  );
}
