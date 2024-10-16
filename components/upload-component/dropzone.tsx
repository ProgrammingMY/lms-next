"use client";

import React, { useCallback, useEffect, useState } from 'react'
import Image from "next/image"
import Dropzone, { type FileRejection, type DropzoneProps } from 'react-dropzone'

import { getURL, signedURLParams } from './actions';
import { X, File, UploadIcon } from 'lucide-react';

import { useToast } from '../hooks/use-toast';
import { cn } from "@/lib/utils"
import { formatBytes } from '@/lib/format';
import { useControllableState } from "@/components/hooks/use-controllable-state"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SubmitButton } from './submit-button';


interface ResponseDataProps {
    fileName: string;
    fileUrl: string;
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Value of the uploader.
     * @type File[]
     * @default undefined
     * @example value={files}
     */
    value?: File[]

    /**
     * Function to be called when the value changes.
     * @type (files: File[]) => void
     * @default undefined
     * @example onValueChange={(files) => setFiles(files)}
     */
    onValueChange?: (files: File[]) => void

    onGetUrl: (responseData: ResponseDataProps) => void;

    /**
     * Function to be called when files are uploaded.
     * @type (files: File[]) => Promise<void>
     * @default undefined
     * @example onUpload={(files) => uploadFiles(files)}
     */
    onUpload?: (files: File[]) => Promise<void>

    /**
     * Progress of the uploaded files.
     * @type Record<string, number> | undefined
     * @default undefined
     * @example progresses={{ "file1.png": 50 }}
     */
    progresses?: Record<string, number>

    /**
     * Accepted file types for the uploader.
     * @type { [key: string]: string[]}
     * @default
     * ```ts
     * { "image/*": [] }
     * ```
     * @example accept={["image/png", "image/jpeg"]}
     */
    accept?: DropzoneProps["accept"]

    /**
     * Maximum file size for the uploader.
     * @type number | undefined
     * @default 1024 * 1024 * 2 // 2MB
     * @example maxSize={1024 * 1024 * 2} // 2MB
     */
    maxSize?: DropzoneProps["maxSize"]

    /**
     * Maximum number of files for the uploader.
     * @type number | undefined
     * @default 1
     * @example maxFileCount={4}
     */
    maxFileCount?: DropzoneProps["maxFiles"]

    /**
     * Whether the uploader should accept multiple files.
     * @type boolean
     * @default false
     * @example multiple
     */
    multiple?: boolean

    /**
     * Whether the uploader is disabled.
     * @type boolean
     * @default false
     * @example disabled
     */
    disabled?: boolean
}


export const FileDropzone = ({
    value: valueProp,
    onValueChange,
    onUpload,
    onGetUrl,
    progresses,
    accept = {
        "image/*": [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
}: FileUploaderProps) => {
    const [files, setFiles] = useControllableState({
        prop: valueProp,
        onChange: onValueChange,
    });
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
                toast({
                    title: "Error",
                    description: "Cannot upload more than 1 file at a time",
                    variant: "destructive"
                })
                return
            }

            if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
                toast({
                    title: "Error",
                    description: `Cannot upload more than ${maxFileCount} files`,
                    variant: "destructive"
                })
                return
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )

            const updatedFiles = files ? [...files, ...newFiles] : newFiles

            setFiles(updatedFiles)

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    toast({
                        title: "Error",
                        description: `File ${file.name} was rejected`,
                        variant: "destructive"
                    })
                })
            }

            if (
                onUpload &&
                updatedFiles.length > 0 &&
                updatedFiles.length <= maxFileCount
            ) {
                const target =
                    updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

                toast({
                    title: "Uploading",
                    description: `Uploading ${target}...`,
                    onLoad: () => {
                        setFiles([])
                        return `${target} uploaded`
                    },
                    onError: () => `Failed to upload ${target}`,
                })
            }
        },

        [files, maxFileCount, multiple, onUpload, setFiles]
    )

    const onRemove = (index: number) => {
        if (!files) return
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onValueChange?.(newFiles)
    }

    // onsubmit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        const responseData: ResponseDataProps[] = [];

        if (!files) return

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

            res.forEach((response, index: number) => {
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
                    onGetUrl({
                        fileName: responseData[index].fileName,
                        fileUrl: response.url
                    });
                };
            });
            setFiles([]);
            setIsUploading(false);
        }
        setIsUploading(false);
    }

    // Revoke preview url when component unmounts
    useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => {
                if (isFileWithPreview(file)) {
                    URL.revokeObjectURL(file.preview)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount

    return (
        <div >
            <form className="relative flex flex-col gap-6 overflow-hidden" onSubmit={handleSubmit}>
                <Dropzone
                    onDrop={onDrop}
                    accept={accept}
                    maxSize={maxSize}
                    maxFiles={maxFileCount}
                    multiple={maxFileCount > 1 || multiple}
                    disabled={isDisabled}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isDragActive && "border-muted-foreground/50",
                                isDisabled && "pointer-events-none opacity-60",
                                className
                            )}
                            {...dropzoneProps}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                    <div className="rounded-full border border-dashed p-3">
                                        <UploadIcon
                                            className="size-7 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p className="font-medium text-muted-foreground">
                                        Drop the files here
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                    <div className="rounded-full border border-dashed p-3">
                                        <UploadIcon
                                            className="size-7 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-px">
                                        <p className="font-medium text-muted-foreground">
                                            Drag {`'n'`} drop files here, or click to select files
                                        </p>
                                        <p className="text-sm text-muted-foreground/70">
                                            You can upload
                                            {maxFileCount > 1
                                                ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount}
                          files (up to ${formatBytes(maxSize)} each)`
                                                : ` a file with ${formatBytes(maxSize)}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>
                {files?.length ? (
                    <ScrollArea className="h-fit w-full px-3">
                        <div className="flex max-h-48 flex-col gap-4">
                            {files?.map((file, index) => (
                                <FileCard
                                    key={index}
                                    file={file}
                                    onRemove={() => onRemove(index)}
                                    progress={progresses?.[file.name]}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                ) : null}
                <SubmitButton isUploading={isUploading} />
            </form>
        </div>
    )
}

interface FileCardProps {
    file: File
    onRemove: () => void
    progress?: number
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5">
                {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    {progress ? <Progress value={progress} /> : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                >
                    <X className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    )
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return "preview" in file && typeof file.preview === "string"
}

interface FilePreviewProps {
    file: File & { preview: string }
}

function FilePreview({ file }: FilePreviewProps) {
    if (file.type.startsWith("image/")) {
        return (
            <Image
                src={file.preview}
                alt={file.name}
                width={48}
                height={48}
                loading="lazy"
                className="aspect-square shrink-0 rounded-md object-cover"
            />
        )
    }

    return (
        <File
            className="size-10 text-muted-foreground"
            aria-hidden="true"
        />
    )
}