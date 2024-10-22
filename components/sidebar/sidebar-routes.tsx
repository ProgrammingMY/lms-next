"use client";

import { BarChart, Home, List, Search } from 'lucide-react';
import React from 'react'
import { SidebarItem } from './sidebar-item';
import { usePathname } from 'next/navigation';

const guestRoutes = [
    {
        href: "/",
        label: "Dashboard",
        icon: Home,
    },
    {
        href: "/search",
        label: "Search",
        icon: Search,
    }
]
const teacherRoutes = [
    {
        href: "/teacher/courses",
        label: "Courses",
        icon: List,
    },
    {
        href: "/teacher/analytics",
        label: "Analytics",
        icon: BarChart,
    }
]

function SidebarRoutes() {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes('/teacher');

    const Routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className='flex flex-col w-full'>
            {Routes.map((route) => {
                return (
                    <SidebarItem
                        key={route.href}
                        href={route.href}
                        icon={route.icon}
                        label={route.label}
                    />
                )
            })}

        </div>
    )
}

export default SidebarRoutes

