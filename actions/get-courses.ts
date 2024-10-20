import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface getCourses {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: getCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: title,
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const courseWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const coursePercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: coursePercentage,
          };
        })
      );

    return courseWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
