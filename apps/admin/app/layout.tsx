import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontClassName } from "@tempest/ui/fonts";
import { ToastProvider } from "@tempest/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tempest admin", template: "%s · Tempest admin" },
  robots: { index: false, follow: false },
  icons: { icon: "/brand/favicon.ico" },
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
