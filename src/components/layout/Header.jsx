"use client";

import { useSidebar } from "@/lib/sidebar";
import { ArrowLeftFromLine, ArrowRightFromLine, Menu } from "lucide-react";

export default function Header({ title }) {
    const sidebar = useSidebar()

    const SidebarIcon = sidebar.isOpen ? ArrowLeftFromLine : ArrowRightFromLine

    return (
        <div className="sticky top-0 z-999 h-14 p-4 border-b border-slate-300 bg-white w-full flex-1">
            <h3 className="scroll-m-20 text-lg font-semibold tracking-tight flex items-center">
                {title}
                {/* <SidebarIcon
                    className="ml-auto h-6 w-6"
                    role="button"
                    onClick={sidebar.toggleSidebar}
                /> */}
            </h3>
        </div>
    );
}