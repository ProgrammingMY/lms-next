"use client"

import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import React from 'react'
import { getBill } from './get-bill-action'

export const CheckoutButton = ({ courseId }: { courseId: string }) => {
    const onPayment = async () => {
        try {
            const data = await getBill(courseId);
            window.location.assign(data.message);
        } catch (error) {
            console.log("[CHECKOUT PAGE ERROR]")
        }
    }
    return (
        <Button className="flex-1" onClick={() => onPayment()}>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay with Toyyib Pay
        </Button>
    )
}
