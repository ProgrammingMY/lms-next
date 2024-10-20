"use server";

import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { format, addMinutes } from "date-fns";

export async function getBill(
  courseId: string
): Promise<{ status: "200" | "400" | "404" | "500"; message: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { status: "400", message: "User not found" };
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
      return { status: "400", message: "Already purchased" };
    }

    if (!course) {
      return { status: "404", message: "Course not found" };
    }

    let toyyibCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!toyyibCustomer) {
      toyyibCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: user.email!,
        },
      });
    }

    const billDetails = {
      userSecretKey: process.env.TOYYIB_SECRET_KEY!,
      categoryCode: process.env.TOYYIB_CATEGORY_ID!,
      billName: course.title,
      billDescription: course.description,
      billPriceSetting: 1,
      billPayorInfo: 0, // change this
      billAmount: course.price! * 100,
      billReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}`,
      billCallbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}`, // successful payment
      billPaymentChannel: 0,
      billExpiryDate: format(addMinutes(new Date(), 10), "dd-MM-yyyy HH:mm:ss"),
    };

    const bill = await axios.post(
      `${process.env.TOYYIB_URL}/index.php/api/createBill`,
      billDetails,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );

    const url = `${process.env.TOYYIB_URL}/${bill.data[0].BillCode}`;

    return { status: "200", message: url };
  } catch (error) {
    console.log(error);
    return { status: "500", message: "Internal server error" };
  }
}
