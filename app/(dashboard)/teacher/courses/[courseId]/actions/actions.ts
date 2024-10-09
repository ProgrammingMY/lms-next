"use server";

// upload file to S3

import { createClient } from "@/utils/supabase/server";
import { Key } from "lucide-react";
import { revalidatePath } from "next/cache";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY as string,
    secretAccessKey: process.env.R2_SECRET_KEY as string,
  },
  forcePathStyle: true,
});

async function uploadFileToS3(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: process.env.CF_BUCKET_NAME as string,
    Key: `${filename}`,
    Body: buffer,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading file to S3");
  }
}

export const uploadFileAction = async (prevState: any, formData: FormData) => {
  try {
    const files = formData.getAll("file");
    const uploadedFiles = [];

    if (!files) {
      return { status: "error", message: "No attachment provided" };
    }

    for (const file of files as File[]) {
      const response = await uploadFileToS3(file, file.name);
      if (response.$metadata.httpStatusCode !== 200) {
        continue;
      }

      uploadedFiles.push(file.name);
    }
    return { status: "success", message: "File uploaded successfully" };
  } catch (error) {
    return { status: "error", message: "Something went wrong" };
  }
};
