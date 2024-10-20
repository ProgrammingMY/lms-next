"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { getBill } from "./get-bill-action";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, useToast } from "@/components/hooks/use-toast";

export const CourseEnrollButton = ({
    price,
    courseId
}: { price: number, courseId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const onClick = async () => {
        try {
            setIsLoading(true);
            const data = await getBill(courseId);
            window.location.assign(data.message);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button disabled={isLoading} onClick={onClick} size={"sm"} className="w-full md:w-auto">
            Purchase course for {formatPrice(price)}
        </Button>
    )
}
