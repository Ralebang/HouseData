"use client";

type InvoiceFormProps = {
  supplier: string;
  invoiceNumber: string;
  description: string;
  amount: string;
  dueDate: string;
  status: string;
  file: File | null;
  uploading: boolean;

  onSupplierChange: (value: string) => void;
  onInvoiceNumberChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
};

export default function InvoiceForm({
  supplier,
  invoiceNumber,
  description,
  amount,
  dueDate,
  status,
  file,
  uploading,
  onSupplierChange,
  onInvoiceNumberChange,
  onDescriptionChange,
  onAmountChange,
  onDueDateChange,
  onStatusChange,
  onFileChange,
  onSubmit,
}: InvoiceFormProps) {
  return (
    <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">Lisää lasku</h2>

      <div className="grid gap-4">
        <input
          type="text"
          value={supplier}
          onChange={(event) => onSupplierChange(event.target.value)}
          placeholder="Toimittaja"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
        />

        <input
          type="text"
          value={invoiceNumber}
          onChange={(event) => onInvoiceNumberChange(event.target.value)}
          placeholder="Laskun numero"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
        />

        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Kuvaus"
          className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Summa €</label>

            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Eräpäivä</label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => onDueDateChange(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Tila</label>

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
          >
            <option value="Odottaa käsittelyä">Odottaa käsittelyä</option>

            <option value="Hyväksytty">Hyväksytty</option>

            <option value="Maksettu">Maksettu</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Lasku PDF</label>

          <input
            type="file"
            accept=".pdf"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-zinc-300"
          />

          {file && <p className="mt-2 text-sm text-zinc-500">{file.name}</p>}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={uploading}
          className="rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
        >
          {uploading ? "Tallennetaan..." : "Lisää lasku"}
        </button>
      </div>
    </section>
  );
}
