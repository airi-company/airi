import "./globals.css";
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
