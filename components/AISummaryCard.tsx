"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useBuilding } from "@/context/BuildingContext";

type SavedSummary = {
  id: string;
  summary: string;
  created_at: string;
};

export default function AISummaryCard() {
  // =========================
  // VALITTU TALOYHTIÖ
  // =========================

  const { selectedBuildingId, selectedBuilding } = useBuilding();

  // =========================
  // AI-YHTEENVEDON TILA
  // =========================

  const [savedSummary, setSavedSummary] = useState<SavedSummary | null>(null);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // HAE VIIMEISIN TALLENNETTU
  // AI-YHTEENVETO
  // =========================

  const fetchLatestSummary = useCallback(async () => {
    if (!selectedBuildingId) {
      return null;
    }

    const { data, error } = await supabase
      .from("ai_summaries")
      .select("id, summary, created_at")
      .eq("building_id", selectedBuildingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("AI-yhteenvedon hakeminen epäonnistui:", error);

      return null;
    }

    return data;
  }, [selectedBuildingId]);

  // =========================
  // HAE YHTEENVETO,
  // KUN TALOYHTIÖ VAIHTUU
  // =========================

  useEffect(() => {
    fetchLatestSummary().then((data) => {
      setSavedSummary(data);
    });
  }, [fetchLatestSummary]);

  // =========================
  // LUO UUSI AI-YHTEENVETO
  // =========================

  async function generateSummary() {
    if (!selectedBuildingId) {
      alert("Valitse ensin taloyhtiö.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // =========================
      // TALOYHTIÖN PERUSTIEDOT
      // =========================

      const { data: building, error: buildingError } = await supabase
        .from("buildings")
        .select("*")
        .eq("id", selectedBuildingId)
        .single();

      if (buildingError) {
        throw buildingError;
      }

      // =========================
      // AVOIMET TEHTÄVÄT
      // =========================

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("building_id", selectedBuildingId)
        .neq("status", "Valmis");

      if (tasksError) {
        throw tasksError;
      }

      // =========================
      // AVOIMET VIKAILMOITUKSET
      // =========================

      const { data: faults, error: faultsError } = await supabase
        .from("faults")
        .select("*")
        .eq("building_id", selectedBuildingId)
        .neq("status", "Korjattu");

      if (faultsError) {
        throw faultsError;
      }

      // =========================
      // KUNNOSSAPITO
      // =========================

      const { data: maintenance, error: maintenanceError } = await supabase
        .from("maintenance")
        .select("*")
        .eq("building_id", selectedBuildingId)
        .neq("status", "Valmis");

      if (maintenanceError) {
        throw maintenanceError;
      }

      // =========================
      // OPENAI API
      // =========================

      const response = await fetch("/api/ai-summary", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          building,
          tasks: tasks || [],
          faults: faults || [],
          maintenance: maintenance || [],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "AI-yhteenvedon luonti epäonnistui.");
      }

      if (!result.summary) {
        throw new Error("AI ei palauttanut yhteenvetoa.");
      }

      // =========================
      // TALLENNA YHTEENVETO
      // SUPABASEEN
      // =========================

      const { data: insertedSummary, error: insertError } = await supabase
        .from("ai_summaries")
        .insert({
          building_id: selectedBuildingId,
          summary: result.summary,
        })
        .select("id, summary, created_at")
        .single();

      if (insertError) {
        throw insertError;
      }

      // Näytetään uusi yhteenveto heti.
      setSavedSummary(insertedSummary);
    } catch (error) {
      console.error("AI-yhteenvedon luonti epäonnistui:", error);

      setErrorMessage("AI-yhteenvedon luonti epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // AI-YHTEENVEDON PILKKOMINEN
  // =========================

  function parseSummary(summary: string) {
    const situationMatch = summary.match(
      /TILANNEKUVA([\s\S]*?)(?=HUOMIOTA VAATII|SUOSITUS|$)/i,
    );

    const attentionMatch = summary.match(
      /HUOMIOTA VAATII([\s\S]*?)(?=SUOSITUS|$)/i,
    );

    const recommendationMatch = summary.match(/SUOSITUS([\s\S]*?)$/i);

    return {
      situation: situationMatch?.[1]?.trim() || "",

      attention: attentionMatch?.[1]?.trim() || "",

      recommendation: recommendationMatch?.[1]?.trim() || "",
    };
  }

  // =========================
  // HUOMIOIDEN PILKKOMINEN
  // =========================

  // =========================
  // PÄIVÄMÄÄRÄN MUOTOILU
  // =========================

  function formatDate(date: string) {
    return new Date(date).toLocaleString("fi-FI", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  // =========================
  // KÄYTTÖLIITTYMÄ
  // =========================

  return (
    <div className="rounded-2xl bg-zinc-900 p-6">
      {/* =========================
          KORTIN YLÄOSA
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">AI-yhteenveto</h2>

          {selectedBuilding && (
            <p className="mt-1 text-sm text-zinc-500">
              {selectedBuilding.name}
            </p>
          )}
        </div>

        {/* Luo / päivitä yhteenveto */}
        <button
          type="button"
          onClick={generateSummary}
          disabled={loading || !selectedBuildingId}
          className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Analysoidaan..."
            : savedSummary
              ? "Päivitä yhteenveto"
              : "Luo yhteenveto"}
        </button>
      </div>

      {/* =========================
          EI VALITTUA TALOYHTIÖTÄ
      ========================= */}

      {!selectedBuildingId && (
        <p className="text-zinc-400">Valitse ensin taloyhtiö.</p>
      )}

      {/* =========================
          VIRHE
      ========================= */}

      {errorMessage && (
        <div className="rounded-xl border border-red-800 bg-red-950/30 p-4 text-red-300">
          {errorMessage}
        </div>
      )}

      {/* =========================
          EI VIELÄ YHTEENVETOA
      ========================= */}

      {selectedBuildingId && !savedSummary && !loading && !errorMessage && (
        <p className="text-zinc-400">
          Tälle taloyhtiölle ei ole vielä luotu AI-yhteenvetoa.
        </p>
      )}

      {/* =========================
          TALLENNETTU AI-YHTEENVETO
      ========================= */}

      {savedSummary &&
        (() => {
          const parsed = parseSummary(savedSummary.summary);

          return (
            <>
              <div className="space-y-7">
                {/* TILANNEKUVA */}
                {parsed.situation && (
                  <section>
                    <h3 className="mb-3 text-sm font-bold tracking-wide text-white">
                      TILANNEKUVA
                    </h3>

                    <p className="leading-7 text-zinc-300">
                      {parsed.situation}
                    </p>
                  </section>
                )}

                {/* HUOMIOTA VAATII */}
                {parsed.attention && (
                  <section>
                    <h3 className="mb-3 text-sm font-bold tracking-wide text-white">
                      HUOMIOTA VAATII
                    </h3>

                    <div className="whitespace-pre-line leading-7 text-zinc-300">
                      {parsed.attention}
                    </div>
                  </section>
                )}

                {/* SUOSITUS */}
                {parsed.recommendation && (
                  <section>
                    <h3 className="mb-3 text-sm font-bold tracking-wide text-white">
                      SUOSITUS
                    </h3>

                    <p className="leading-7 text-zinc-300">
                      {parsed.recommendation}
                    </p>
                  </section>
                )}
              </div>

              {/* PÄIVITYSAIKA */}
              <p className="mt-7 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
                Päivitetty {formatDate(savedSummary.created_at)}
              </p>
            </>
          );
        })()}
    </div>
  );
}
