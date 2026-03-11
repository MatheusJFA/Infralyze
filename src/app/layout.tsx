import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infralyzer - Infrastructure Sizing & Cost Prediction",
  description: "Transform business metrics into cloud infrastructure requirements.",
};

import { I18nProvider } from "@/lib/i18n/I18nContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <I18nProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="w-full py-6 px-4 md:px-8 border-t border-primary/20 bg-black/50 backdrop-blur-sm">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                <span>© 2024 INFRALYZER - VERSION 1.0.0</span>
                <a 
                  href="https://github.com/matheusjfa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="text-primary">{'>'}</span> DEVELOPED BY MATHEUSJFA
                </a>
              </div>
            </footer>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
