"use client";

import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  onUpdateStatus: (taskId: string, newStatus: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
};

// Palauttaa tehtävän tilaa vastaavan värin.
function getStatusColor(status: string | null) {
  switch (status) {
    case "Valmis":
      return "#22c55e";

    case "Työn alla":
      return "#3b82f6";

    case "Myöhässä":
      return "#f0f01b";

    default:
      return "#fa1515";
  }
}

export default function TaskCard({
  task,
  onUpdateStatus,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="bg-zinc-800 rounded-xl p-5 hover:bg-zinc-700 transition-colors">
      {/* Tehtävän perustiedot ja nykyinen tila */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold break-words">{task.title}</h3>

          {task.description && (
            <p className="text-zinc-300 mt-2 break-words">{task.description}</p>
          )}

          <p className="text-zinc-400 text-sm mt-3 break-words">
            {task.responsible_person || "-"} · {task.deadline || "-"} ·{" "}
            {task.priority || "-"}
          </p>
        </div>

        {/* Nykyinen tila ja värillinen pallo */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: getStatusColor(task.status),
              display: "inline-block",
              flexShrink: 0,
            }}
          />

          <span className="text-sm text-zinc-300 whitespace-nowrap">
            {task.status || "Aloittamatta"}
          </span>
        </div>
      </div>

      {/* Tehtävän toiminnot */}
      <div className="mt-5 flex flex-col lg:flex-row lg:items-end gap-3">
        {/* Tilan muuttaminen */}
        <div className="w-full lg:max-w-xs">
          <label className="block text-sm text-zinc-400 mb-2">
            Muuta tilaa
          </label>

          <select
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none"
            value={task.status || "Aloittamatta"}
            onChange={(event) => onUpdateStatus(task.id, event.target.value)}
          >
            <option>Aloittamatta</option>
            <option>Työn alla</option>
            <option>Valmis</option>
            <option>Myöhässä</option>
          </select>
        </div>

        {/* Kuittaa valmiiksi */}
        {task.status !== "Valmis" && (
          <button
            type="button"
            onClick={() => onUpdateStatus(task.id, "Valmis")}
            className="w-full lg:w-auto bg-green-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-green-500"
          >
            Kuittaa valmiiksi
          </button>
        )}

        {/* Poista tehtävä */}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="w-full lg:w-auto bg-red-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-red-500"
        >
          Poista
        </button>
      </div>
    </article>
  );
}
