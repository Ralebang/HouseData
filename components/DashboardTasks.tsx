"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";

export default function DashboardTasks() {
  // Avoimet tehtävät
  const [tasks, setTasks] = useState<Task[]>([]);

  // Latauksen tila
  const [loading, setLoading] = useState(true);

  // Mahdollinen virheilmoitus
  const [errorMessage, setErrorMessage] = useState("");

  // Haetaan avoimet tehtävät, kun komponentti avataan.
  useEffect(() => {
    async function fetchOpenTasks() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .neq("status", "Valmis")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Tehtävien hakeminen epäonnistui:", error);
        setErrorMessage("Tehtävien hakeminen epäonnistui.");
        setLoading(false);
        return;
      }

      setTasks(data || []);
      setLoading(false);
    }

    fetchOpenTasks();
  }, []);

  // Etusivulla näytetään korkeintaan viisi uusinta tehtävää.
  const latestTasks = tasks.slice(0, 5);

  return (
    <>
      {/* Avoimien tehtävien määräkortti */}
      <Link
        href="/tasks"
        className="block rounded-2xl bg-zinc-900 p-6 transition-colors hover:bg-zinc-800"
      >
        <h2 className="mb-2 text-lg font-semibold">Avoimet tehtävät</h2>

        <p className="text-3xl font-bold">{loading ? "..." : tasks.length}</p>
      </Link>

      {/* Uusimpien avoimien tehtävien lista */}
      <section className="rounded-2xl bg-zinc-900 p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Uusimmat avoimet tehtävät</h2>

          <Link
            href="/tasks"
            className="shrink-0 text-sm text-zinc-400 hover:text-white"
          >
            Näytä kaikki
          </Link>
        </div>

        {loading && <p className="text-zinc-400">Ladataan tehtäviä...</p>}

        {errorMessage && <p className="text-red-400">{errorMessage}</p>}

        {!loading && !errorMessage && latestTasks.length === 0 && (
          <p className="text-zinc-400">Ei avoimia tehtäviä.</p>
        )}

        {!loading && !errorMessage && latestTasks.length > 0 && (
          <div className="grid gap-3">
            {latestTasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-zinc-800 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold break-words">{task.title}</h3>

                    <p className="mt-2 text-sm text-zinc-400">
                      {task.responsible_person || "Ei vastuuhenkilöä"} ·{" "}
                      {task.deadline || "Ei deadlinea"} ·{" "}
                      {task.priority || "Ei prioriteettia"}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm text-zinc-300">
                    {task.status || "Aloittamatta"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
