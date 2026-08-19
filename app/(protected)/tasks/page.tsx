"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";

import { supabase } from "@/lib/supabase";

import type { Task } from "@/types/task";

import { useBuilding } from "@/context/BuildingContext";

export default function TasksPage() {
  // =========================
  // VALITTU TALOYHTIÖ
  // =========================

  const { selectedBuildingId, selectedBuilding } = useBuilding();

  // =========================
  // TEHTÄVÄT
  // =========================

  const [tasks, setTasks] = useState<Task[]>([]);

  // =========================
  // LOMAKKEEN TILA
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Normaali");
  const [status, setStatus] = useState("Aloittamatta");

  // =========================
  // HAE VALITUN TALOYHTIÖN TEHTÄVÄT
  // =========================

  async function fetchTasks() {
    if (!selectedBuildingId) {
      return [];
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("building_id", selectedBuildingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Tehtävien hakeminen epäonnistui:", error);

      return [];
    }

    return data || [];
  }

  // =========================
  // HAE TEHTÄVÄT, KUN TALOYHTIÖ VAIHTUU
  // =========================

  useEffect(() => {
    async function loadTasks() {
      const data = await fetchTasks();

      return data;
    }

    loadTasks().then((data) => {
      setTasks(data);
    });
  }, [selectedBuildingId]);

  // =========================
  // LISÄÄ UUSI TEHTÄVÄ
  // =========================

  async function addTask() {
    if (!selectedBuildingId) {
      alert("Valitse ensin taloyhtiö.");
      return;
    }

    if (!title.trim()) {
      alert("Kirjoita tehtävälle otsikko.");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      building_id: selectedBuildingId,
      title: title.trim(),
      description: description.trim() || null,
      responsible_person: responsiblePerson.trim() || null,
      deadline: deadline || null,
      priority,
      status,
    });

    if (error) {
      console.error(
        "Tehtävän lisääminen epäonnistui:",
        error.message,
        error.details,
        error.hint,
      );

      alert("Tehtävän lisääminen epäonnistui.");
      return;
    }

    // Tyhjennetään lomake.
    setTitle("");
    setDescription("");
    setResponsiblePerson("");
    setDeadline("");
    setPriority("Normaali");
    setStatus("Aloittamatta");

    // Päivitetään tehtävälista.
    const updatedTasks = await fetchTasks();

    setTasks(updatedTasks);
  }

  // =========================
  // MUUTA TEHTÄVÄN TILAA
  // =========================

  async function updateTaskStatus(taskId: string, newStatus: string) {
    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
      })
      .eq("id", taskId);

    if (error) {
      console.error("Tehtävän tilan muuttaminen epäonnistui:", error);

      alert("Tehtävän tilan muuttaminen epäonnistui.");
      return;
    }

    // Päivitetään tehtävälista.
    const updatedTasks = await fetchTasks();

    setTasks(updatedTasks);
  }

  // =========================
  // POISTA TEHTÄVÄ
  // =========================

  async function deleteTask(taskId: string) {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän tehtävän?",
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Tehtävän poistaminen epäonnistui:", error);

      alert("Tehtävän poistaminen epäonnistui.");
      return;
    }

    // Päivitetään tehtävälista.
    const updatedTasks = await fetchTasks();

    setTasks(updatedTasks);
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
            {/* =========================
                SIVUN OTSIKKO
            ========================= */}

            <div className="mb-8">
              <h1 className="text-4xl font-bold">Tehtävät</h1>

              <p className="mt-2 text-zinc-400">
                {selectedBuilding
                  ? selectedBuilding.name
                  : "Taloyhtiötä ei ole valittu"}
              </p>
            </div>

            {/* =========================
                LISÄÄ UUSI TEHTÄVÄ
            ========================= */}

            <section className="mb-10 rounded-2xl bg-zinc-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">Lisää uusi tehtävä</h2>

              {!selectedBuildingId ? (
                <p className="text-zinc-400">
                  Valitse ensin taloyhtiö etusivulta.
                </p>
              ) : (
                <div className="grid gap-4">
                  {/* Otsikko */}
                  <input
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
                    type="text"
                    placeholder="Otsikko"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />

                  {/* Kuvaus */}
                  <textarea
                    className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
                    placeholder="Kuvaus"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />

                  {/* Vastuuhenkilö */}
                  <input
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-400"
                    type="text"
                    placeholder="Vastuuhenkilö"
                    value={responsiblePerson}
                    onChange={(event) =>
                      setResponsiblePerson(event.target.value)
                    }
                  />

                  {/* Deadline */}
                  <div>
                    <label
                      htmlFor="task-deadline"
                      className="mb-2 block text-sm text-zinc-400"
                    >
                      Deadline
                    </label>

                    <input
                      id="task-deadline"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
                      type="date"
                      value={deadline}
                      onChange={(event) => setDeadline(event.target.value)}
                    />
                  </div>

                  {/* Prioriteetti + tila */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Prioriteetti */}
                    <div>
                      <label
                        htmlFor="task-priority"
                        className="mb-2 block text-sm text-zinc-400"
                      >
                        Prioriteetti
                      </label>

                      <select
                        id="task-priority"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                      >
                        <option value="Matala">Matala</option>

                        <option value="Normaali">Normaali</option>

                        <option value="Korkea">Korkea</option>
                      </select>
                    </div>

                    {/* Tila */}
                    <div>
                      <label
                        htmlFor="task-status"
                        className="mb-2 block text-sm text-zinc-400"
                      >
                        Tila
                      </label>

                      <select
                        id="task-status"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        <option value="Aloittamatta">Aloittamatta</option>

                        <option value="Työn alla">Työn alla</option>

                        <option value="Valmis">Valmis</option>

                        <option value="Myöhässä">Myöhässä</option>
                      </select>
                    </div>
                  </div>

                  {/* Tallennuspainike */}
                  <button
                    type="button"
                    onClick={addTask}
                    className="rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200"
                  >
                    Lisää tehtävä
                  </button>
                </div>
              )}
            </section>

            {/* =========================
                TEHTÄVÄLISTA
            ========================= */}

            <section className="rounded-2xl bg-zinc-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">Tehtävät</h2>

              {!selectedBuildingId ? (
                <p className="text-zinc-400">
                  Valitse taloyhtiö nähdäksesi tehtävät.
                </p>
              ) : tasks.length === 0 ? (
                <p className="text-zinc-400">
                  Tällä taloyhtiöllä ei ole tehtäviä.
                </p>
              ) : (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={updateTaskStatus}
                      onDelete={deleteTask}
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
