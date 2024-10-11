"use client";
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MuxPlayer from '@mux/mux-player-react'

import React, { useState } from 'react'
import { ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CourseFormProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { SubmitButton } from '@/components/upload-component/submit-button';
import { uploadFileAction } from '@/components/upload-component/actions';
import { useFormState } from 'react-dom';
import { Chapter, MuxData } from '@prisma/client';

interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}


const formSchema = z.object({
    videoUrl: z.string().min(1),
});

const initialState = {
    message: "",
    status: "",
}


export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [state, uploadFormAction] = useFormState(uploadFileAction, initialState)
    const { toast } = useToast();
    const router = useRouter();

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast({
                title: "Success",
                description: "Chapter updated successfully.",
                variant: "default",
            });
            setIsEditting(false);
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course video
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting && (
                        <>Cancel</>
                    )}
                    {!isEditting && !initialData.videoUrl && (
                        <>

                            <PlusCircle className='h-4 w-4 mr-2' />
                            Upload video

                        </>
                    )}
                    {!isEditting && initialData.videoUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditting ? (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <MuxPlayer
                            playbackId={initialData.muxData?.playbackId || ""}
                        />
                    </div>
                )
            ) : (
                <div>
                    <form action={uploadFormAction}>
                        <input type="file" id="file" name="file" accept="images/*" />
                        <SubmitButton />
                    </form>
                    {
                        state?.status && state.status === "error" && (
                            <p className='text-sm text-red-500'>{state.message}</p>
                        )
                    }
                    {
                        state?.status && state.status === "success" && (
                            <p className='text-sm text-green-500'>{state.message}</p>
                        )
                    }
                </div>
            )}
            {initialData.videoUrl && !isEditting && (
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div >
    )
}
