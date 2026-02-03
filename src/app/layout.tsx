import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CloudForge",
  description: "Twitter OAuth + Stripe Identity verification",
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
