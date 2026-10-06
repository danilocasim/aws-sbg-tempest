// Self-hosted fonts via next/font (design-system.md §3). Apply `fontClassName` to <html>.
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", weight: ["600", "700"] });
export const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400"] });

export const fontClassName = `${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;
