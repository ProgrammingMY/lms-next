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
  { params }: { params: { courseId: string; chapterId: string } }
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

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return new Response(
        JSON.stringify({ message: "Unauthorized access to this course" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const chapter = await db.chapter.findUnique({
      where: {
        courseId: params.courseId,
        id: params.chapterId,
      },
    });

    if (!chapter) {
      return new Response(JSON.stringify({ message: "Chapter not found" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (chapter.videoUrl) {
      const existingVideo = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingVideo) {
        await video.assets.delete(existingVideo.assetId);
        await db.muxData.delete({
          where: {
            chapterId: params.chapterId,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChaptersinCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersinCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[COURSE ID CHAPTERS DELETE]", error);
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
  { params }: { params: { courseId: string; chapterId: string } }
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

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized access to this course" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { isPublished, ...values } = await req.json();

    if (values.videoUrl) {
      const key = values.videoUrl.split("/").pop().split("?")[0];
      const url = `https://bucket.programmingmy.com/${key}`;
      values.videoUrl = url;
    }

    const chapter = await db.chapter.update({
      where: {
        courseId: params.courseId,
        id: params.chapterId,
      },
      data: {
        ...values,
      },
    });

    // upload video to MUX if provided
    if (values.videoUrl) {
      const existingVideo = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingVideo) {
        // check if the video in mux
        try {
          await video.assets.delete(existingVideo.assetId);
        } catch (error) {
          console.log("The video is not in mux");
        }

        await db.muxData.delete({
          where: {
            chapterId: params.chapterId,
          },
        });
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        test: false,
        playback_policy: ["public"],
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: params.chapterId,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return new NextResponse(JSON.stringify(chapter), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[COURSE ID CHAPTERS]", error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
