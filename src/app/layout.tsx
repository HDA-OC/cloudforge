import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sydian",
  description: "Where serious agents access verified knowledge. Trust infrastructure for AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
