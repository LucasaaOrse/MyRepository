// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata = {
    title: "Email100",
    description: "Envie e-mails de forma segura via API",
};
export default function RootLayout({ children, }) {
    return (<html lang="pt-BR">
      <body className={cn("bg-background text-foreground", inter.className)}>
        {children}
      </body>
    </html>);
}
