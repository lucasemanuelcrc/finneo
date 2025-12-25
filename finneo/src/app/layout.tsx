import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // Importar o Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finneo App",
  description: "Gestão Financeira Inteligente",
  manifest: "/manifest.json", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        {/* Adicione o componente aqui. richColors ativa as cores de sucesso/erro */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}