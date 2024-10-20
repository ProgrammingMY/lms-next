import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: user.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new Response(JSON.stringify({ message: "Course not found" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return new NextResponse(JSON.stringify(deletedCourse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[COURSE ID DELETE]", error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

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

export async function GET(req: Request) {
  try {
    const data = req.url;

    console.log(data);
  } catch (error) {
    console.log("[COURSE ID]", error);
  }
}
