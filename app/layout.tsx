import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Midzo API",
  description: "Backend API for Midzo travel companion application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
