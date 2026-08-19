"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import InvoiceForm from "@/components/invoices/InvoiceForm";

import { supabase } from "@/lib/supabase";
import { useBuilding } from "@/context/BuildingContext";

type Invoice = {
  id: string;
  supplier: string;
  invoice_number: string | null;
  description: string | null;
  amount: number;
  due_date: string | null;
  status: string;
  file_path: string | null;
  created_at: string;
};

export default function InvoicesPage() {
  const { selectedBuildingId, selectedBuilding } = useBuilding();

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [supplier, setSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Odottaa käsittelyä");

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  // =========================
  // HAE LASKUT
  // =========================

  async function fetchInvoices() {
    if (!selectedBuildingId) {
      return [];
    }

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("building_id", selectedBuildingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Laskujen haku epäonnistui:", error);

      return [];
    }

    return data || [];
  }

  useEffect(() => {
    fetchInvoices().then((data) => {
      setInvoices(data);
    });
  }, [selectedBuildingId]);

  // =========================
  // LISÄÄ LASKU
  // =========================

  async function addInvoice() {
    if (!selectedBuildingId) {
      alert("Valitse ensin taloyhtiö.");
      return;
    }

    if (!supplier.trim()) {
      alert("Anna laskulle toimittaja.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Anna laskulle summa.");
      return;
    }

    setUploading(true);

    try {
      let filePath: string | null = null;

      // PDF ei ole pakollinen.
      if (file) {
        const extension = file.name.split(".").pop() || "pdf";

        const fileName = `${crypto.randomUUID()}.${extension}`;

        filePath = `${selectedBuildingId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("invoices")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Laskun PDF:n lataus epäonnistui:", uploadError);

          alert("Laskun PDF:n lataaminen epäonnistui.");

          return;
        }
      }

      const { error } = await supabase.from("invoices").insert({
        building_id: selectedBuildingId,
        supplier: supplier.trim(),
        invoice_number: invoiceNumber.trim() || null,
        description: description.trim() || null,
        amount: Number(amount),
        due_date: dueDate || null,
        status,
        file_path: filePath,
      });

      if (error) {
        console.error("Laskun tallentaminen epäonnistui:", error);

        alert("Laskun tallentaminen epäonnistui.");

        return;
      }

      setSupplier("");
      setInvoiceNumber("");
      setDescription("");
      setAmount("");
      setDueDate("");
      setStatus("Odottaa käsittelyä");
      setFile(null);

      const updatedInvoices = await fetchInvoices();

      setInvoices(updatedInvoices);
    } finally {
      setUploading(false);
    }
  }

  // =========================
  // MUUTA TILAA
  // =========================

  async function updateInvoiceStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("invoices")
      .update({
        status: newStatus,
      })
      .eq("id", id);

    if (error) {
      console.error("Laskun tilan muuttaminen epäonnistui:", error);

      alert("Laskun tilan muuttaminen epäonnistui.");

      return;
    }

    const updatedInvoices = await fetchInvoices();

    setInvoices(updatedInvoices);
  }

  // =========================
  // POISTA LASKU
  // =========================

  async function deleteInvoice(invoice: Invoice) {
    const confirmed = window.confirm("Haluatko varmasti poistaa tämän laskun?");

    if (!confirmed) {
      return;
    }

    if (invoice.file_path) {
      const { error: storageError } = await supabase.storage
        .from("invoices")
        .remove([invoice.file_path]);

      if (storageError) {
        console.error("Laskutiedoston poistaminen epäonnistui:", storageError);
      }
    }

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoice.id);

    if (error) {
      console.error("Laskun poistaminen epäonnistui:", error);

      alert("Laskun poistaminen epäonnistui.");
      return;
    }

    setInvoices((current) => current.filter((item) => item.id !== invoice.id));
  }

  // =========================
  // AVAA PDF
  // =========================

  function openInvoice(filePath: string | null) {
    if (!filePath) {
      return;
    }

    const { data } = supabase.storage.from("invoices").getPublicUrl(filePath);

    window.open(data.publicUrl, "_blank", "noopener,noreferrer");
  }

  // =========================
  // EUROT
  // =========================

  function formatMoney(value: number) {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-10">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold">Laskut</h1>

              <p className="mt-2 text-zinc-400">
                {selectedBuilding
                  ? selectedBuilding.name
                  : "Taloyhtiötä ei ole valittu"}
              </p>
            </div>

            {!selectedBuildingId ? (
              <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
                <p className="text-zinc-400">
                  Valitse ensin taloyhtiö etusivulta.
                </p>
              </section>
            ) : (
              <InvoiceForm
                supplier={supplier}
                invoiceNumber={invoiceNumber}
                description={description}
                amount={amount}
                dueDate={dueDate}
                status={status}
                file={file}
                uploading={uploading}
                onSupplierChange={setSupplier}
                onInvoiceNumberChange={setInvoiceNumber}
                onDescriptionChange={setDescription}
                onAmountChange={setAmount}
                onDueDateChange={setDueDate}
                onStatusChange={setStatus}
                onFileChange={setFile}
                onSubmit={addInvoice}
              />
            )}

            <section className="rounded-2xl bg-zinc-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">Tallennetut laskut</h2>

              {!selectedBuildingId ? (
                <p className="text-zinc-400">
                  Valitse taloyhtiö nähdäksesi laskut.
                </p>
              ) : invoices.length === 0 ? (
                <p className="text-zinc-400">
                  Tällä taloyhtiöllä ei ole laskuja.
                </p>
              ) : (
                <div className="grid gap-4">
                  {invoices.map((invoice) => (
                    <article
                      key={invoice.id}
                      className="rounded-xl bg-zinc-800 p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-bold">
                            {invoice.supplier}
                          </h3>

                          <p className="mt-1 text-2xl font-bold">
                            {formatMoney(Number(invoice.amount))}
                          </p>

                          {invoice.invoice_number && (
                            <p className="mt-2 text-sm text-zinc-400">
                              Lasku {invoice.invoice_number}
                            </p>
                          )}

                          {invoice.description && (
                            <p className="mt-3 text-zinc-300">
                              {invoice.description}
                            </p>
                          )}

                          <p className="mt-3 text-sm text-zinc-400">
                            Eräpäivä: {invoice.due_date || "-"}
                          </p>
                        </div>

                        <div className="flex min-w-48 flex-col gap-3">
                          <select
                            value={invoice.status}
                            onChange={(event) =>
                              updateInvoiceStatus(
                                invoice.id,
                                event.target.value,
                              )
                            }
                            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white"
                          >
                            <option value="Odottaa käsittelyä">
                              Odottaa käsittelyä
                            </option>

                            <option value="Hyväksytty">Hyväksytty</option>

                            <option value="Maksettu">Maksettu</option>
                          </select>

                          {invoice.file_path && (
                            <button
                              type="button"
                              onClick={() => openInvoice(invoice.file_path)}
                              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
                            >
                              Avaa PDF
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteInvoice(invoice)}
                            className="rounded-xl border border-red-900 px-4 py-3 text-sm text-red-400 hover:bg-red-950/40"
                          >
                            Poista
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
