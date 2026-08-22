"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================
  // ULOSKIRJAUTUMINEN
  // =========================

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Uloskirjautuminen epäonnistui:", error);
      return;
    }

    setMobileMenuOpen(false);

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
  // SULJE MOBIILIVALIKKO
  // LINKKIÄ PAINETTAESSA
  // =========================

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  // =========================
  // NAVIGAATIO
  // =========================

  const navigation = (
    <nav className="space-y-3">
      <Link href="/" className={linkClass("/")} onClick={closeMobileMenu}>
        Etusivu
      </Link>

      <Link
        href="/building"
        className={linkClass("/building")}
        onClick={closeMobileMenu}
      >
        Taloyhtiö
      </Link>

      <Link
        href="/building/new"
        className={linkClass("/building/new")}
        onClick={closeMobileMenu}
      >
        Lisää taloyhtiö
      </Link>

      <Link
        href="/documents"
        className={linkClass("/documents")}
        onClick={closeMobileMenu}
      >
        Dokumentit
      </Link>

      <Link
        href="/tasks"
        className={linkClass("/tasks")}
        onClick={closeMobileMenu}
      >
        Tehtävät
      </Link>

      <Link
        href="/faults"
        className={linkClass("/faults")}
        onClick={closeMobileMenu}
      >
        Vikailmoitukset
      </Link>

      <Link
        href="/maintenance"
        className={linkClass("/maintenance")}
        onClick={closeMobileMenu}
      >
        Kunnossapito
      </Link>

      <Link
        href="/invoices"
        className={linkClass("/invoices")}
        onClick={closeMobileMenu}
      >
        Laskut
      </Link>

      <Link
        href="/ai-history"
        className={linkClass("/ai-history")}
        onClick={closeMobileMenu}
      >
        AI-historia
      </Link>
    </nav>
  );

  return (
    <>
      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}

      <aside className="hidden min-h-screen w-[280px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 p-6 md:flex">
        <div>
          <h1 className="mb-8 text-2xl font-bold text-white">House Data Oy</h1>

          {navigation}
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-left text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Kirjaudu ulos
          </button>
        </div>
      </aside>

      {/* =========================
          MOBIILIHEADER
      ========================= */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 md:hidden">
        <h1 className="text-lg font-bold text-white">House Data Oy</h1>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 text-xl text-white"
          aria-label="Avaa valikko"
        >
          ☰
        </button>
      </div>

      {/* =========================
          MOBIILIVALIKON TAUSTA
      ========================= */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* =========================
          MOBIILISIDEBAR
      ========================= */}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col border-r border-zinc-800 bg-zinc-950 p-6 transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">House Data Oy</h1>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 text-lg text-zinc-300"
            aria-label="Sulje valikko"
          >
            ×
          </button>
        </div>

        {navigation}

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-left text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Kirjaudu ulos
          </button>
        </div>
      </aside>

      {/* =========================
          MOBIILIHEADERIN TILAVARAUS
      ========================= */}

      <div className="h-16 shrink-0 md:hidden" />
    </>
  );
}
