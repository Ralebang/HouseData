"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type OpenFaultsCountProps = {
  buildingId: string;
};

export default function OpenFaultsCount({ buildingId }: OpenFaultsCountProps) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOpenFaultsCount() {
      if (!buildingId) {
        setCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { count, error } = await supabase
        .from("faults")
        .select("*", { count: "exact", head: true })
        .eq("building_id", buildingId)
        .neq("status", "Korjattu");

      if (error) {
        console.error("Vikailmoitusten määrän haku epäonnistui:", error);
        setLoading(false);
        return;
      }

      setCount(count || 0);
      setLoading(false);
    }

    fetchOpenFaultsCount();
  }, [buildingId]);

  return (
    <Link
      href="/faults"
      className="rounded-2xl bg-zinc-900 p-6 transition-colors hover:bg-zinc-800"
    >
      <h3 className="mb-2 text-lg font-semibold">Vikailmoitukset</h3>

      <p className="text-3xl font-bold">{loading ? "..." : count}</p>
    </Link>
  );
}
