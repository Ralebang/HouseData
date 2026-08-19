"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useBuilding } from "@/context/BuildingContext";

type ActivityItem = {
  id: string;
  sourceId: string;
  title: string;
  type: "Tehtävä" | "Vikailmoitus" | "Kunnossapito";
  detail: string;
  priority?: string | null;
};

export default function RecentActivity() {
  const { selectedBuildingId } = useBuilding();

  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // HAE AJANKOHTAISET ASIAT
  // =========================

  useEffect(() => {
    async function loadActivity() {
      if (!selectedBuildingId) {
        return [];
      }

      // =========================
      // TEHTÄVÄT
      // =========================

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, status, priority, deadline, created_at")
        .eq("building_id", selectedBuildingId)
        .neq("status", "Valmis")
        .order("created_at", { ascending: false })
        .limit(3);

      if (tasksError) {
        console.error("Ajankohtaisten tehtävien haku epäonnistui:", tasksError);
      }

      // =========================
      // VIKAILMOITUKSET
      // =========================

      const { data: faults, error: faultsError } = await supabase
        .from("faults")
        .select("id, title, status, priority, created_at")
        .eq("building_id", selectedBuildingId)
        .neq("status", "Korjattu")
        .order("created_at", { ascending: false })
        .limit(3);

      if (faultsError) {
        console.error(
          "Ajankohtaisten vikailmoitusten haku epäonnistui:",
          faultsError,
        );
      }

      // =========================
      // KUNNOSSAPITO
      // =========================

      const { data: maintenance, error: maintenanceError } = await supabase
        .from("maintenance")
        .select("id, title, status, priority, planned_year")
        .eq("building_id", selectedBuildingId)
        .neq("status", "Valmis")
        .order("planned_year", { ascending: true })
        .limit(3);

      if (maintenanceError) {
        console.error(
          "Ajankohtaisten kunnossapitotietojen haku epäonnistui:",
          maintenanceError,
        );
      }

      // =========================
      // MUODOSTETAAN YHTEINEN LISTA
      // =========================

      const taskItems: ActivityItem[] = (tasks || []).map((task) => ({
        id: `task-${task.id}`,
        sourceId: task.id,
        title: task.title,
        type: "Tehtävä",
        detail: task.deadline
          ? `${task.status} · Deadline ${formatDate(task.deadline)}`
          : task.status || "Aloittamatta",
        priority: task.priority,
      }));

      const faultItems: ActivityItem[] = (faults || []).map((fault) => ({
        id: `fault-${fault.id}`,
        sourceId: fault.id,
        title: fault.title,
        type: "Vikailmoitus",
        detail: fault.status || "Uusi",
        priority: fault.priority,
      }));

      const maintenanceItems: ActivityItem[] = (maintenance || []).map(
        (maintenanceItem) => ({
          id: `maintenance-${maintenanceItem.id}`,
          sourceId: maintenanceItem.id,
          title: maintenanceItem.title,
          type: "Kunnossapito",
          detail: maintenanceItem.planned_year
            ? `${maintenanceItem.status} · ${maintenanceItem.planned_year}`
            : maintenanceItem.status || "Suunnitteilla",
          priority: maintenanceItem.priority,
        }),
      );

      // Korkean prioriteetin asiat ensin.
      const combinedItems = [
        ...taskItems,
        ...faultItems,
        ...maintenanceItems,
      ].sort((a, b) => {
        return priorityValue(b.priority) - priorityValue(a.priority);
      });

      // Etusivulla näytetään enintään 6 asiaa.
      return combinedItems.slice(0, 6);
    }

    loadActivity().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [selectedBuildingId]);

  // =========================
  // MERKITSE VALMIIKSI
  // =========================

  async function markAsDone(item: ActivityItem) {
    let error = null;

    if (item.type === "Tehtävä") {
      const result = await supabase
        .from("tasks")
        .update({ status: "Valmis" })
        .eq("id", item.sourceId);

      error = result.error;
    }

    if (item.type === "Vikailmoitus") {
      const result = await supabase
        .from("faults")
        .update({ status: "Korjattu" })
        .eq("id", item.sourceId);

      error = result.error;
    }

    if (item.type === "Kunnossapito") {
      const result = await supabase
        .from("maintenance")
        .update({ status: "Valmis" })
        .eq("id", item.sourceId);

      error = result.error;
    }

    if (error) {
      console.error(
        "Ajankohtaisen asian tilan muuttaminen epäonnistui:",
        error,
      );

      alert("Tilan muuttaminen epäonnistui.");
      return;
    }

    // Poistetaan valmis asia heti etusivun Ajankohtaista-listasta.
    setItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== item.id),
    );
  }

  // =========================
  // PRIORITEETIN JÄRJESTYS
  // =========================

  function priorityValue(priority?: string | null) {
    if (priority === "Korkea") {
      return 3;
    }

    if (priority === "Normaali") {
      return 2;
    }

    if (priority === "Matala") {
      return 1;
    }

    return 0;
  }

  // =========================
  // PÄIVÄMÄÄRÄ
  // =========================

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fi-FI");
  }

  // =========================
  // PRIORITEETTIPISTE
  // =========================

  function priorityColor(priority?: string | null) {
    if (priority === "Korkea") {
      return "bg-red-500";
    }

    if (priority === "Normaali") {
      return "bg-yellow-500";
    }

    if (priority === "Matala") {
      return "bg-green-500";
    }

    return "bg-zinc-500";
  }

  // =========================
  // KÄYTTÖLIITTYMÄ
  // =========================

  return (
    <section className="mb-6 rounded-2xl bg-zinc-900 p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Ajankohtaista</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Valitun taloyhtiön avoimet ja tulevat asiat
        </p>
      </div>

      {!selectedBuildingId ? (
        <p className="text-zinc-400">Valitse ensin taloyhtiö.</p>
      ) : loading ? (
        <p className="text-zinc-400">Ladataan ajankohtaisia asioita...</p>
      ) : items.length === 0 ? (
        <p className="text-zinc-400">Ei ajankohtaisia asioita.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl bg-zinc-800 p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Asian tiedot */}
                <div className="flex min-w-0 items-start gap-3">
                  {/* Prioriteettipallo */}
                  <span
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${priorityColor(
                      item.priority,
                    )}`}
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{item.title}</h3>

                      <span className="rounded-md bg-zinc-700 px-2 py-1 text-xs text-zinc-300">
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-zinc-400">
                      {item.detail}

                      {item.priority && (
                        <>
                          {" · "}
                          {item.priority} prioriteetti
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Valmis-painike */}
                <button
                  type="button"
                  onClick={() => markAsDone(item)}
                  className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                >
                  Valmis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
