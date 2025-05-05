"use client"

import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BookmarkCheck, CircleAlert, HandCoins,
    LineChart, LogOut, NotepadText, UserCog2, Users, Menu
} from 'lucide-react';
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { getRoutes, logout } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useSidebar } from "@/lib/sidebar";
import { Puzzle } from "lucide-react";
import { Settings } from "lucide-react";
import { BarChart } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Star } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import useProfileStore from "@/store/session.store";

export default function SideBar() {
    const pathname = usePathname()
    const [permissions, setPermissions] = useState([])
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { profile } = useProfileStore();

    useEffect(() => {
        async function defineSidebarRoutes() {
            const res = await getRoutes()
            setPermissions(res)
        }
        defineSidebarRoutes()
    }, [])

    const sideBarRoutes = [
        {
            title: "Main",
            routes: [
                { title: "Dashboard", url: "/", icon: LineChart, permission: "SUPER"  },
                { title: "Customers", url: "/dashboard/users", icon: Users, permission: "SUPER" },
            ],
        },
        {
            title: "Forms",
            routes: [
                { title: "Solution Implementation", url: "/forms/solution", icon: Puzzle, permission: "SOL" },
                { title: "API Integration", url: "/forms/api", icon: Settings, permission: "API" },
                { title: "Hire Smartsheet Expert", url: "/forms/experts", icon: BookmarkCheck, permission: "EXP" },
                { title: "System Admin Support", url: "/forms/admin", icon: ShieldCheck, permission: "ADM" },
                { title: "Reports Dashboard", url: "/forms/reports", icon: BarChart, permission: "REP" },
                { title: "Premium App Support", url: "/forms/premium", icon: Star, permission: "PRM" },
                { title: "Book One on One", url: "/forms/one-on-one", icon: CalendarCheck, permission: "ONE" },
                { title: "PMO Control Center", url: "/forms/pmo", icon: Puzzle, permission: "PMO" },
                { title: "License Request", url: "/forms/license", icon: ShieldCheck, permission: "LIR" },
            ],
        },
        {
            title: "Management",
            routes: [
                { title: "Admin Users", url: "/management/permissions", icon: HandCoins, permission: "SUPER" },
                { title: "User Dashboard Access", url: "/management/admin", icon: UserCog2, permission: "SUPER" }
            ],
        },
    ];

    return (
        <>
            <button 
                className="fixed top-4 right-4 z-50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="h-6 w-6" />
            </button>

            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-slate-300",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:relative lg:translate-x-0"
                )}
            >
                <div className="flex h-full flex-col gap-2">
                    <div className="h-14 flex items-center border-b border-slate-300 p-4 mb-4 cursor-pointer">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>DL</AvatarFallback>
                        </Avatar>
                        <span className="ml-2 font-semibold">{profile?.name}</span>
                    </div>
                    <ScrollArea className="w-full flex-1" orientation="vertical">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {sideBarRoutes.map((route, i) => {
                                const filteredSubRoutes = route.routes.filter(subRoute =>
                                    permissions.includes(subRoute.permission)
                                );

                                if (filteredSubRoutes.length > 0) {
                                    return (
                                        <div className="mb-6" key={i}>
                                            <p className="text-[1rem] mb-2 text-gray-500">{route.title}</p>
                                            {filteredSubRoutes.map(subRoute => (
                                                <div key={subRoute.title}>
                                                    <Link
                                                        href={subRoute.url}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={cn(
                                                            'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-slate-200',
                                                            pathname.startsWith(subRoute.url) && subRoute.url != '/' ? 'bg-slate-300' : '',
                                                            pathname.includes(subRoute.permission) ? 'bg-slate-300' : '',
                                                            subRoute.url === '/' && pathname === '/' ? 'bg-slate-300' : ''
                                                        )}
                                                    >
                                                        <subRoute.icon className="h-4 w-4" />
                                                        {subRoute.title}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            <Button className="w-full my-4 px-8 mt-auto" onClick={async () => {
                                await logout()
                                window.location.href = '/login'
                            }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </nav>
                    </ScrollArea>
                </div>
            </aside>
            
            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
