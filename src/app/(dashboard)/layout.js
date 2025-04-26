// "use client";

import { Poppins } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/layout/SideBar";
import { SidebarProvider } from "@/lib/sidebar";

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({ children }) {

  return (
    <main className="flex h-screen overflow-hidden">
      <SidebarProvider>
        <SideBar />

        {children}
      </SidebarProvider>
    </main>
  );
}
