import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { redirect } from "next/navigation";
import { CheckoutButton } from "./_components/checkout-button";
import { createClient } from "@/utils/supabase/server";
import { Banner } from "@/components/banner";
import { PurchaseCard } from "./_components/purchased-card";

const CheckoutPage = async ({
    params,
}: {
    params: {
        courseId: string
    }
}) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    });

    if (!course) {
        return redirect("/courses");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                courseId: params.courseId,
                userId: user.id,
            }
        }
    });

    let imageUrl = "https://bucket.programmingmy.com/" + course.imageUrl;

    return (
        <>

            <div className="flex items-center justify-center pt-8">
                <Card className="w-[450px]">
                    {purchase ? <PurchaseCard courseId={params.courseId} /> :
                        <>
                            <CardHeader>
                                <CardTitle className="mb-2">Checkout</CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent className="grid gap-y-4">
                                <img className="rounded-md" src={imageUrl!} alt={course?.title} />
                                <CardTitle>
                                    {course?.title}
                                </CardTitle>
                                <CardDescription>
                                    {course?.description}
                                </CardDescription>
                            </CardContent>
                            <CardContent className="grid gap-y-4">
                                <Separator />
                                <CardTitle>
                                    Bonus
                                </CardTitle>
                                <CardDescription>

                                </CardDescription>
                            </CardContent>
                            <CardContent className="grid gap-y-4">
                                <Separator />
                                <div>
                                    <h2>Total</h2>
                                    <h1 className="font-medium text-2xl">
                                        {formatPrice(course?.price!)}
                                    </h1>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <CheckoutButton courseId={course.id} />
                            </CardFooter>

                        </>
                    }

                </Card>
            </div>
        </>
    )
}

export default CheckoutPage;