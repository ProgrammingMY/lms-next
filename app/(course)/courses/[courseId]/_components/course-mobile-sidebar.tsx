
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";

interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    };
    progressCount: number;
};

export const CourseMobileSidebar = ({
    course,
    progressCount,
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu size={32} />
            </SheetTrigger>
            <SheetContent side={"left"} className="p-0 bg-white w-72">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    )
}
