import type { Metadata } from "next";
import { Poppins, Oswald, Cormorant_Garamond, Tenor_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const oswald = Oswald({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-oswald" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant" });
const hero = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-hero" });

export const metadata: Metadata = {
  title: "Timmy Pramudyo | Executive Chef & F&B Consultant",
  description:
    "Executive Chef, Corporate Chef and F&B Business Consultant based in Bali. Private chef experiences and culinary consulting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${oswald.variable} ${cormorant.variable} ${hero.variable}`}>
      <body>{children}</body>
    </html>
  );
}