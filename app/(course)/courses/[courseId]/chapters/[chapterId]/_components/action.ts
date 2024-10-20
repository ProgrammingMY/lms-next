"use server";

import axios from "axios";

const secret = process.env.TOYYIB_SECRET_KEY!;

export async function createCategory(catname: string, catdescription: string) {
  try {
    const bill = await axios.post(
      "https://dev.toyyibpay.com/index.php/api/createCategory",
      {
        catname: catname,
        catdescription: catdescription,
        userSecretKey: secret,
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

    console.log(bill.data);
  } catch (error) {
    console.log(error);
  }
}
