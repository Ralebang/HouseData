"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  // =========================
  // ULOSKIRJAUTUMINEN
  // =========================

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Uloskirjautuminen epäonnistui:", error);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  // =========================
  // AKTIIVISEN SIVUN TARKISTUS
  // =========================

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  // =========================
  // NAVIGAATIOLINKIN TYYLI
  // =========================

  function linkClass(href: string) {
    return `block rounded-xl px-4 py-3 transition-colors ${
      isActive(href)
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;
  }

  // =========================
  // KÄYTTÖLIITTYMÄ
  // =========================

  return (
    <aside
      style={{
        width: "280px",
        minHeight: "100vh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#09090b",
        borderRight: "1px solid #27272a",
        padding: "24px",
      }}
    >
      {/* =========================
          YLÄOSA
      ========================= */}

      <div>
        {/* Sovelluksen nimi */}
        <h1 className="mb-8 text-2xl font-bold text-white">House Data Oy</h1>

        {/* Navigaatio */}
        <nav className="space-y-3">
          <Link href="/" className={linkClass("/")}>
            Etusivu
          </Link>

          <Link href="/building" className={linkClass("/building")}>
            Taloyhtiö
          </Link>

          <Link href="/building/new" className={linkClass("/building/new")}>
            Lisää taloyhtiö
          </Link>

          <Link href="/documents" className={linkClass("/documents")}>
            Dokumentit
          </Link>

          <Link href="/tasks" className={linkClass("/tasks")}>
            Tehtävät
          </Link>

          <Link href="/faults" className={linkClass("/faults")}>
            Vikailmoitukset
          </Link>

          <Link href="/maintenance" className={linkClass("/maintenance")}>
            Kunnossapito
          </Link>

          <Link href="/invoices" className={linkClass("/invoices")}>
            Laskut
          </Link>

          <Link href="/ai-history" className={linkClass("/ai-history")}>
            AI-historia
          </Link>
        </nav>
      </div>

      {/* =========================
          ULOSKIRJAUTUMINEN
          AINA SIDEBARIN ALALAIDASSA
      ========================= */}

      <div
        style={{
          marginTop: "auto",
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-left text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          Kirjaudu ulos
        </button>
      </div>
    </aside>
  );
}
