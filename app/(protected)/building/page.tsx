import Sidebar from "@/components/Sidebar";

export default function BuildingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Taloyhtiön tiedot</h1>

            <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
              <p>
                <span className="text-white font-medium">Nimi:</span> As Oy
                Mäntypolku 12
              </p>
              <p>
                <span className="text-white font-medium">Osoite:</span>{" "}
                Mäntypolku 12, Helsinki
              </p>
              <p>
                <span className="text-white font-medium">Rakennusvuosi:</span>{" "}
                1987
              </p>
              <p>
                <span className="text-white font-medium">Asuntoja:</span> 36
              </p>
              <p>
                <span className="text-white font-medium">Pinta-ala:</span> 2480
                m²
              </p>
              <p>
                <span className="text-white font-medium">Lämmitys:</span>{" "}
                Kaukolämpö
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
