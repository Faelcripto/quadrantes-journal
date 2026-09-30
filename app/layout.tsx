import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quadrantes Journal",
  description: "Seu processo, suas operações, sua evolução. Diário de trading do Método dos Quadrantes.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
