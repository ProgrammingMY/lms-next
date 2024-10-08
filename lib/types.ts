export interface CourseFormProps {
    initialData: {
        title: string;
        id: string;
        description: string | null;
        userId: string;
        imageUrl: string | null;
        price: number | null;
        isPublished: boolean;
        categoryId: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    courseId: string;
}