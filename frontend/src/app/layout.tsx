import type { Metadata } from "next";

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
    <html lang="en">
      <body>
        {children} 
      </body> 
    </html>
  );
}
