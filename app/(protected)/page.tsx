import Sidebar from "@/components/Sidebar";
import DashboardOverview from "@/components/DashboardOverview";
import SelectedBuildingInfo from "@/components/SelectedBuildingInfo";
import AISummaryCard from "@/components/AISummaryCard";
import RecentActivity from "@/components/RecentActivity";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Sivupalkki */}
        <Sidebar />

        {/* Sivun sisältö */}
        <section className="flex-1 p-6 md:p-10">
          <div className="mx-auto w-full max-w-6xl">
            {/* =========================
                SIVUN OTSIKKO
            ========================= */}

            <div className="mb-10">
              <h1 className="mb-2 text-4xl font-bold">
                Taloyhtiön Tieto Pankki
              </h1>

              <p className="text-zinc-400">
                Hallituksen päätöksenteon, dokumenttien ja kunnossapidon näkymä
                yhdessä paikassa.
              </p>
            </div>

            {/* =========================
                TALOYHTIÖN VALINTA +
                DASHBOARD-KORTIT
            ========================= */}

            <DashboardOverview />

            {/* =========================
                AJANKOHTAISTA
            ========================= */}

            <RecentActivity />

            {/* =========================
                TALOYHTIÖN TIEDOT +
                AI-YHTEENVETO
            ========================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Valitun taloyhtiön tiedot */}
              <SelectedBuildingInfo />

              {/* AI-yhteenveto */}
              <AISummaryCard />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
