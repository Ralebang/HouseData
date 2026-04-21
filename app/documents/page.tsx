import Sidebar from "@/components/Sidebar";

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Dokumentit</h1>

            <div className="space-y-4">
              <div className="bg-zinc-900 rounded-2xl p-5">
                <h2 className="text-xl font-semibold">Huoltokirja 2024</h2>
                <p className="text-zinc-400">Kategoria: Huoltokirja</p>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-5">
                <h2 className="text-xl font-semibold">PTS-suunnitelma</h2>
                <p className="text-zinc-400">
                  Kategoria: Pitkän tähtäimen suunnitelma
                </p>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-5">
                <h2 className="text-xl font-semibold">Putkiremontin tarjous</h2>
                <p className="text-zinc-400">Kategoria: Tarjoukset</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
