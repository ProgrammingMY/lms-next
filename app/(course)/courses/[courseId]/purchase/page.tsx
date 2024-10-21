"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { getStatusBill } from "./action-get-status-bill";
import { useEffect, useState } from "react";

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
            const data = await getStatusBill(params.courseId, params.chapterId, billCode, transactionId);
            setStatus(data);
        }

        getStatus();
    }, []);

    if (status.status === "200") {
        return router.push(`/courses/${params.courseId}`);
    }


    return (
        <div>
            {status.message}
        </div>
    )
}


export default PurchaseReturn;