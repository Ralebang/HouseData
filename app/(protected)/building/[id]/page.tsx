import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default async function BuildingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: building, error } = await supabase
    .from("buildings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !building) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Taloyhtiötä ei löytynyt</h1>
          <p className="text-zinc-400">
            Tarkista linkki tai Supabase-haku. Virhe: {error?.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{building.name}</h1>
            <p className="text-zinc-400 mb-8">{building.address}</p>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 p-5 rounded-2xl">
                <p className="text-zinc-400 text-sm">Rakennusvuosi</p>
                <p className="text-2xl font-bold">{building.year_built}</p>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl">
                <p className="text-zinc-400 text-sm">Asuntoja</p>
                <p className="text-2xl font-bold">{building.apartment_count}</p>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl">
                <p className="text-zinc-400 text-sm">Pinta-ala</p>
                <p className="text-2xl font-bold">{building.area_m2} m²</p>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl">
                <p className="text-zinc-400 text-sm">Lämmitys</p>
                <p className="text-2xl font-bold">{building.heating_type}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
