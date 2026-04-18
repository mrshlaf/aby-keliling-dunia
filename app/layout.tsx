import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/session";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ABY Trip – Savings Tracker",
  description: "Luxury transparency for the Lampung Trip 2026",
  manifest: "/manifest.json",
  themeColor: "#7c3aed",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ABY Trip",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <HeaderWrapper />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border/40 bg-muted/30 py-12">
            <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row mx-auto px-6">
              <p className="text-center text-sm font-medium text-muted-foreground md:text-left">
                © 2026 ABY Lampung Trip. Designed for luxury transparency.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

// Separate component to handle the async session fetch in the layout
async function HeaderWrapper() {
  const session = await getSession();
  return <Navbar session={session} />;
}
