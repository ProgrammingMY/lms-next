"use client";

import { useConfettiStore } from "@/components/hooks/use-confetti-store";
import { useToast } from "@/components/hooks/use-toast";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const Action = ({
    disabled,
    courseId,
    isPublished
}: ActionProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const confetti = useConfettiStore();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast({
                    title: "Success",
                    description: "Course unpublished successfully.",
                    variant: "default",
                });
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast({
                    title: "Success",
                    description: "Course published successfully.",
                    variant: "default",
                });
                confetti.onOpen();
            }

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

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast({
                title: "Success",
                description: "Course deleted successfully.",
                variant: "default",
            });
            router.refresh();
            router.push(`/teacher/courses`);

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
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant='outline'
                size={'sm'}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={'sm'} variant='destructive' disabled={isLoading}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Action