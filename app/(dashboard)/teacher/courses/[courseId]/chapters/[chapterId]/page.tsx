import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const ChapterIdPage = async (
    {
        params
    }: {
        params: { courseId: string, chapterId: string }
    }) => {

    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    };

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            muxData: true,
        }
    });

    return (
        <div>ChapterIdPage</div>
    )
}

export default ChapterIdPage