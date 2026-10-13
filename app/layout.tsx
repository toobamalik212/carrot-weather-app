import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Effects } from "./components/icons/Effects";
import { cn } from "@/lib/utils";
import { TemperatureToggle } from "./components/TemperatureToggle";
import { TemperatureUnitProvider } from "./components/TemperatureUnitProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weather App",
  description: "Check the weather for cities around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body
        className={`${inter.variable} antialiased bg-linear-to-b from-slate-900 to-slate-950 text-foreground`}
      >
        <TemperatureUnitProvider>
          <Effects />
          <header className="fixed top-0 left-0 w-full z-10">
            <div className="max-w-xl mx-auto py-8 px-6">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-base font-semibold text-muted-foreground text-shadow-sm">
                  <Link href="/">Weather</Link>
                </h1>
                <TemperatureToggle />
              </div>
            </div>
          </header>
          <main className="min-h-screen">{children}</main>
        </TemperatureUnitProvider>
      </body>
    </html>
  );
}