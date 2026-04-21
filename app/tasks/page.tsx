"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function TasksPage() {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([
    "Pyydä tarjous putkikartoituksesta",
    "Tarkista katon huoltotarve",
    "Valmistele hallituksen kokous",
  ]);

  function handleAddTask() {
    if (taskTitle.trim() === "") return;

    setTasks([taskTitle, ...tasks]);
    setTaskTitle("");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Tehtävät</h1>

            <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Lisää uusi tehtävä</h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Kirjoita tehtävä..."
                  className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none"
                />

                <button
                  onClick={handleAddTask}
                  className="rounded-xl bg-white text-black px-5 py-3 font-medium"
                >
                  Lisää
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Avoimet tehtävät</h2>

              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={index} className="rounded-xl bg-zinc-800 px-4 py-3">
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
