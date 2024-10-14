"use client";

import React, { useCallback, useState } from 'react'
import { type FileRejection, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { getURL, signedURLParams } from './actions';
import { db } from '@/lib/db';

interface DropzoneProps {
    onUpload: (url: string) => void;
}


export const MyDropzone = ({ onUpload }: DropzoneProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const { toast } = useToast();

    const updateDb = async () => {
        try {


        } catch {
            toast({
                title: "Error",
                description: "Error occured when trying to update database",
                variant: "destructive",
            })
        }
    }

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles.length > 0) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFiles
            ])
        };

        if (rejectedFiles.length > 0) {
            toast({
                title: `${rejectedFiles[0].file.name}`,
                description: `${rejectedFiles[0].errors[0].message}`,
                variant: "destructive",
            });
        }
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // max files
        // accepted files
        maxSize: 1024 * 1024 * 1, // 1MB
    })

    const removeFile = (file: File) => {
        setFiles(files.filter((f) => f.name !== file.name))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const responseData = [];

        if (files.length === 0) {
            toast({
                title: "Error",
                description: "No files selected",
                variant: "destructive",
            });
            return;
        }
        // upload files to server
        const formData = new FormData(e.currentTarget);

        files.forEach((file) => {
            formData.append("file", file);
        });

        const response = JSON.parse(await getURL(formData));

        if (response.status === "error") {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive",
            });
            return;
        }

        if (response.status === "success") {
            const res = await Promise.all(files.map((file: File, index: number) => {
                const signedURL = response.data[index].url;
                responseData.push({
                    fileName: file.name,
                    fileUrl: signedURL
                })
                return fetch(signedURL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });

            }));

            res.forEach((response) => {
                if (!response.ok) {
                    toast({
                        title: "Error",
                        description: "Something went wrong",
                        variant: "destructive",
                    });
                }
                else if (response.ok) {
                    toast({
                        title: "Success",
                        description: "File uploaded successfully",
                        variant: "default",
                    });

                    

                };
                setFiles([]);
            });
        }


    }

    return (
        <form onSubmit={handleSubmit}>
            <div {...getRootProps({
                className: 'border p-4 w-full h-full',
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>

            {files.length > 0 && (
                <div className='mt-4'>
                    <h2 className='text-xl'>Uploaded files</h2>
                    <ul className='flex flex-col gap-y-4 mt-4'>
                        {files.map((file) => (
                            <li key={file.name} className='flex items-center justify-between rounded-md p-2 border shadow-sm w-full'>
                                <p className='text-sm'>{file.name}</p>
                                <Button variant='ghost' onClick={() => removeFile(file)}>
                                    <X className='h-4 w-4' />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Button type='submit' variant="default" disabled={files.length === 0}>
                Upload
            </Button>
        </form>
    )
}