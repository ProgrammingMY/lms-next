import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

const CourseLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode
    params: {
        courseId: string
    };
}) => {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId: user.id,
                        }
                    }
                },
                orderBy: {
                    position: "asc",
                }
            },
        },
    });

    if (!course) {
        return redirect("/");
    }

    const progressCount = await getProgress(user.id, course.id);


    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 w-full fixed inset-y-0 z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />

            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}

            </main>
        </div>
    )
}

export default CourseLayout;