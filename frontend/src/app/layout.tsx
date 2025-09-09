import type { Metadata } from "next";

import AppClientLayout from "./client-layout";
import "../styles/theme.css";

export const metadata: Metadata = {
  title: "Inner Cosmos",
  description: "Inner Cosmos by Theo Ryzhenkov",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}
