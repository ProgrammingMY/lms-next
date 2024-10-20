"use client";

import { useConfettiStore } from "@/components/hooks/use-confetti-store";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

export const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId,
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted,
            });

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast({
                title: "Success",
                description: "Course progress updated.",
                variant: "default",
            })
            router.refresh();

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }
    }
    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            type="button"
            variant={isCompleted ? "outline" : "sucess"}
            className="w-full md:w-auto"
            onClick={onClick}
            disabled={isLoading}
        >
            {isCompleted ? "Not completed" : "Mark as complete"}
            <Icon className="ml-2 h-4 w-4" />
        </Button>
    )
}
