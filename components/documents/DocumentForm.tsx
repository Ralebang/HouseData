"use client";

type DocumentFormProps = {
  name: string;
  category: string;
  description: string;
  file: File | null;

  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => Promise<void>;

  uploading: boolean;
};

export default function DocumentForm({
  name,
  category,
  description,
  file,
  onNameChange,
  onCategoryChange,
  onDescriptionChange,
  onFileChange,
  onSubmit,
  uploading,
}: DocumentFormProps) {
  return (
    <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
      {/* Lomakkeen otsikko */}
      <h2 className="mb-6 text-2xl font-bold">Lisää dokumentti</h2>

      <div className="grid gap-4">
        {/* Dokumentin nimi */}
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Dokumentin nimi
          </label>

          <input
            type="text"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
            placeholder="Esim. Yhtiökokouksen pöytäkirja 2026"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>

        {/* Dokumentin kategoria */}
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Kategoria</label>

          <select
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="Huoltokirja">Huoltokirja</option>
            <option value="PTS-suunnitelma">PTS-suunnitelma</option>
            <option value="Tarjous">Tarjous</option>
            <option value="Pöytäkirja">Pöytäkirja</option>
            <option value="Sopimus">Sopimus</option>
            <option value="Muu">Muu</option>
          </select>
        </div>

        {/* Dokumentin kuvaus */}
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Kuvaus</label>

          <textarea
            className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
            placeholder="Lyhyt kuvaus dokumentista..."
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </div>

        {/* Tiedoston valinta */}
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Tiedosto</label>

          <input
            type="file"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-zinc-300"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />

          {/* Näytetään valitun tiedoston nimi */}
          {file && (
            <p className="mt-2 text-sm text-zinc-400">
              Valittu tiedosto: {file.name}
            </p>
          )}
        </div>

        {/* Tallennuspainike */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={uploading}
          className="rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Tallennetaan..." : "Lisää dokumentti"}
        </button>
      </div>
    </section>
  );
}
