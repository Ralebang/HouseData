"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

type Building = {
  id: string;
  name: string;
};

type BuildingContextType = {
  buildings: Building[];
  selectedBuildingId: string;
  setSelectedBuildingId: (id: string) => void;
  selectedBuilding: Building | null;
};

const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined,
);

export function BuildingProvider({ children }: { children: ReactNode }) {
  // Kaikki taloyhtiöt
  const [buildings, setBuildings] = useState<Building[]>([]);

  // Käyttäjän valitseman taloyhtiön ID
  const [selectedBuildingId, setSelectedBuildingId] = useState("");

  // =========================
  // HAE TALOYHTIÖT
  // =========================
  useEffect(() => {
    async function fetchBuildings() {
      const { data, error } = await supabase
        .from("buildings")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Taloyhtiöiden hakeminen epäonnistui:", error);
        return;
      }

      const buildingList = data || [];

      setBuildings(buildingList);

      // Jos mitään ei ole vielä valittu,
      // valitaan automaattisesti ensimmäinen taloyhtiö.
      if (buildingList.length > 0) {
        setSelectedBuildingId((currentId) => {
          if (currentId) return currentId;

          const savedBuildingId =
            window.localStorage.getItem("selectedBuildingId");

          if (
            savedBuildingId &&
            buildingList.some((building) => building.id === savedBuildingId)
          ) {
            return savedBuildingId;
          }

          return buildingList[0].id;
        });
      }
    }

    fetchBuildings();
  }, []);

  // =========================
  // TALLENNA VALINTA SELAIMEEN
  // =========================
  useEffect(() => {
    if (!selectedBuildingId) return;

    window.localStorage.setItem("selectedBuildingId", selectedBuildingId);
  }, [selectedBuildingId]);

  // Haetaan valitun ID:n perusteella myös taloyhtiön nimi.
  const selectedBuilding =
    buildings.find((building) => building.id === selectedBuildingId) || null;

  return (
    <BuildingContext.Provider
      value={{
        buildings,
        selectedBuildingId,
        setSelectedBuildingId,
        selectedBuilding,
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
}

// Hook, jolla muut komponentit saavat taloyhtiön käyttöönsä.
export function useBuilding() {
  const context = useContext(BuildingContext);

  if (!context) {
    throw new Error("useBuilding must be used inside BuildingProvider");
  }

  return context;
}
