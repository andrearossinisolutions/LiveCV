import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LiveCV",
  description: "Curriculum pubblico con dashboard privata e pagina condivisibile."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
