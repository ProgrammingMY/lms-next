"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";


interface EditorProps {
    value: string;
    onChange: (value: string) => void;
};

export const Editor = ({ value, onChange }: EditorProps) => {
    // import like this to avoid hydration errors
    // client component still rendered on server side the first time
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

    return (
        <div className='bg-white'>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
            />
        </div>
    )
}