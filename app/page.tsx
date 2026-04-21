import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: buildings, error } = await supabase
    .from("buildings")
    .select("*");

  const building = buildings?.[0];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-4xl font-bold mb-2">Taloyhtiö Dashboard</h2>
              <p className="text-zinc-400">
                Hallituksen päätöksenteon, dokumenttien ja kunnossapidon näkymä
                yhdessä paikassa.
              </p>
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-200 rounded-2xl p-4 mb-6">
                Virhe datan haussa: {error.message}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Avoimet tehtävät</h3>
                <p className="text-3xl font-bold">6</p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Vikailmoitukset</h3>
                <p className="text-3xl font-bold">3</p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Tulevat remontit</h3>
                <p className="text-3xl font-bold">2</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  Taloyhtiön tiedot
                </h3>

                {building ? (
                  <div className="space-y-2 text-zinc-300">
                    <p>
                      <span className="text-white font-medium">Nimi:</span>{" "}
                      {building.name}
                    </p>
                    <p>
                      <span className="text-white font-medium">Osoite:</span>{" "}
                      {building.address}
                    </p>
                    <p>
                      <span className="text-white font-medium">
                        Rakennusvuosi:
                      </span>{" "}
                      {building.year_built}
                    </p>
                    <p>
                      <span className="text-white font-medium">Asuntoja:</span>{" "}
                      {building.apartment_count}
                    </p>
                    <p>
                      <span className="text-white font-medium">Pinta-ala:</span>{" "}
                      {building.area_m2} m²
                    </p>
                    <p>
                      <span className="text-white font-medium">Lämmitys:</span>{" "}
                      {building.heating_type}
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-400">
                    Taloyhtiön tietoja ei löytynyt.
                  </p>
                )}
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">AI-yhteenveto</h3>
                <p className="text-zinc-300 leading-7">
                  Taloyhtiön suurin lähivuosien riski liittyy putkiston ikään.
                  Seuraavan 12 kuukauden aikana kannattaa valmistella
                  kuntokartoitus ja kilpailuttaa tarvittavat tarkastukset.
                  Avoimet vikailmoitukset viittaavat myös ilmanvaihdon
                  tarkempaan seurantaan.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl mt-6">
              <h3 className="text-xl font-semibold mb-4">Kaikki taloyhtiöt</h3>

              <div className="space-y-3">
                {buildings?.map((item) => (
                  <div key={item.id} className="bg-zinc-800 rounded-xl p-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-zinc-400">{item.address}</p>
                    <p className="text-zinc-500 text-sm">
                      {item.apartment_count} asuntoa · {item.heating_type}
                    </p>
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
