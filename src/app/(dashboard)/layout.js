"use client";

import { Poppins } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/layout/SideBar";
import { SidebarProvider } from "@/lib/sidebar";
import useProfileStore from "@/store/session.store";
import { useEffect } from "react";


export default function RootLayout({ children }) {

  const { profile, refreshProfile } = useProfileStore();

  useEffect(() => {
    (async () => {
      if (profile) return;
      await refreshProfile();
    })();
  }, [])

  return (
    <main className="flex h-screen overflow-hidden">
      <SidebarProvider>
        <SideBar />

        {children}
      </SidebarProvider>
    </main>
  );
}
