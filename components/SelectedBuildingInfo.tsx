"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useBuilding } from "@/context/BuildingContext";

type BuildingDetails = {
  id: string;
  name: string;
  address: string | null;
  year_built: number | null;
  apartment_count: number | null;
  area_m2: number | null;
  heating_type: string | null;
};

export default function SelectedBuildingInfo() {
  const { selectedBuildingId, selectedBuilding } = useBuilding();

  const [building, setBuilding] = useState<BuildingDetails | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBuilding() {
      if (!selectedBuildingId) {
        return null;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("buildings")
        .select(
          "id, name, address, year_built, apartment_count, area_m2, heating_type",
        )
        .eq("id", selectedBuildingId)
        .single();

      setLoading(false);

      if (error) {
        console.error("Taloyhtiön tietojen haku epäonnistui:", error);

        return null;
      }

      return data;
    }

    fetchBuilding().then((data) => {
      setBuilding(data);
    });
  }, [selectedBuildingId]);

  return (
    <div className="rounded-2xl bg-zinc-900 p-6">
      <h3 className="mb-4 text-xl font-semibold">Taloyhtiön tiedot</h3>

      {!selectedBuildingId ? (
        <p className="text-zinc-400">Valitse taloyhtiö.</p>
      ) : loading ? (
        <p className="text-zinc-400">Ladataan taloyhtiön tietoja...</p>
      ) : building ? (
        <div className="space-y-2 text-zinc-300">
          <p>
            <span className="font-medium text-white">Nimi:</span>{" "}
            {building.name}
          </p>

          <p>
            <span className="font-medium text-white">Osoite:</span>{" "}
            {building.address || "-"}
          </p>

          <p>
            <span className="font-medium text-white">Rakennusvuosi:</span>{" "}
            {building.year_built || "-"}
          </p>

          <p>
            <span className="font-medium text-white">Asuntoja:</span>{" "}
            {building.apartment_count || "-"}
          </p>

          <p>
            <span className="font-medium text-white">Pinta-ala:</span>{" "}
            {building.area_m2 ? `${building.area_m2} m²` : "-"}
          </p>

          <p>
            <span className="font-medium text-white">Lämmitys:</span>{" "}
            {building.heating_type || "-"}
          </p>
        </div>
      ) : (
        <p className="text-zinc-400">
          {selectedBuilding
            ? `${selectedBuilding.name} - tietoja ei löytynyt.`
            : "Taloyhtiön tietoja ei löytynyt."}
        </p>
      )}
    </div>
  );
}
