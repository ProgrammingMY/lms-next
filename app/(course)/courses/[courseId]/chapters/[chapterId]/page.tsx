import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

const ChapterIdPage = async ({
  params,
}: { params: { courseId: string; chapterId: string } }) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: user.id,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;


  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You have completed this chapter"
          variant="success"
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this chapter to continue"
          variant="warning"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
              <div>
                {/* TODO: Add course progress */}
              </div>
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview
              value={chapter.description!}
            />
            {!!attachments.length && (
              <>
                <Separator />
                <div className="p-4">
                  {attachments.map((attachment) => (
                    <a
                      href={attachment.fileUrl}
                      key={attachment.id}
                      target="_blank"
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.fileName}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default ChapterIdPage