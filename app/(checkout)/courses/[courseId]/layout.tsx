import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CourseNavbar } from "@/components/course-navbar/course-navbar";
import Navbar from "@/components/navbar/navbar";

const CheckOutLayout = async ({
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
        return redirect("/login");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
    });

    if (!course) {
        return redirect("/courses");
    }


    return (
        <div className="h-full">
            <div className="h-[80px] fixed inset-y-0 w-full z-50">
                <Navbar isTeacher={false} />
            </div>
            <main className="pt-[80px] h-full">
                {children}
            </main>
        </div>
    )
}

export default CheckOutLayout;