"use client";

type FaultFormProps = {
  title: string;
  description: string;
  location: string;
  reporter: string;
  priority: string;
  status: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onReporterChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export default function FaultForm({
  title,
  description,
  location,
  reporter,
  priority,
  status,
  onTitleChange,
  onDescriptionChange,
  onLocationChange,
  onReporterChange,
  onPriorityChange,
  onStatusChange,
  onSubmit,
}: FaultFormProps) {
  return (
    <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">Lisää vikailmoitus</h2>

      <div className="grid gap-4">
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
          placeholder="Otsikko"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
          placeholder="Kuvaus"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
            placeholder="Sijainti, esimerkiksi asunto A12"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
          />

          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
            placeholder="Ilmoittaja"
            value={reporter}
            onChange={(event) => onReporterChange(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Kiireellisyys
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
              <option value="Uusi">Uusi</option>
              <option value="Käsittelyssä">Käsittelyssä</option>
              <option value="Korjattu">Korjattu</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200"
        >
          Lisää vikailmoitus
        </button>
      </div>
    </section>
  );
}
