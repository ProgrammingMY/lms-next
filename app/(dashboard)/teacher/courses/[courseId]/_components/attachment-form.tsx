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
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CourseFormProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Attachment, Course } from '@prisma/client';
import { MyDropzone } from '@/components/upload-component/dropzone';

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
});


export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [deletingId, setdeletingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
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

    const onDelete = async (id: string) => {
        try {
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast({
                title: "Success",
                description: "Attachment deleted successfully.",
                variant: "default",
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setdeletingId(null);
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Attachments
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a file
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>No attachments</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment) => (
                                <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border text-sky-700 rounded-md'>

                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />

                                    <p className='text-xs line-clamp-1'>{attachment.fileName}</p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        </div>
                                    )}
                                    {deletingId === attachment.id && (
                                        <Button onClick={() => onDelete(attachment.id)} className='ml-auto hover:opacity-75 transition'>
                                            <X className='h-4 w-4' />
                                        </Button>
                                    )}
                                </div>
                            ))}

                        </div>
                    )}
                </>
            )
                : <>
                    <MyDropzone onUpload={(url) => {
                        if (url) {
                            onSubmit({ url: url })
                        }
                    }} />
                </>
            }
        </div >
    )
}
