import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export const PurchaseCard = ({
    courseId,
}: {
    courseId: string
}) => {
    return (
        <>
            <CardHeader>
                <CardTitle className="mb-2">You already purchased this course</CardTitle>
                <Separator />
            </CardHeader>
            <CardFooter>
                <Link href={`/courses/${courseId}`}>
                    <Button variant={"default"}>
                        Continue to course
                    </Button>
                </Link>
            </CardFooter>
        </>

    )
}
