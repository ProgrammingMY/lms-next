"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FileDropzone } from "./dropzone";
import { type DropzoneProps } from 'react-dropzone';

interface DialogUploaderProps {
    onGetUrl: (responseData: {
        fileName: string;
        fileUrl: string;
    }) => void;
    maxSize?: number;
    maxFileCount?: number;
    accept?: DropzoneProps["accept"];
    multiple?: boolean;
}

export function DialogUploader({
    onGetUrl,
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    accept = {
        "image/*": [],
    },
    multiple = false,
}: DialogUploaderProps) {
    const [files, setFiles] = React.useState<File[]>([])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Upload files {files.length > 0 && `(${files.length})`}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Upload files</DialogTitle>
                    <DialogDescription>
                        Drag and drop your files here or click to browse.
                    </DialogDescription>
                </DialogHeader>
                <FileDropzone
                    maxFileCount={maxFileCount}
                    maxSize={maxSize}
                    onValueChange={setFiles}
                    onGetUrl={onGetUrl}
                    multiple={multiple}
                />
            </DialogContent>
        </Dialog>
    )
}