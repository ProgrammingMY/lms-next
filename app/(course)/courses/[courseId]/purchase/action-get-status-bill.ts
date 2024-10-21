"use server";

import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export async function getStatusBill(
  courseId: string,
  chapterId: string,
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
      const purchase = await db.purchase.create({
        data: {
          courseId: courseId,
          userId: user.id,
        }
      });

      return { status: "200", message: "success" };
    }

    // purchase failed
    return { status: "400", message: "Purchase failed" };
  } catch (error) {
    console.log(error);
    return { status: "500", message: "Internal server error" };
  }
}
