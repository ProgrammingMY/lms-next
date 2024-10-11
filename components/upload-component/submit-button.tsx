"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="submit-button" aria-disabled={pending}>
            {pending ? <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
            </> : "Upload File"}
        </Button>
    );
}