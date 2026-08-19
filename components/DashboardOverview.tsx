"use client";

import BuildingSelect from "@/components/BuildingSelect";
import OpenTasksCount from "@/components/OpenTasksCount";
import OpenFaultsCount from "@/components/OpenFaultsCount";
import OpenMaintenanceCount from "@/components/OpenMaintenanceCount";

import { useBuilding } from "@/context/BuildingContext";

export default function DashboardOverview() {
  const { selectedBuildingId } = useBuilding();

  return (
    <section className="mb-8 w-full">
      {/* Taloyhtiön valinta */}
      <div className="mb-6">
        <BuildingSelect />
      </div>

      {/* Dashboardin yhteenvetokortit */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <OpenTasksCount buildingId={selectedBuildingId} />

        <OpenFaultsCount buildingId={selectedBuildingId} />

        <OpenMaintenanceCount buildingId={selectedBuildingId} />
      </div>
    </section>
  );
}
