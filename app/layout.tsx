import "./globals.css";

import { BuildingProvider } from "@/context/BuildingContext";

export const metadata = {
  title: "House Data Oy",
  description: "Taloyhtiön hallintajärjestelmä",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body>
        <BuildingProvider>{children}</BuildingProvider>
      </body>
    </html>
  );
}
