import type { Metadata } from "next";

import { neueHaasUnica, warnockPro } from "../styles/fonts";
import "../styles/theme.css";

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
        {children} 
      </body> 
    </html>
  );
}
