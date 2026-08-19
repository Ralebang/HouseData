"use client";

import type { Maintenance } from "@/types/maintenance";

type MaintenanceCardProps = {
  item: Maintenance;
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

// Palauttaa tilalle sopivan värin.
function getStatusColor(status: string | null) {
  switch (status) {
    case "Valmis":
      return "#22c55e";

    case "Käynnissä":
      return "#3b82f6";

    case "Kilpailutuksessa":
      return "#f59e0b";

    default:
      return "#a1a1aa";
  }
}

export default function MaintenanceCard({
  item,
  onUpdateStatus,
  onDelete,
}: MaintenanceCardProps) {
  return (
    <article className="rounded-xl bg-zinc-800 p-5 hover:bg-zinc-700 transition-colors">
      {/* Kohteen perustiedot */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">{item.title}</h3>

          {item.description && (
            <p className="mt-2 text-zinc-300">{item.description}</p>
          )}

          <div className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-3">
            <p>
              Vuosi:{" "}
              <span className="text-zinc-200">{item.planned_year || "-"}</span>
            </p>

            <p>
              Arvio:{" "}
              <span className="text-zinc-200">
                {item.estimated_cost != null
                  ? `${Number(item.estimated_cost).toLocaleString("fi-FI")} €`
                  : "-"}
              </span>
            </p>

            <p>
              Prioriteetti:{" "}
              <span className="text-zinc-200">{item.priority || "-"}</span>
            </p>
          </div>
        </div>

        {/* Nykyinen tila */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: getStatusColor(item.status),
              display: "inline-block",
              flexShrink: 0,
            }}
          />

          <span className="whitespace-nowrap text-sm text-zinc-300">
            {item.status || "Suunnitteilla"}
          </span>
        </div>
      </div>

      {/* Toiminnot */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="w-full lg:max-w-xs">
          <label className="mb-2 block text-sm text-zinc-400">
            Muuta tilaa
          </label>

          <select
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
            value={item.status || "Suunnitteilla"}
            onChange={(event) => onUpdateStatus(item.id, event.target.value)}
          >
            <option value="Suunnitteilla">Suunnitteilla</option>
            <option value="Kilpailutuksessa">Kilpailutuksessa</option>
            <option value="Käynnissä">Käynnissä</option>
            <option value="Valmis">Valmis</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500 lg:w-auto"
        >
          Poista
        </button>
      </div>
    </article>
  );
}
