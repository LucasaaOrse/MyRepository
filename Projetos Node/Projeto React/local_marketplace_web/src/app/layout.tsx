import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "LocalMarketplace",
  description: "Seu mercado local na mão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
