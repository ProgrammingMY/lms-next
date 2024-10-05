"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ISidebarItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

export const SidebarItem = ({
    href,
    icon: Icon,
    label,
}: ISidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const onClick = () => {
        router.push(href);
    }

    const isActive = (pathname === "/" && href === "/") ||
        pathname.startsWith(`${href}/`) ||
        pathname === href;

    return (
        <Button
            onClick={onClick}
            variant={isActive ? "default" : "ghost"}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon size={24} />
                {label}
            </div>

            <div className={
                cn("ml-auto opacity-0 border-2 h-full transition-all", isActive && "opacity-100")
            }>

            </div>

        </Button>
    )
}