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

import React, { useState } from 'react'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CourseFormProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { SubmitButton } from './submit-button';
import { uploadFileAction } from '../_actions/actions';
import { useFormState } from 'react-dom';


const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});

const initialState = {
    message: "",
    status: "",
}


export const ImageForm = ({ initialData, courseId }: CourseFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [state, uploadFormAction] = useFormState(uploadFileAction, initialState)
    const { toast } = useToast();
    const router = useRouter();

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                title: "Success",
                description: "Image uploaded successfully.",
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
                Course Image
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Upload image
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                !initialData.imageUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <Image
                            alt="course image"
                            src={initialData.imageUrl}
                            fill
                            className='rounded-md object-cover'
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
        </div >
    )
}
