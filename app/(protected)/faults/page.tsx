"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useBuilding } from "@/context/BuildingContext";

import FaultForm from "./FaultForm";

type Fault = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  reporter: string | null;
  priority: string | null;
  status: string | null;
};

export default function FaultsPage() {
  const { selectedBuildingId, selectedBuilding } = useBuilding();

  const [faults, setFaults] = useState<Fault[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [reporter, setReporter] = useState("");
  const [priority, setPriority] = useState("Normaali");
  const [status, setStatus] = useState("Uusi");

  async function fetchFaults() {
    if (!selectedBuildingId) {
      return [];
    }

    const { data, error } = await supabase
      .from("faults")
      .select("*")
      .eq("building_id", selectedBuildingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Vikailmoitusten haku epäonnistui:", error);

      return [];
    }

    return data || [];
  }

  useEffect(() => {
    fetchFaults().then((data) => {
      setFaults(data);
    });
  }, [selectedBuildingId]);

  async function addFault() {
    if (!selectedBuildingId) {
      alert("Valitse ensin taloyhtiö.");
      return;
    }

    if (!title.trim()) {
      alert("Kirjoita vikailmoitukselle otsikko.");
      return;
    }

    const { error } = await supabase.from("faults").insert({
      building_id: selectedBuildingId,
      title: title.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      reporter: reporter.trim() || null,
      priority,
      status,
    });

    if (error) {
      console.error("Vikailmoituksen lisääminen epäonnistui:", error);

      alert("Vikailmoituksen lisääminen epäonnistui.");

      return;
    }

    setTitle("");
    setDescription("");
    setLocation("");
    setReporter("");
    setPriority("Normaali");
    setStatus("Uusi");

    const updatedFaults = await fetchFaults();

    setFaults(updatedFaults);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 overflow-x-hidden p-6 md:p-10">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold">Vikailmoitukset</h1>

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
              <FaultForm
                title={title}
                description={description}
                location={location}
                reporter={reporter}
                priority={priority}
                status={status}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onLocationChange={setLocation}
                onReporterChange={setReporter}
                onPriorityChange={setPriority}
                onStatusChange={setStatus}
                onSubmit={addFault}
              />
            )}

            <section className="rounded-2xl bg-zinc-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">Vikailmoitukset</h2>

              {!selectedBuildingId ? (
                <p className="text-zinc-400">
                  Valitse taloyhtiö nähdäksesi vikailmoitukset.
                </p>
              ) : faults.length === 0 ? (
                <p className="text-zinc-400">
                  Tällä taloyhtiöllä ei ole vikailmoituksia.
                </p>
              ) : (
                <div className="grid gap-4">
                  {faults.map((fault) => (
                    <div key={fault.id} className="rounded-xl bg-zinc-800 p-5">
                      <h3 className="text-lg font-bold">{fault.title}</h3>

                      {fault.description && (
                        <p className="mt-2 text-zinc-300">
                          {fault.description}
                        </p>
                      )}

                      <p className="mt-3 text-sm text-zinc-400">
                        {fault.location || "-"} · {fault.reporter || "-"} ·{" "}
                        {fault.priority || "-"} · {fault.status || "Uusi"}
                      </p>
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
