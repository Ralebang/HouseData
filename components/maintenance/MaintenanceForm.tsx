"use client";

type MaintenanceFormProps = {
  title: string;
  description: string;
  plannedYear: string;
  estimatedCost: string;
  priority: string;
  status: string;

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPlannedYearChange: (value: string) => void;
  onEstimatedCostChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export default function MaintenanceForm({
  title,
  description,
  plannedYear,
  estimatedCost,
  priority,
  status,
  onTitleChange,
  onDescriptionChange,
  onPlannedYearChange,
  onEstimatedCostChange,
  onPriorityChange,
  onStatusChange,
  onSubmit,
}: MaintenanceFormProps) {
  return (
    <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">Lisää kunnossapitotoimenpide</h2>

      <div className="grid gap-4">
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
          placeholder="Toimenpiteen nimi"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />

        <textarea
          className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
          placeholder="Kuvaus"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Suunniteltu vuosi
            </label>

            <input
              type="number"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
              placeholder="2027"
              value={plannedYear}
              onChange={(event) => onPlannedYearChange(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Arvioitu kustannus (€)
            </label>

            <input
              type="number"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
              placeholder="8000"
              value={estimatedCost}
              onChange={(event) => onEstimatedCostChange(event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Prioriteetti
            </label>

            <select
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
              value={priority}
              onChange={(event) => onPriorityChange(event.target.value)}
            >
              <option value="Matala">Matala</option>
              <option value="Normaali">Normaali</option>
              <option value="Korkea">Korkea</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Tila</label>

            <select
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="Suunnitteilla">Suunnitteilla</option>
              <option value="Kilpailutuksessa">Kilpailutuksessa</option>
              <option value="Käynnissä">Käynnissä</option>
              <option value="Valmis">Valmis</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200"
        >
          Lisää kunnossapitotoimenpide
        </button>
      </div>
    </section>
  );
}
