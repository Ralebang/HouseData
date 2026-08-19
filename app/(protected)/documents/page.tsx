"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import DocumentForm from "@/components/documents/DocumentForm";

import { supabase } from "@/lib/supabase";

import type { Document } from "@/types/document";

import { useBuilding } from "@/context/BuildingContext";

export default function DocumentsPage() {
  // =========================
  // VALITTU TALOYHTIÖ
  // =========================

  const { selectedBuildingId, selectedBuilding } = useBuilding();

  // =========================
  // DOKUMENTIT
  // =========================

  const [documents, setDocuments] = useState<Document[]>([]);

  // =========================
  // LOMAKKEEN TILA
  // =========================

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Muu");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Uploadin tila
  const [uploading, setUploading] = useState(false);

  // =========================
  // HAE VALITUN TALOYHTIÖN
  // DOKUMENTIT
  // =========================

  async function fetchDocuments() {
    if (!selectedBuildingId) {
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("building_id", selectedBuildingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dokumenttien haku epäonnistui:", error);
      return;
    }

    setDocuments(data || []);
  }

  // =========================
  // HAE DOKUMENTIT,
  // KUN TALOYHTIÖ VAIHTUU
  // =========================

  useEffect(() => {
    async function loadDocuments() {
      if (!selectedBuildingId) {
        return [];
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("building_id", selectedBuildingId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Dokumenttien haku epäonnistui:", error);

        return [];
      }

      return data || [];
    }

    loadDocuments().then((data) => {
      setDocuments(data);
    });
  }, [selectedBuildingId]);

  // =========================
  // LISÄÄ DOKUMENTTI
  // =========================

  async function addDocument() {
    if (!selectedBuildingId) {
      alert("Valitse ensin taloyhtiö.");
      return;
    }

    if (!name.trim()) {
      alert("Anna dokumentille nimi.");
      return;
    }

    if (!file) {
      alert("Valitse tiedosto.");
      return;
    }

    setUploading(true);

    try {
      // Otetaan alkuperäisen tiedoston pääte.
      const fileExtension = file.name.split(".").pop() || "file";

      // Luodaan uniikki tiedostonimi.
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      // Storage-polku:
      //
      // documents/
      //   building-id/
      //     category/
      //       tiedosto.pdf
      //
      // Näin eri taloyhtiöiden tiedostot
      // pysyvät erillään myös Storagessa.
      const filePath = `${selectedBuildingId}/${category}/${fileName}`;

      // =========================
      // LATAA TIEDOSTO STORAGEEN
      // =========================

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Tiedoston lataaminen epäonnistui:", uploadError);

        alert("Tiedoston lataaminen epäonnistui.");
        return;
      }

      // =========================
      // TALLENNA METADATA
      // =========================

      const { error: insertError } = await supabase.from("documents").insert({
        building_id: selectedBuildingId,
        name: name.trim(),
        category,
        description: description.trim() || null,
        file_path: filePath,
      });

      if (insertError) {
        console.error(
          "Dokumentin tietojen tallennus epäonnistui:",
          insertError,
        );

        alert("Dokumentin tietojen tallennus epäonnistui.");

        return;
      }

      // =========================
      // TYHJENNÄ LOMAKE
      // =========================

      setName("");
      setCategory("Muu");
      setDescription("");
      setFile(null);

      // Päivitetään lista.
      await fetchDocuments();

      alert("Dokumentti lisätty onnistuneesti.");
    } finally {
      setUploading(false);
    }
  }

  // =========================
  // AVAA DOKUMENTTI
  // =========================

  function openDocument(filePath: string | null) {
    if (!filePath) {
      return;
    }

    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);

    window.open(data.publicUrl, "_blank", "noopener,noreferrer");
  }

  // =========================
  // KÄYTTÖLIITTYMÄ
  // =========================

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Sivupalkki */}
        <Sidebar />

        {/* Sivun sisältö */}
        <section className="flex-1 overflow-x-hidden p-6 md:p-10">
          <div className="mx-auto w-full max-w-5xl">
            {/* Sivun otsikko */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold">Dokumentit</h1>

              <p className="mt-2 text-zinc-400">
                {selectedBuilding
                  ? selectedBuilding.name
                  : "Taloyhtiötä ei ole valittu"}
              </p>
            </div>

            {/* =========================
                LISÄÄ DOKUMENTTI
            ========================= */}

            {!selectedBuildingId ? (
              <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
                <p className="text-zinc-400">
                  Valitse ensin taloyhtiö etusivulta.
                </p>
              </section>
            ) : (
              <DocumentForm
                name={name}
                category={category}
                description={description}
                file={file}
                onNameChange={setName}
                onCategoryChange={setCategory}
                onDescriptionChange={setDescription}
                onFileChange={setFile}
                onSubmit={addDocument}
                uploading={uploading}
              />
            )}

            {/* =========================
                DOKUMENTTILISTA
            ========================= */}

            <section className="rounded-2xl bg-zinc-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">
                Tallennetut dokumentit
              </h2>

              {!selectedBuildingId ? (
                <p className="text-zinc-400">
                  Valitse taloyhtiö nähdäksesi dokumentit.
                </p>
              ) : documents.length === 0 ? (
                <p className="text-zinc-400">
                  Tällä taloyhtiöllä ei ole dokumentteja.
                </p>
              ) : (
                <div className="grid gap-4">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="rounded-xl bg-zinc-800 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        {/* Dokumentin tiedot */}
                        <div>
                          <h3 className="text-lg font-bold">{document.name}</h3>

                          <p className="mt-1 text-sm text-zinc-400">
                            {document.category}
                          </p>

                          {document.description && (
                            <p className="mt-3 text-zinc-300">
                              {document.description}
                            </p>
                          )}
                        </div>

                        {/* Avaa dokumentti */}
                        {document.file_path && (
                          <button
                            type="button"
                            onClick={() => openDocument(document.file_path)}
                            className="shrink-0 rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-200"
                          >
                            Avaa
                          </button>
                        )}
                      </div>
                    </div>
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
