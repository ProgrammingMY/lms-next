"use server";

import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export async function getStatusBill(
  courseId: string,
  billCode: string | null,
  transactionId: string | null
): Promise<{ status: "200" | "400" | "500"; message: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { status: "400", message: "User not found" };
    }

    if (!billCode || !transactionId) {
      return {
        status: "400",
        message: "Bill code and transaction id are required",
      };
    }

    let purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      }
    });

    if (purchase) {
      return { status: "400", message: "Already purchased" };
    }

    const billCodeFromDb = await db.stripeCustomer.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (!billCodeFromDb || billCodeFromDb.billCode !== billCode) {
      return { status: "400", message: "Bill code is invalid" };
    }

    const result = await axios.post(
      `${process.env.TOYYIB_URL}/index.php/api/getBillTransactions`,
      {
        billCode: billCode,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );

    const status = result.data[0].billpaymentStatus;

    if (status === "1") {
      purchase = await db.purchase.create({
        data: {
          courseId: courseId,
          userId: user.id,
        },
      });

      return { status: "200", message: "Purchase success" };
    }

    if (status === "3") {
      return { status: "200", message: "Purchase failed" };
    }

    return { status: "400", message: "Purchase pending" };
  } catch (error) {
    console.log(error);
    return { status: "500", message: "Internal server error" };
  }
}
