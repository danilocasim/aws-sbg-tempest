import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Pointer from "@/components/Pointer";
import { ToastProvider } from "@/components/Toast";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
export const metadata: Metadata = { title: { default: "Tempest · AWS Student Builder Group", template: "%s · Tempest" }, description: "A student-led AWS builder community at PLMUN. Build, learn, and grow with Tempest." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}><body><ToastProvider><Pointer />{children}</ToastProvider></body></html>);
}
