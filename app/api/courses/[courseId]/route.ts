import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { courseId } = params;
    const values = await req.json();

    if (values.imageUrl) {
      values.imageUrl = values.imageUrl.split("/").pop().split("?")[0];
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: user.id,
      },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE ID]", error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
