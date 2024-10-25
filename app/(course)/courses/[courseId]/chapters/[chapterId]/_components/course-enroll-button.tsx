"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { getBill } from "../../../../../../(checkout)/courses/[courseId]/checkout/_components/get-bill-action";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, useToast } from "@/components/hooks/use-toast";

export const CourseEnrollButton = ({
    price,
    courseId
}: { price: number, courseId: string }) => {
    const router = useRouter();

    return (
        <Button onClick={() => router.push(`/courses/${courseId}/checkout`)} size={"sm"} className="w-full md:w-auto">
            Purchase course for {formatPrice(price)}
        </Button>
    )
}
