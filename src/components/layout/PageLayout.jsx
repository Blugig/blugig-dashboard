"use client";

import { useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar";

export default function Pagelayout({ 
    title, 
    showDetailsTab=false,
    tabContents={},
    className, 
    children 
}) {
    
    const sidebar = useSidebar()
    
    const tabs = useMemo(() => Object.keys(tabContents), [tabContents]);
    const [currentTab, setCurrentTab] = useState(tabs.length > 0 ? tabs[0] : null);

    return (
        <>
            <div className="relative w-full flex flex-col overflow-y-auto overflow-x-hidden">
                <Header title={title} />

                <ScrollArea orientation="vertical">
                    <div className={`mx-auto max-w-screen-2xl p-4 md:p-4 2xl:p-6 flex min-h-screen flex-col ${className}`}>
                        {children}
                    </div>
                </ScrollArea>
            </div>
            {showDetailsTab && tabs.length > 0 ? (
                <div className={cn('w-[36%]', sidebar.isOpen ? "hidden" : "block")}>
                    <div className="header-tabs flex justify-center items-start border-l border-slate-300">
                        {tabs.map((tab, i) => (
                            <div 
                                key={i}
                                className={`
                                    sticky top-0 z-999 h-14 p-4 border-b bg-white w-full flex-1
                                    ${currentTab === tab ? "border-slate-900 border-b-4" : "border-slate-300"}
                                `}
                                role="button"
                                onClick={() => setCurrentTab(tab)}
                            >
                                <h3 className={`scroll-m-20 text-lg font-semibold tracking-tight flex items-center justify-center`}>
                                    {tab}
                                </h3>
                            </div>                    
                        ))}
                    </div>
                    <ScrollArea orientation="vertical">
                        <div className="border-l border-slate-300 min-h-screen p-4">
                            {tabContents[currentTab]}
                        </div>
                    </ScrollArea>
                </div>
            ) : (null)}
        </>
    )
}