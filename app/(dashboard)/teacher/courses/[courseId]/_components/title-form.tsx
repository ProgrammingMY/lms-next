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
import { init } from 'next/dist/compiled/webpack/webpack';
import { Pencil } from 'lucide-react';

interface TitleFormProps {
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

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

function TitleForm({ initialData, courseId }: TitleFormProps) {
    const [isEditting, setIsEditting] = useState(false);

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Title
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Title
                    </>
                    }
                </Button>
            </div>
        </div>
    )
}

export default TitleForm