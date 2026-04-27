import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birth Certificate Digitalization Application System",
  description: "Bagula 2 No Gram Panchayat"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
