"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function NewBuildingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [apartmentCount, setApartmentCount] = useState("");
  const [areaM2, setAreaM2] = useState("");
  const [heatingType, setHeatingType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("buildings").insert([
      {
        name,
        address,
        year_built: yearBuilt ? Number(yearBuilt) : null,
        apartment_count: apartmentCount ? Number(apartmentCount) : null,
        area_m2: areaM2 ? Number(areaM2) : null,
        heating_type: heatingType,
      },
    ]);

    if (error) {
      setMessage(`Virhe: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage("Taloyhtiö lisätty onnistuneesti.");

    setName("");
    setAddress("");
    setYearBuilt("");
    setApartmentCount("");
    setAreaM2("");
    setHeatingType("");
    setLoading(false);

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Lisää taloyhtiö</h1>

            <form
              onSubmit={handleSubmit}
              className="bg-zinc-900 rounded-2xl p-6 space-y-5"
            >
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Taloyhtiön nimi
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As Oy Mäntypolku 12"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Osoite
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mäntypolku 12, Helsinki"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Rakennusvuosi
                  </label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    placeholder="1987"
                    className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Asuntojen määrä
                  </label>
                  <input
                    type="number"
                    value={apartmentCount}
                    onChange={(e) => setApartmentCount(e.target.value)}
                    placeholder="36"
                    className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Pinta-ala m²
                  </label>
                  <input
                    type="number"
                    value={areaM2}
                    onChange={(e) => setAreaM2(e.target.value)}
                    placeholder="2480"
                    className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Lämmitysmuoto
                </label>
                <input
                  type="text"
                  value={heatingType}
                  onChange={(e) => setHeatingType(e.target.value)}
                  placeholder="Kaukolämpö"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                />
              </div>

              {message && (
                <div className="rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-white text-black px-5 py-3 font-medium disabled:opacity-50"
              >
                {loading ? "Tallennetaan..." : "Tallenna taloyhtiö"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
