"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({ isUploading }: { isUploading: boolean }) {
    return (
        <Button type="submit" className="w-full" aria-disabled={isUploading}>
            {isUploading ? <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
            </> : "Upload File"}
        </Button>
    );
}