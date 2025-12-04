"use client"

import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BookmarkCheck,
    LogOut, Users, Menu,
    User,
    CircleDollarSign,
    LayoutDashboard,
    Briefcase,
    UserCheck,
    ListChecks,
    BadgeCheck,
    Clock,
    BarChart3,
    CalendarCheck2,
    Users2,
    UserCog
} from 'lucide-react';
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { getRoutes, logout } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { Puzzle } from "lucide-react";
import { Settings } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Star } from "lucide-react";
import useProfileStore from "@/store/session.store";

const sideBarRoutes = [
    {
        title: "Main",
        routes: [
            { title: "My Profile", url: "/", icon: User, permission: "ALL" },
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, permission: "SUPER" },
            { title: "Customers", url: "/dashboard/users", icon: Users, permission: "SUPER" },
            { title: "Freelancers", url: "/dashboard/freelancers", icon: UserCheck, permission: "SUPER" },
            { title: "Job Pool", url: "/dashboard/jobs", icon: Briefcase, permission: "SUPER" },
            { title: "Earning Withdrawals", url: "/dashboard/earnings", icon: CircleDollarSign, permission: "SUPER" },
        ],
    },
    {
        title: "Jobs", // for freelancer only
        routes: [
            { title: "All Jobs", url: "/jobs", icon: ListChecks, permission: "FREELANCER" },
            { title: "My Awarded Jobs", url: "/jobs/awarded", icon: BadgeCheck, permission: "FREELANCER" },
            { title: "My Pending Jobs", url: "/jobs/pending", icon: Clock, permission: "FREELANCER" },
        ],
    },
    {
        title: "Forms",
        routes: [
            { title: "Solution Implementation", url: "/forms/solution", icon: Puzzle, permission: "SOL" },
            { title: "API Integration", url: "/forms/api", icon: Settings, permission: "API" },
            { title: "Hire Smartsheet Expert", url: "/forms/experts", icon: BookmarkCheck, permission: "EXP" },
            { title: "System Admin Support", url: "/forms/admin", icon: ShieldCheck, permission: "ADM" },
            { title: "Adhoc Request", url: "/forms/adhoc", icon: BarChart3, permission: "ADH" },
            { title: "Premium App Support", url: "/forms/premium", icon: Star, permission: "PRM" },
            { title: "Book One on One", url: "/forms/one-on-one", icon: CalendarCheck2, permission: "ONE" },
            { title: "PMO Control Center", url: "/forms/pmo", icon: Puzzle, permission: "PMO" },
            { title: "License Request", url: "/forms/license", icon: ShieldCheck, permission: "LIR" },
        ],
    },
    {
        title: "Management",
        routes: [
            { title: "Admin Users", url: "/management/permissions", icon: Users2, permission: "SUPER" },
            { title: "User Dashboard Access", url: "/management/admin", icon: UserCog, permission: "SUPER" },
        ],
    },
];

const SidebarSkeleton = React.memo(() => {
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* Main section skeleton */}
            <div className="mb-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>

            {/* Forms section skeleton */}
            <div className="mb-6">
                <Skeleton className="h-4 w-12 mb-2" />
                <div className="space-y-2">
                    {Array(9).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Management section skeleton */}
            <div className="mb-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="space-y-2">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout button skeleton */}
            <Skeleton className="w-full h-10 my-4 rounded-md" />
        </nav>
    )
})

const RenderSidebarRoute = React.memo(({ subRoute, pathname, setIsMobileMenuOpen, routeTitle }) => {
    return (
        <div key={subRoute.title}>
            <Link
                href={subRoute.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-slate-200',
                    (() => {
                        // Exact match for home page
                        if (subRoute.url === '/' && pathname === '/') {
                            return 'bg-slate-300';
                        }
                        // Exact match for dashboard page
                        if (subRoute.url === '/dashboard' && pathname === '/dashboard') {
                            return 'bg-slate-300';
                        }
                        // For Jobs routes, only highlight exact match
                        if (routeTitle === 'Jobs') {
                            if (pathname === subRoute.url) {
                                return 'bg-slate-300';
                            }
                            return '';
                        }
                        // For other routes, check if pathname starts with the route URL and it's not the root
                        if (subRoute.url !== '/' && subRoute.url !== '/dashboard' && pathname.startsWith(subRoute.url)) {
                            return 'bg-slate-300';
                        }
                        return '';
                    })()
                )}
            >
                <subRoute.icon className="h-4 w-4" />
                {subRoute.title}
            </Link>
        </div>
    )
});

export default function SideBar() {
    const pathname = usePathname()
    const [permissions, setPermissions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { profile } = useProfileStore();

    useEffect(() => {
        async function defineSidebarRoutes() {
            try {
                setIsLoading(true)
                const res = await getRoutes()
                setPermissions(res)
            } catch (error) {
                console.error('Error fetching routes:', error)
            } finally {
                setIsLoading(false)
            }
        }
        defineSidebarRoutes()
    }, [])

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
                        {isLoading ? (
                            <>
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="ml-2 h-4 w-24" />
                            </>
                        ) : (
                            <>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={profile?.profile_photo} />
                                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="ml-2 font-semibold">{profile?.name}</span>
                            </>
                        )}
                    </div>
                    <ScrollArea className="w-full flex-1" orientation="vertical">
                        {isLoading ? (
                            <SidebarSkeleton />
                        ) : (
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                {sideBarRoutes.map((route, i) => {
                                    const filteredSubRoutes = route.routes.filter(subRoute => {
                                        // Hide Jobs section routes from SUPER users
                                        if (route.title === "Jobs" && permissions.includes("SUPER")) {
                                            return false;
                                        }
                                        return permissions.includes(subRoute.permission) || subRoute.permission === "ALL";
                                    });

                                    if (filteredSubRoutes.length > 0) {
                                        return (
                                            <div className="mb-6" key={i}>
                                                <p className="text-[1rem] mb-2 text-gray-500">{route.title}</p>
                                                {filteredSubRoutes.map(subRoute => <RenderSidebarRoute key={subRoute.url} subRoute={subRoute} pathname={pathname} setIsMobileMenuOpen={setIsMobileMenuOpen} routeTitle={route.title} />)}
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
                        )}
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
