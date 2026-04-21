import "./globals.css";

export const metadata = {
  title: "Taloyhtiö Dashboard",
  description: "Taloyhtiön hallintajärjestelmä",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
