import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ResponsiveHeader from "@/components/ResponsiveHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poker dos Cria",
  description: "Sistema de gerenciamento de torneios de poker",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="no-scrollbar">
      <head>
        {/* Meta tag para evitar que a tela apague em dispositivos móveis */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* Para manter a tela ligada em navegadores modernos */}
        <meta
          httpEquiv="origin-trial"
          content="AAAASAMBoAUAAABMigEGDJFNAwIAAABQN0ICKERuUNwYxZx6HHvrjQUKgEBOGo5RFn2N0rMkv/7dLOhWQkpBIqzN2Sqws5SCR6wG1UfxsZTNKomPCyHOugDBmXIwVUmMlqE1MwJm+A=="
        />
        {/* Adicionar FontAwesome para ícones */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} touch-manipulation`}>
        <div className="min-h-screen bg-gray-100">
          <ResponsiveHeader />
          <main className="container mx-auto py-6 px-4">{children}</main>
          <footer className="bg-blue-800 text-white p-4 mt-auto">
            <div className="container mx-auto text-center">
              <p>&copy; {new Date().getFullYear()} Poker dos Cria</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
