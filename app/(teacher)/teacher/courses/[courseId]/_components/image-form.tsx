"use client";
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';

import React, { useState } from 'react'
import { ImageIcon, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CourseFormProps } from '@/lib/types';
import Image from 'next/image';
import { DialogUploader } from '@/components/upload-component/dialog-uploader';
import { Dialog } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';


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
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsEditting(false);
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Image
                <Dialog open={isEditting} onOpenChange={setIsEditting}>
                    <DialogTrigger asChild>
                        <Button onClick={toggleEditting} variant='ghost' type='button'>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Upload image
                        </Button>
                    </DialogTrigger>
                    <DialogUploader
                        multiple={false}
                        maxFileCount={1}
                        maxSize={1024 * 1024 * 4}
                        accept={{
                            "image/*": [],
                        }}
                        onGetUrl={(responseData) => {
                            if (responseData) {
                                onSubmit({ imageUrl: responseData.fileUrl })
                            }
                        }}
                    />
                </Dialog>
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
                            src={`https://bucket.programmingmy.com/${initialData.imageUrl}`}
                            fill
                            className='rounded-md object-cover'
                        />
                    </div>
                )
            ) : (
                <div>

                </div>
            )}
        </div >
    )
}
