"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";


interface PreviewProps {
    value: string;
};

export const Preview = ({ value }: PreviewProps) => {
    // import like this to avoid hydration errors
    // client component still rendered on server side the first time
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

    return (
        <ReactQuill
            theme="bubble"
            value={value}
            readOnly
        />
    )
}