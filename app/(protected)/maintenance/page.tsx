"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import MaintenanceForm from "@/components/maintenance/MaintenanceForm";
import MaintenanceCard from "@/components/maintenance/MaintenanceCard";

import { supabase } from "@/lib/supabase";

import type { Maintenance } from "@/types/maintenance";

import { useBuilding } from "@/context/BuildingContext";

export default function MaintenancePage() {
  // =========================
  // VALITTU TALOYHTIÖ
  // =========================

  const { selectedBuildingId, selectedBuilding } = useBuilding();

  // =========================
  // KUNNOSSAPITOTOIMENPITEET
  // =========================

  const [maintenanceItems, setMaintenanceItems] = useState<Maintenance[]>([]);

  // =========================
  // LOMAKKEEN KENTÄT
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plannedYear, setPlannedYear] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [priority, setPriority] = useState("Normaali");
  const [status, setStatus] = useState("Suunnitteilla");

  // =========================
  // HAE VALITUN TALOYHTIÖN
  // KUNNOSSAPITOTOIMENPITEET
  // =========================

  async function fetchMaintenanceItems() {
    if (!selectedBuildingId) {
      return;
    }

    const { data, error } = await supabase
      .from("maintenance")
      .select("*")
      .eq("building_id", selectedBuildingId)
      .order("planned_year", { ascending: true });

    if (error) {
      console.error("Kunnossapitotietojen haku epäonnistui:", error);
      return;
    }

    setMaintenanceItems(data || []);
  }

  // =========================
  // HAE TIEDOT, KUN TALOYHTIÖ VAIHTUU
  // =========================

  useEffect(() => {
    async function loadMaintenanceItems() {
      if (!selectedBuildingId) {
        return [];
      }

      const { data, error } = await supabase
        .from("maintenance")
        .select("*")
        .eq("building_id", selectedBuildingId)
        .order("planned_year", { ascending: true });

      if (error) {
        console.error("Kunnossapitotietojen haku epäonnistui:", error);

        return [];
      }

      return data || [];
    }

    loadMaintenanceItems().then((data) => {
      setMaintenanceItems(data);
    });
  }, [selectedBuildingId]);

  // =========================
  // LISÄÄ KUNNOSSAPITOTOIMENPIDE
  // =========================

  async function addMaintenanceItem() {
    if (!selectedBuildingId) {
      alert("Valitse ensin taloyhtiö.");
      return;
    }

    if (!title.trim()) {
      alert("Anna kunnossapitotoimenpiteelle nimi.");
      return;
    }

    const { error } = await supabase.from("maintenance").insert({
      building_id: selectedBuildingId,
      title: title.trim(),
      description: description.trim() || null,
      planned_year: plannedYear ? Number(plannedYear) : null,
      estimated_cost: estimatedCost ? Number(estimatedCost) : null,
      priority,
      status,
    });

    if (error) {
      console.error("Kunnossapitotoimenpiteen lisääminen epäonnistui:", error);

      alert("Kunnossapitotoimenpiteen lisääminen epäonnistui.");
      return;
    }

    // Tyhjennetään lomake.
    setTitle("");
    setDescription("");
    setPlannedYear("");
    setEstimatedCost("");
    setPriority("Normaali");
    setStatus("Suunnitteilla");

    // Päivitetään lista.
    await fetchMaintenanceItems();
  }

  // =========================
  // MUUTA TILAA
  // =========================

  async function updateMaintenanceStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("maintenance")
      .update({
        status: newStatus,
      })
      .eq("id", id);

    if (error) {
      console.error("Kunnossapitotilan muuttaminen epäonnistui:", error);

      alert("Tilan muuttaminen epäonnistui.");
      return;
    }

    await fetchMaintenanceItems();
  }

  // =========================
  // POISTA KUNNOSSAPITOTOIMENPIDE
  // =========================

  async function deleteMaintenanceItem(id: string) {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän kunnossapitotoimenpiteen?",
    );

    if (!confirmed) return;

    const { error } = await supabase.from("maintenance").delete().eq("id", id);

    if (error) {
      console.error("Kunnossapitotoimenpiteen poistaminen epäonnistui:", error);

      alert("Poistaminen epäonnistui.");
      return;
    }

    await fetchMaintenanceItems();
  }

  // =========================
  // KÄYTTÖLIITTYMÄ
  // =========================

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Sivupalkki */}
        <Sidebar />

        {/* Sivun varsinainen sisältö */}
        <section className="flex-1 overflow-x-hidden p-6 md:p-10">
          <div className="mx-auto w-full max-w-5xl">
            {/* Sivun otsikko */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold">Kunnossapito</h1>

              <p className="mt-2 text-zinc-400">
                {selectedBuilding
                  ? selectedBuilding.name
                  : "Taloyhtiötä ei ole valittu"}
              </p>
            </div>

            {/* =========================
                LISÄÄ KUNNOSSAPITOTOIMENPIDE
            ========================= */}

            {!selectedBuildingId ? (
              <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
                <p className="text-zinc-400">
                  Valitse ensin taloyhtiö etusivulta.
                </p>
              </section>
            ) : (
              <MaintenanceForm
                title={title}
                description={description}
                plannedYear={plannedYear}
                estimatedCost={estimatedCost}
                priority={priority}
                status={status}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onPlannedYearChange={setPlannedYear}
                onEstimatedCostChange={setEstimatedCost}
                onPriorityChange={setPriority}
                onStatusChange={setStatus}
                onSubmit={addMaintenanceItem}
              />
            )}

            {/* =========================
                KUNNOSSAPITOLISTA
            ========================= */}

            <section className="rounded-2xl bg-zinc-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">
                Kunnossapitosuunnitelma
              </h2>

              {!selectedBuildingId ? (
                <p className="text-zinc-400">
                  Valitse taloyhtiö nähdäksesi kunnossapitotoimenpiteet.
                </p>
              ) : maintenanceItems.length === 0 ? (
                <p className="text-zinc-400">
                  Tällä taloyhtiöllä ei ole kunnossapitotoimenpiteitä.
                </p>
              ) : (
                <div className="grid gap-4">
                  {maintenanceItems.map((item) => (
                    <MaintenanceCard
                      key={item.id}
                      item={item}
                      onUpdateStatus={updateMaintenanceStatus}
                      onDelete={deleteMaintenanceItem}
                    />
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
