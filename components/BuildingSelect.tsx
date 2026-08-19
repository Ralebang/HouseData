"use client";

import { useBuilding } from "@/context/BuildingContext";

export default function BuildingSelect() {
  const { buildings, selectedBuildingId, setSelectedBuildingId } =
    useBuilding();

  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">Taloyhtiö</label>

      <select
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
        value={selectedBuildingId}
        onChange={(event) => setSelectedBuildingId(event.target.value)}
      >
        <option value="">Valitse taloyhtiö</option>

        {buildings.map((building) => (
          <option key={building.id} value={building.id}>
            {building.name}
          </option>
        ))}
      </select>
    </div>
  );
}
