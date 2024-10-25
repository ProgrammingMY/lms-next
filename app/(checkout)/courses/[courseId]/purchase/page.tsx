"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { getStatusBill } from "./action-get-status-bill";
import { useEffect, useState } from "react";
import { Banner } from "@/components/banner";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const PurchaseReturn = ({
    params
}: {
    params: { courseId: string, chapterId: string }
}) => {
    const router = useRouter();
    const [status, setStatus] = useState({ status: "", message: "" });
    const searchParams = useSearchParams();
    const billCode = searchParams.get('billcode');
    const transactionId = searchParams.get('transaction_id');

    useEffect(() => {
        const getStatus = async () => {
            const data = await getStatusBill(params.courseId, billCode, transactionId);
            setStatus(data);
        }

        getStatus();
    }, []);

    if (status.status === "200") {
        return router.push(`/courses/${params.courseId}`);
    }


    return (
        <>
            {status.status === "400" && status.message === "Already purchased" && (
                <Banner
                    label="You have already purchased this course"
                    variant={"success"}
                />
            )}
        </>
    )
}


export default PurchaseReturn;