import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontClassName } from "@tempest/ui/fonts";
import { ToastProvider } from "@tempest/ui";
import "./globals.css";

const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: "Tempest · AWS Student Builder Group", template: "%s · Tempest" },
  description: "A student-led AWS builder community at PLMUN. Build, learn, and grow with Tempest.",
  icons: {
    icon: [{ url: "/brand/favicon.ico", sizes: "any" }, { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" }, { url: "/brand/icon-512.png", type: "image/png", sizes: "512x512" }],
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/brand/site.webmanifest",
};

export const viewport: Viewport = { themeColor: "#040615", colorScheme: "dark" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
