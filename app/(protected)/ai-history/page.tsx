"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useBuilding } from "@/context/BuildingContext";

type Summary = {
  id: string;
  summary: string;
  created_at: string;
};

export default function AIHistoryPage() {
  // =========================
  // VALITTU TALOYHTIÖ
  // =========================

  const { selectedBuildingId, selectedBuilding } = useBuilding();

  // =========================
  // YHTEENVEDOT
  // =========================

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // HAE HISTORIA
  // =========================

  useEffect(() => {
    async function loadSummaries() {
      if (!selectedBuildingId) {
        return [];
      }

      const { data, error } = await supabase
        .from("ai_summaries")
        .select("id, summary, created_at")
        .eq("building_id", selectedBuildingId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("AI-yhteenvetohistorian haku epäonnistui:", error);

        return [];
      }

      return data || [];
    }

    setLoading(true);

    loadSummaries().then((data) => {
      setSummaries(data);
      setLoading(false);
    });
  }, [selectedBuildingId]);

  // =========================
  // PÄIVÄMÄÄRÄ
  // =========================

  function formatDate(date: string) {
    return new Date(date).toLocaleString("fi-FI", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  async function deleteSummary(summaryId: string) {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän AI-yhteenvedon?",
    );

    if (!confirmed) {
      return;
    }

    // =========================
    // KÄYTTÖLIITTYMÄ
    // =========================
    const { error } = await supabase
      .from("ai_summaries")
      .delete()
      .eq("id", summaryId);

    if (error) {
      console.error("AI-yhteenvedon poistaminen epäonnistui:", error);

      alert("AI-yhteenvedon poistaminen epäonnistui.");
      return;
    }

    // Poistetaan rivi myös käyttöliittymästä heti.
    setSummaries((currentSummaries) =>
      currentSummaries.filter((summary) => summary.id !== summaryId),
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-10">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold">AI-yhteenvetohistoria</h1>

              <p className="mt-2 text-zinc-400">
                {selectedBuilding
                  ? selectedBuilding.name
                  : "Taloyhtiötä ei ole valittu"}
              </p>
            </div>

            {!selectedBuildingId ? (
              <div className="rounded-2xl bg-zinc-900 p-6">
                <p className="text-zinc-400">
                  Valitse ensin taloyhtiö etusivulta.
                </p>
              </div>
            ) : loading ? (
              <div className="rounded-2xl bg-zinc-900 p-6">
                <p className="text-zinc-400">Ladataan AI-yhteenvetoja...</p>
              </div>
            ) : summaries.length === 0 ? (
              <div className="rounded-2xl bg-zinc-900 p-6">
                <p className="text-zinc-400">
                  Tälle taloyhtiölle ei ole vielä tallennettu AI-yhteenvetoja.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {summaries.map((summary) => (
                  <article
                    key={summary.id}
                    className="rounded-2xl bg-zinc-900 p-6"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">AI-yhteenveto</h2>

                        <p className="mt-1 text-sm text-zinc-500">
                          {formatDate(summary.created_at)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteSummary(summary.id)}
                        className="shrink-0 rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
                      >
                        Poista
                      </button>
                    </div>

                    <p className="whitespace-pre-line leading-7 text-zinc-300">
                      {summary.summary}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
