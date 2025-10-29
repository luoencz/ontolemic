import type { Metadata } from "next";

import { neueHaasUnica, warnockPro } from "../styles/fonts/fonts";
import "../styles/theme.css";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Ontolemic",
  description: "Ontolemic by Theo Ryzhenkov",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${neueHaasUnica.variable} ${warnockPro.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/svgs/analemma.svg" />
      </head>
      <body>
        <Navbar />
        {children} 
      </body> 
    </html>
  );
}
